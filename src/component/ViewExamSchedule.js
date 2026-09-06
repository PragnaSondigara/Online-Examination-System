import React, { useEffect, useState } from "react";
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

  // =========================================================
  // FETCH DATA
  // =========================================================

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [examsResponse, subjectsResponse, facultiesResponse] =
        await Promise.all([
          fetch(`${API_URL}/tbl_exam`),
          fetch(`${API_URL}/tbl_subject`),
          fetch(`${API_URL}/tbl_faculty`),
        ]);

      if (!examsResponse.ok || !subjectsResponse.ok || !facultiesResponse.ok) {
        throw new Error("Failed to fetch schedule data");
      }

      const examsData = await examsResponse.json();
      const subjectsData = await subjectsResponse.json();
      const facultiesData = await facultiesResponse.json();

      console.log("Exams:", examsData);
      console.log("Subjects:", subjectsData);
      console.log("Faculties:", facultiesData);

      setExams(examsData);
      setSubjects(subjectsData);
      setFaculties(facultiesData);
    } catch (err) {
      console.error("Fetch Error:", err);

      setError(
        "Unable to load schedule. Please check whether JSON Server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchData();
  }, []);

  // =========================================================
  // GET SUBJECT
  //
  // tbl_exam.subject_id
  //        ↓
  // tbl_subject.id
  // =========================================================

  const getSubject = (subjectId) => {
    return subjects.find((subject) => String(subject.id) === String(subjectId));
  };

  // =========================================================
  // GET FACULTY
  //
  // tbl_exam.faculty_id
  //        ↓
  // tbl_faculty.id
  // =========================================================

  const getFaculty = (facultyIdValue) => {
    return faculties.find(
      (faculty) => String(faculty.id) === String(facultyIdValue),
    );
  };

  // =========================================================
  // ACTIVE EXAMS
  //
  // Student should see active exams only
  // =========================================================

  const activeExams = exams.filter((exam) => exam.is_active === true);

  // =========================================================
  // AVAILABLE SUBJECTS
  // =========================================================

  const availableSubjects = subjects.filter((subject) => {
    return activeExams.some(
      (exam) => String(exam.subject_id) === String(subject.id),
    );
  });

  // =========================================================
  // AVAILABLE DATES
  // =========================================================

  const availableDates = [
    ...new Set(activeExams.map((exam) => exam.date).filter(Boolean)),
  ].sort();

  // =========================================================
  // FILTER SCHEDULE
  // =========================================================

  const filteredExams = activeExams.filter((exam) => {
    const subject = getSubject(exam.subject_id);
    const faculty = getFaculty(exam.faculty_id);

    const search = searchTerm.toLowerCase().trim();

    // ===================================================
    // SEARCH
    // ===================================================

    const matchesSearch =
      search === "" ||
      subject?.subject_name?.toLowerCase().includes(search) ||
      faculty?.faculty_name?.toLowerCase().includes(search) ||
      exam.date?.toLowerCase().includes(search) ||
      exam.start_time?.toLowerCase().includes(search) ||
      exam.end_time?.toLowerCase().includes(search);

    // ===================================================
    // SUBJECT FILTER
    // ===================================================

    const matchesSubject =
      selectedSubject === "all" ||
      String(exam.subject_id) === String(selectedSubject);

    // ===================================================
    // DATE FILTER
    // ===================================================

    const matchesDate =
      selectedDate === "all" || String(exam.date) === String(selectedDate);

    return matchesSearch && matchesSubject && matchesDate;
  });

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSubject("all");
    setSelectedDate("all");
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

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

  // =========================================================
  // GET DAY
  // =========================================================

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

  // =========================================================
  // CALCULATE DURATION
  // =========================================================

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

  const handleStartExam = (exam) => {
    if (!exam.is_active) {
      alert("This exam is currently inactive.");
      return;
    }

    // Store selected exam
    localStorage.setItem("examId", exam.id);

    // Go to exam page
    navigate("/StartExam");
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <>
      <StudentSider />

      <Header />

      <div className="schedule-page">
        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="schedule-page-header">
          <div>
            <h1>Exam Schedule</h1>

            <p>View examination schedules for all active exams.</p>
          </div>
        </div>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="schedule-error">
            <span>{error}</span>

            <button type="button" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        {/* ===================================================
            STATISTICS
        =================================================== */}

        <div className="schedule-stat-grid">
          <div className="schedule-stat-card">
            <div className="schedule-stat-icon">📅</div>

            <div>
              <span>Active Exams</span>

              <strong>{activeExams.length}</strong>
            </div>
          </div>

          <div className="schedule-stat-card">
            <div className="schedule-stat-icon">📚</div>

            <div>
              <span>Subjects</span>

              <strong>{availableSubjects.length}</strong>
            </div>
          </div>
        </div>

        {/* ===================================================
            MAIN SCHEDULE CARD
        =================================================== */}

        <div className="schedule-card">
          {/* HEADER */}

          <div className="schedule-list-header">
            <div>
              <h2>Exam Schedule</h2>

              <p>Examination schedules for active exams.</p>
            </div>

            <div className="schedule-count">{filteredExams.length} Exams</div>
          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="schedule-filters">
            {/* SEARCH */}

            <div className="schedule-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search subject, faculty or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* SUBJECT */}

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

            {/* DATE */}

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

            {/* CLEAR */}

            <button
              type="button"
              className="clear-schedule-btn"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (
            <div className="schedule-loading">
              <div className="schedule-spinner"></div>

              <p>Loading exam schedules...</p>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="schedule-no-data">
              <div className="no-data-icon">📅</div>

              <h3>No Exam Schedule Found</h3>

              <p>No active exams were found matching the selected filters.</p>
            </div>
          ) : (
            /* =================================================
               EXAM CARDS
            ================================================= */

            <div className="schedule-card-grid">
              {filteredExams.map((exam, index) => {
                const subject = getSubject(exam.subject_id);

                const faculty = getFaculty(exam.faculty_id);

                return (
                  <div className="modern-exam-card" key={exam.id}>
                    {/* TOP SECTION */}
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

                    {/* DATE SECTION */}
                    <div className="modern-date-box">
                      <div className="date-left">
                        <span className="date-label">EXAM DATE</span>

                        <strong>{formatDate(exam.date)}</strong>

                        <small>{getDay(exam.date)}</small>
                      </div>

                      <div className="date-icon">📅</div>
                    </div>

                    {/* EXAM INFORMATION */}
                    <div className="modern-info-grid">
                      {/* TIME */}
                      <div className="modern-info-item">
                        <div className="info-icon">🕐</div>

                        <div>
                          <span>Time</span>

                          <strong>
                            {exam.start_time} - {exam.end_time}
                          </strong>
                        </div>
                      </div>

                      {/* DURATION */}
                      <div className="modern-info-item">
                        <div className="info-icon">⏱</div>

                        <div>
                          <span>Duration</span>

                          <strong>
                            {calculateDuration(exam.start_time, exam.end_time)}
                          </strong>
                        </div>
                      </div>

                      {/* MARKS */}
                      <div className="modern-info-item">
                        <div className="info-icon">📝</div>

                        <div>
                          <span>Total Marks</span>

                          <strong>{exam.total_marks}</strong>
                        </div>
                      </div>

                      {/* PASSING MARKS */}
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

                    <button
                      type="button"
                      className="modern-view-btn"
                      onClick={() => handleStartExam(exam)}
                    >
                      Start Exam <span>→</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* =================================================
              FOOTER
          ================================================= */}

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
