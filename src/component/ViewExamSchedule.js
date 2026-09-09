import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewExamSchedule.css";

import StudentSider from "./StudentSider";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function ViewExamSchedule() {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================================
  // FETCH DATA
  // ================================

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const examsResponse = await axios.get(`${API_URL}/tbl_exam`);
      const subjectsResponse = await axios.get(`${API_URL}/tbl_subject`);
      const facultiesResponse = await axios.get(`${API_URL}/tbl_faculty`);

      setExams(examsResponse.data);
      setSubjects(subjectsResponse.data);
      setFaculties(facultiesResponse.data);
    } catch (err) {
      console.error("Fetch Error:", err);

      setError(
        "Unable to load schedule. Please check whether JSON Server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================================
  // GET SUBJECT
  // ================================

  const getSubject = (subjectId) => {
    return subjects.find((subject) => String(subject.id) === String(subjectId));
  };

  // ================================
  // GET FACULTY
  // ================================

  const getFaculty = (facultyId) => {
    return faculties.find(
      (faculty) => String(faculty.id) === String(facultyId),
    );
  };

  // ================================
  // ACTIVE EXAMS
  // ================================

  const activeExams = exams.filter((exam) => exam.is_active === true);

  // ================================
  // AVAILABLE SUBJECTS
  // ================================

  const availableSubjects = subjects.filter((subject) =>
    activeExams.some((exam) => String(exam.subject_id) === String(subject.id)),
  );

  // ================================
  // AVAILABLE DATES
  // ================================

  const availableDates = [
    ...new Set(activeExams.map((exam) => exam.date).filter(Boolean)),
  ].sort();

  // ================================
  // FILTER EXAMS
  // ================================

  const filteredExams = activeExams.filter((exam) => {
    const subject = getSubject(exam.subject_id);
    const faculty = getFaculty(exam.faculty_id);

    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      search === "" ||
      subject?.subject_name?.toLowerCase().includes(search) ||
      faculty?.faculty_name?.toLowerCase().includes(search) ||
      exam.date?.toLowerCase().includes(search) ||
      exam.start_time?.toLowerCase().includes(search) ||
      exam.end_time?.toLowerCase().includes(search);

    const matchesSubject =
      selectedSubject === "all" ||
      String(exam.subject_id) === String(selectedSubject);

    const matchesDate =
      selectedDate === "all" || String(exam.date) === String(selectedDate);

    return matchesSearch && matchesSubject && matchesDate;
  });

  // ================================
  // CLEAR FILTERS
  // ================================

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSubject("all");
    setSelectedDate("all");
  };

  // ================================
  // FORMAT DATE
  // ================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ================================
  // GET DAY
  // ================================

  const getDay = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      weekday: "long",
    });
  };

  // ================================
  // CALCULATE DURATION
  // ================================

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) {
      return "N/A";
    }

    const start = new Date(`1970-01-01T${startTime}`);

    const end = new Date(`1970-01-01T${endTime}`);

    let difference = end - start;

    if (difference < 0) {
      difference += 24 * 60 * 60 * 1000;
    }

    const minutes = Math.floor(difference / (1000 * 60));

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0 && remainingMinutes > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }

    if (hours > 0) {
      return `${hours}h`;
    }

    return `${remainingMinutes}m`;
  };

  // ================================
  // START EXAM
  // ================================

  const handleStartExam = (exam) => {
    if (!exam.is_active) {
      alert("This exam is currently inactive.");
      return;
    }

    const now = new Date();

    const examStart = new Date(`${exam.date}T${exam.start_time}:00`);

    const examEnd = new Date(`${exam.date}T${exam.end_time}:00`);

    // Before exam start
    if (now < examStart) {
      alert(
        `Exam has not started yet.\nExam starts at ${exam.start_time} on ${formatDate(
          exam.date,
        )}.`,
      );
      return;
    }

    // After exam end
    if (now > examEnd) {
      alert(
        `Exam has ended.\nExam ended at ${exam.end_time} on ${formatDate(
          exam.date,
        )}.`,
      );
      return;
    }

    // Exam is currently running
    localStorage.setItem("examId", exam.id);

    navigate("/StartExam");
  };

  // ================================
  // GET BUTTON STATUS
  // ================================

  const getExamStatus = (exam) => {
    if (!exam.is_active) {
      return "Inactive";
    }

    const now = new Date();

    const examStart = new Date(`${exam.date}T${exam.start_time}:00`);

    const examEnd = new Date(`${exam.date}T${exam.end_time}:00`);

    if (now < examStart) {
      return "Exam Not Started";
    }

    if (now > examEnd) {
      return "Exam Ended";
    }

    return "Start Exam";
  };

  // ================================
  // JSX
  // ================================

  return (
    <>
      <StudentSider />

      <Header />

      <div className="schedule-page">
        {error && (
          <div className="schedule-error">
            <span>{error}</span>

            <button type="button" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        {/* PAGE HEADER */}

        <div className="schedule-page-header">
          <div>
            <h1>Exam Schedule</h1>

            <p>View examination schedules for all active exams.</p>
          </div>
        </div>

        {/* EXAM SCHEDULE */}

        <div className="schedule-card">
          <div className="schedule-list-header">
            <div>
              <h2>Exam Schedule</h2>

              <p>Examination schedules for active exams.</p>
            </div>

            <div className="schedule-count">{filteredExams.length} Exams</div>
          </div>

          {/* FILTERS */}

          <div className="schedule-filters">
            <div className="schedule-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search subject, faculty or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="all">All Subjects</option>

              {availableSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subject_name}
                </option>
              ))}
            </select>

            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="all">All Dates</option>

              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {formatDate(date)}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="clear-schedule-btn"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="schedule-loading">
              <div className="schedule-spinner"></div>

              <p>Loading exam schedules...</p>
            </div>
          ) : filteredExams.length === 0 ? (
            /* NO DATA */

            <div className="schedule-no-data">
              <div className="no-data-icon">📅</div>

              <h3>No Exam Schedule Found</h3>

              <p>No active exams were found matching the selected filters.</p>
            </div>
          ) : (
            /* EXAM CARDS */

            <div className="schedule-card-grid">
              {filteredExams.map((exam) => {
                const subject = getSubject(exam.subject_id);

                const faculty = getFaculty(exam.faculty_id);

                const examStatus = getExamStatus(exam);

                const canStart = examStatus === "Start Exam";

                return (
                  <div className="modern-exam-card" key={exam.id}>
                    {/* CARD HEADER */}

                    <div className="modern-card-header">
                      <div className="modern-subject">
                        <div className="subject-circle">📚</div>

                        <div>
                          <span>SUBJECT</span>

                          <h3>{subject?.subject_name || "Unknown Subject"}</h3>
                        </div>
                      </div>

                      <span className="active-badge">● Active</span>
                    </div>

                    {/* DATE */}

                    <div className="modern-date-box">
                      <div className="date-left">
                        <span className="date-label">EXAM DATE</span>

                        <strong>{formatDate(exam.date)}</strong>

                        <small>{getDay(exam.date)}</small>
                      </div>

                      <div className="date-icon">📅</div>
                    </div>

                    {/* EXAM INFO */}

                    <div className="modern-info-grid">
                      <div className="modern-info-item">
                        <div className="info-icon">🕐</div>

                        <div>
                          <span>Time</span>

                          <strong>
                            {exam.start_time} - {exam.end_time}
                          </strong>
                        </div>
                      </div>

                      <div className="modern-info-item">
                        <div className="info-icon">⏱</div>

                        <div>
                          <span>Duration</span>

                          <strong>
                            {calculateDuration(exam.start_time, exam.end_time)}
                          </strong>
                        </div>
                      </div>

                      <div className="modern-info-item">
                        <div className="info-icon">📝</div>

                        <div>
                          <span>Total Marks</span>

                          <strong>{exam.total_marks}</strong>
                        </div>
                      </div>

                      <div className="modern-info-item">
                        <div className="info-icon">✓</div>

                        <div>
                          <span>Passing Marks</span>

                          <strong>{exam.passing_marks}</strong>
                        </div>
                      </div>
                    </div>

                    {/* FACULTY */}

                    <div className="modern-faculty-section">
                      <div className="modern-faculty-info">
                        <div className="modern-faculty-avatar">
                          {faculty?.faculty_name?.charAt(0)?.toUpperCase() ||
                            "F"}
                        </div>

                        <div>
                          <span>FACULTY</span>

                          <strong>{faculty?.faculty_name || "Faculty"}</strong>
                        </div>
                      </div>

                      <div className="exam-id-text">ID: {exam.id}</div>
                    </div>

                    {/* START BUTTON */}

                    <button
                      type="button"
                      className="modern-view-btn"
                      onClick={() => handleStartExam(exam)}
                      disabled={!canStart}
                    >
                      {examStatus}

                      {canStart && <span>→</span>}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* FOOTER */}

          <div className="schedule-list-footer">
            <span>
              Showing <strong>{filteredExams.length}</strong> of{" "}
              <strong>{activeExams.length}</strong> active exams
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
