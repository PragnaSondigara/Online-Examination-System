import React, { useEffect, useState } from "react";
import "./ViewExamSchedule.css";
import StudentSider from "./StudentSider";
import Header from "./Header";
import Footer from "./Footer";

const API_URL = "http://localhost:5000";

export default function ViewExamSchedule() {
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

      setExams(examsData);
      setSubjects(subjectsData);
      setFaculties(facultiesData);
    } catch (err) {
      console.error(err);

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
  // =========================================================

  const getSubject = (subjectId) => {
    return subjects.find(
      (subject) => String(subject.subject_id) === String(subjectId),
    );
  };

  // =========================================================
  // GET FACULTY
  // =========================================================

  const getFaculty = (facultyIdValue) => {
    return faculties.find(
      (faculty) => String(faculty.faculty_id) === String(facultyIdValue),
    );
  };

  // =========================================================
  // ALL FACULTY EXAMS
  // =========================================================

  const facultyExams = exams;

  // =========================================================
  // AVAILABLE SUBJECTS
  // =========================================================

  const availableSubjects = subjects.filter((subject) => {
    return exams.some(
      (exam) => String(exam.subject_id) === String(subject.subject_id),
    );
  });

  // =========================================================
  // AVAILABLE DATES
  // =========================================================

  const availableDates = [
    ...new Set(exams.map((exam) => exam.date).filter(Boolean)),
  ].sort();

  // =========================================================
  // FILTER SCHEDULE
  // =========================================================

  const filteredExams = facultyExams.filter((exam) => {
    const subject = getSubject(exam.subject_id);
    const faculty = getFaculty(exam.faculty_id);

    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
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

  // =========================================================
  // VIEW SCHEDULE DETAILS
  // =========================================================

  const handleViewDetails = (exam) => {
    const subject = getSubject(exam.subject_id);

    const faculty = getFaculty(exam.faculty_id);

    alert(
      `Subject: ${subject?.subject_name || "Unknown"}\n` +
        `Date: ${formatDate(exam.date)}\n` +
        `Day: ${getDay(exam.date)}\n` +
        `Time: ${exam.start_time || "N/A"} - ${exam.end_time || "N/A"}\n` +
        `Duration: ${calculateDuration(exam.start_time, exam.end_time)}\n` +
        `Faculty: ${faculty?.faculty_name || "Unknown Faculty"}`,
    );
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <>
      <StudentSider />

      <Header />

      <div className="schedule-page">
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="schedule-page-header">
          <div>
            <h1>Exam Schedule</h1>

            <p>View examination schedules for all faculties and subjects.</p>
          </div>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="schedule-error">
            <span>{error}</span>

            <button type="button" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <div className="schedule-stat-grid">
          <div className="schedule-stat-card">
            <div className="schedule-stat-icon">📅</div>

            <div>
              <span>Total Exams</span>

              <strong>{facultyExams.length}</strong>
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

        {/* =====================================================
            MAIN SCHEDULE CARD
        ===================================================== */}

        <div className="schedule-card">
          {/* HEADER */}

          <div className="schedule-list-header">
            <div>
              <h2>Exam Schedule</h2>

              <p>Examination schedules assigned to all faculties.</p>
            </div>

            <div className="schedule-count">{filteredExams.length} Exams</div>
          </div>

          {/* ===================================================
              FILTERS
          =================================================== */}

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
                <option key={subject.subject_id} value={subject.subject_id}>
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

          {/* ===================================================
              LOADING
          =================================================== */}

          {loading ? (
            <div className="schedule-loading">
              <div className="schedule-spinner"></div>

              <p>Loading exam schedules...</p>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="schedule-no-data">
              <div className="no-data-icon">📅</div>

              <h3>No Exam Schedule Found</h3>

              <p>No exams were found matching the selected filters.</p>
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
                  <div className="exam-schedule-card" key={exam.id}>
                    {/* CARD TOP */}

                    <div className="exam-card-top">
                      <div className="exam-subject-icon">📚</div>

                      <div className="exam-card-number">#{index + 1}</div>
                    </div>

                    {/* SUBJECT */}

                    <div className="exam-card-subject">
                      <h3>{subject?.subject_name || "Unknown Subject"}</h3>

                      <span>Subject ID: {exam.subject_id || "N/A"}</span>
                    </div>

                    {/* DATE */}

                    <div className="exam-date-section">
                      <div className="calendar-icon">📅</div>

                      <div>
                        <span>Exam Date</span>

                        <strong>{formatDate(exam.date)}</strong>

                        <small>{getDay(exam.date)}</small>
                      </div>
                    </div>

                    {/* TIME */}

                    <div className="exam-time-section">
                      <div className="time-item">
                        <span className="time-label">Start</span>

                        <strong>🕐 {exam.start_time || "N/A"}</strong>
                      </div>

                      <div className="time-divider"></div>

                      <div className="time-item">
                        <span className="time-label">End</span>

                        <strong>🕐 {exam.end_time || "N/A"}</strong>
                      </div>
                    </div>

                    {/* DURATION */}

                    <div className="exam-duration">
                      <span>⏱</span>

                      <div>
                        <small>Duration</small>

                        <strong>
                          {calculateDuration(exam.start_time, exam.end_time)}
                        </strong>
                      </div>
                    </div>

                    {/* CARD FOOTER */}

                    <div className="exam-card-footer">
                      <div className="exam-faculty">
                        <div className="mini-faculty-avatar">
                          {faculty?.faculty_name?.charAt(0)?.toUpperCase() ||
                            "F"}
                        </div>

                        <div>
                          <small>Faculty</small>
                          <strong>{faculty?.faculty_name || "Faculty"}</strong>
                        </div>
                      </div>

                      <button type="button" className="start-exam-btn">
                        Start Exam
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ===================================================
              FOOTER
          =================================================== */}

          <div className="schedule-list-footer">
            <span>
              Showing <strong>{filteredExams.length}</strong> of{" "}
              <strong>{facultyExams.length}</strong> total exams
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
