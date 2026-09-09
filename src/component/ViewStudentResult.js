import React, { useEffect, useState } from "react";
import "./ViewStudentResult.css";

import FacultySider from "./FacultySider";
import Header from "./Header";
import Footer from "./Footer";

const API_URL = "http://localhost:5000";

export default function ViewStudentResult() {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [assignedSubjects, setAssignedSubjects] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // GET LOGGED-IN FACULTY ID
  // =========================================================

  const facultyId = localStorage.getItem("facultyId");

  // =========================================================
  // FETCH DATA
  // =========================================================

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Check faculty login
      if (!facultyId) {
        setError("Faculty information not found. Please login again.");
        return;
      }

      // Fetch all required data
      const [
        resultsResponse,
        studentsResponse,
        examsResponse,
        subjectsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/tbl_result`),
        fetch(`${API_URL}/tbl_student`),
        fetch(`${API_URL}/tbl_exam`),
        fetch(`${API_URL}/tbl_subject`),
      ]);

      // Check responses
      if (!resultsResponse.ok) {
        throw new Error("Failed to fetch results");
      }

      if (!studentsResponse.ok) {
        throw new Error("Failed to fetch students");
      }

      if (!examsResponse.ok) {
        throw new Error("Failed to fetch exams");
      }

      if (!subjectsResponse.ok) {
        throw new Error("Failed to fetch subjects");
      }

      // Convert to JSON
      const resultsData = await resultsResponse.json();
      const studentsData = await studentsResponse.json();
      const examsData = await examsResponse.json();
      const subjectsData = await subjectsResponse.json();

      // Debug
      console.log("Faculty ID:", facultyId);
      console.log("Results:", resultsData);
      console.log("Students:", studentsData);
      console.log("Exams:", examsData);
      console.log("Subjects:", subjectsData);

      // =====================================================
      // GET FACULTY ASSIGNED SUBJECTS
      //
      // tbl_subject:
      // faculty_id -> tbl_faculty.id
      // id         -> subject id
      // =====================================================

      const facultySubjects = subjectsData.filter(
        (subject) =>
          String(subject.faculty_id) === String(facultyId) &&
          subject.is_active === true,
      );

      console.log("Faculty Assigned Subjects:", facultySubjects);

      // =====================================================
      // SET DATA
      // =====================================================

      setResults(resultsData);
      setStudents(studentsData);
      setExams(examsData);
      setSubjects(subjectsData);
      setAssignedSubjects(facultySubjects);
    } catch (err) {
      console.error("Fetch Error:", err);

      setError(
        "Unable to load student results. Please check whether JSON Server is running.",
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
  // GET STUDENT
  //
  // IMPORTANT:
  // tbl_student has "id", NOT "student_id"
  // =========================================================

  const getStudent = (studentId) => {
    return students.find((student) => String(student.id) === String(studentId));
  };

  // =========================================================
  // GET EXAM
  //
  // tbl_result.exam_id
  //        ↓
  // tbl_exam.id
  // =========================================================

  const getExam = (examId) => {
    return exams.find((exam) => String(exam.id) === String(examId));
  };

  // =========================================================
  // GET SUBJECT
  //
  // tbl_exam.subject_id
  //        ↓
  // tbl_subject.id
  //
  // IMPORTANT:
  // tbl_subject has "id", NOT "subject_id"
  // =========================================================

  const getSubject = (subjectId) => {
    return subjects.find((subject) => String(subject.id) === String(subjectId));
  };

  // =========================================================
  // CHECK SUBJECT BELONGS TO LOGGED-IN FACULTY
  // =========================================================

  const isAssignedSubject = (subjectId) => {
    return assignedSubjects.some(
      (subject) => String(subject.id) === String(subjectId),
    );
  };

  // =========================================================
  // GET FACULTY EXAMS
  //
  // Exam must belong to:
  // 1. Logged-in faculty
  // 2. Faculty assigned subject
  // =========================================================

  const facultyExams = exams.filter((exam) => {
    return (
      String(exam.faculty_id) === String(facultyId) &&
      isAssignedSubject(exam.subject_id)
    );
  });

  // =========================================================
  // GET FACULTY EXAM IDs
  // =========================================================

  const facultyExamIds = facultyExams.map((exam) => String(exam.id));

  // =========================================================
  // FILTER RESULTS
  //
  // Only show results whose exam belongs to
  // logged-in faculty.
  // =========================================================

  const facultyResults = results.filter((result) => {
    return facultyExamIds.includes(String(result.exam_id));
  });

  // =========================================================
  // FILTER + SEARCH
  // =========================================================

  const filteredResults = facultyResults.filter((result) => {
    const student = getStudent(result.student_id);

    const exam = getExam(result.exam_id);

    const subject = exam ? getSubject(exam.subject_id) : null;

    const search = searchTerm.toLowerCase().trim();

    // ===================================================
    // SEARCH
    // ===================================================

    const matchesSearch =
      search === "" ||
      student?.student_name?.toLowerCase().includes(search) ||
      student?.email?.toLowerCase().includes(search) ||
      subject?.subject_name?.toLowerCase().includes(search);

    // ===================================================
    // SUBJECT FILTER
    // ===================================================

    const matchesSubject =
      selectedSubject === "all" ||
      String(exam?.subject_id) === String(selectedSubject);

    // ===================================================
    // STATUS FILTER
    // ===================================================

    const matchesStatus =
      selectedStatus === "all" || result.status === selectedStatus;

    return matchesSearch && matchesSubject && matchesStatus;
  });

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalResults = facultyResults.length;

  const passCount = facultyResults.filter(
    (result) => result.status === "Pass",
  ).length;

  const failCount = facultyResults.filter(
    (result) => result.status === "Fail",
  ).length;

  const averagePercentage =
    facultyResults.length > 0
      ? (
          facultyResults.reduce(
            (sum, result) => sum + Number(result.percentage || 0),
            0,
          ) / facultyResults.length
        ).toFixed(1)
      : 0;

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSubject("all");
    setSelectedStatus("all");
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <>
      <FacultySider />

      <Header />

      <div className="student-result-page">
        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="result-page-header">
          <div>
            <h1>Student Exam Results</h1>

            <p>View student results for your assigned subjects.</p>
          </div>

          <div className="faculty-subject-info">
            <strong>Assigned Subjects: {assignedSubjects.length}</strong>
          </div>
        </div>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="result-error">
            <span>{error}</span>

            <button type="button" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        {/* ===================================================
            STATISTICS
        =================================================== */}

        <div className="result-stat-grid">
          <div className="result-stat-card">
            <div className="stat-icon">📊</div>

            <div>
              <span>Total Results</span>

              <strong>{totalResults}</strong>
            </div>
          </div>

          <div className="result-stat-card">
            <div className="stat-icon">✓</div>

            <div>
              <span>Passed</span>

              <strong>{passCount}</strong>
            </div>
          </div>

          <div className="result-stat-card">
            <div className="stat-icon">✕</div>

            <div>
              <span>Failed</span>

              <strong>{failCount}</strong>
            </div>
          </div>

          <div className="result-stat-card">
            <div className="stat-icon">%</div>

            <div>
              <span>Average Percentage</span>

              <strong>{averagePercentage}%</strong>
            </div>
          </div>
        </div>

        {/* ===================================================
            RESULT CARD
        =================================================== */}

        <div className="student-result-card">
          {/* HEADER */}

          <div className="result-list-header">
            <div>
              <h2>Result List</h2>

              <p>Results of students who appeared in your assigned subjects.</p>
            </div>

            <div className="result-count">{filteredResults.length} Results</div>
          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="result-filters">
            {/* SEARCH */}

            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search student or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* SUBJECT */}

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="all">All My Subjects</option>

              {assignedSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subject_name}
                </option>
              ))}
            </select>

            {/* STATUS */}

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>

              <option value="Pass">Pass</option>

              <option value="Fail">Fail</option>
            </select>

            {/* CLEAR */}

            <button
              type="button"
              className="clear-filter-btn"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (
            <div className="result-loading">
              <div className="spinner"></div>

              <p>Loading student results...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            /* =================================================
               NO DATA
            ================================================= */

            <div className="result-no-data">
              <div className="no-data-icon">📋</div>

              <h3>No Results Found</h3>

              <p>
                No student results are available for your assigned subjects.
              </p>
            </div>
          ) : (
            /* =================================================
               TABLE
            ================================================= */

            <div className="result-table-wrapper">
              <table className="student-result-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th>Subject</th>
                    <th>Exam Date</th>
                    <th>Total Marks</th>
                    <th>Obtained</th>
                    <th>Percentage</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredResults.map((result, index) => {
                    const student = getStudent(result.student_id);

                    const exam = getExam(result.exam_id);

                    const subject = exam ? getSubject(exam.subject_id) : null;

                    return (
                      <tr key={result.id}>
                        {/* NUMBER */}

                        <td>
                          <span className="row-number">{index + 1}</span>
                        </td>

                        {/* STUDENT */}

                        <td>
                          <div className="student-info">
                            <div className="student-avatar">
                              {student?.student_name
                                ?.charAt(0)
                                ?.toUpperCase() || "S"}
                            </div>

                            <div>
                              <strong>
                                {student?.student_name || "Unknown Student"}
                              </strong>

                              <span>{student?.email || "No email"}</span>
                            </div>
                          </div>
                        </td>

                        {/* SUBJECT */}

                        <td>
                          <div className="subject-info">
                            <strong>
                              {subject?.subject_name || "Unknown Subject"}
                            </strong>

                            <small>Exam ID: {result.exam_id}</small>
                          </div>
                        </td>

                        {/* DATE */}

                        <td>
                          <div className="date-info">
                            <strong>{exam?.date || "N/A"}</strong>

                            {exam && (
                              <small>
                                {exam.start_time} - {exam.end_time}
                              </small>
                            )}
                          </div>
                        </td>

                        {/* TOTAL MARKS */}

                        <td>
                          <span className="marks-text">
                            {result.total_marks}
                          </span>
                        </td>

                        {/* OBTAINED */}

                        <td>
                          <span className="obtained-marks">
                            {result.obtained_marks}
                          </span>
                        </td>

                        {/* PERCENTAGE */}

                        <td>
                          <div className="percentage-box">
                            <div className="percentage-value">
                              {result.percentage}%
                            </div>

                            <div className="progress-bar">
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${Math.min(
                                    Number(result.percentage) || 0,
                                    100,
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className={`status-badge ${
                              result.status === "Pass" ? "pass" : "fail"
                            }`}
                          >
                            {result.status === "Pass" ? "✓ Pass" : "✕ Fail"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="result-list-footer">
            <span>
              Showing <strong>{filteredResults.length}</strong> of{" "}
              <strong>{facultyResults.length}</strong> results
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
