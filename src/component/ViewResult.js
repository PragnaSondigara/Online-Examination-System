import React, { useEffect, useState } from "react";
import "./ViewResult.css";
import StudentSider from "./StudentSider";
import Header from "./Header";
import Footer from "./Footer";

const API_URL = "http://localhost:5000";

export default function ViewResult() {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [student, setStudent] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // GET LOGGED-IN STUDENT ID
  // =========================================================

  const studentId = localStorage.getItem("studentId");

  // =========================================================
  // FETCH DATA
  // =========================================================

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        resultsResponse,
        examsResponse,
        subjectsResponse,
        studentsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/tbl_result`),
        fetch(`${API_URL}/tbl_exam`),
        fetch(`${API_URL}/tbl_subject`),
        fetch(`${API_URL}/tbl_student`),
      ]);

      if (
        !resultsResponse.ok ||
        !examsResponse.ok ||
        !subjectsResponse.ok ||
        !studentsResponse.ok
      ) {
        throw new Error("Failed to fetch result data");
      }

      const resultsData = await resultsResponse.json();
      const examsData = await examsResponse.json();
      const subjectsData = await subjectsResponse.json();
      const studentsData = await studentsResponse.json();

      // -------------------------------------------------------
      // FIND LOGGED-IN STUDENT
      // -------------------------------------------------------

      const currentStudent = studentsData.find(
        (item) => String(item.student_id) === String(studentId),
      );

      setStudent(currentStudent || null);

      // -------------------------------------------------------
      // IMPORTANT:
      // ONLY STORE LOGGED-IN STUDENT RESULTS
      // -------------------------------------------------------

      const studentResults = resultsData.filter(
        (result) => String(result.student_id) === String(studentId),
      );

      setResults(studentResults);
      setExams(examsData);
      setSubjects(subjectsData);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load your results. Please check whether JSON Server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    if (studentId) {
      fetchData();
    }
  }, [studentId]);

  // =========================================================
  // GET EXAM
  // =========================================================

  const getExam = (examId) => {
    return exams.find((exam) => String(exam.id) === String(examId));
  };

  // =========================================================
  // GET SUBJECT
  // =========================================================

  const getSubject = (subjectId) => {
    return subjects.find(
      (subject) => String(subject.subject_id) === String(subjectId),
    );
  };

  // =========================================================
  // GET SUBJECT FROM RESULT
  // =========================================================

  const getResultSubject = (result) => {
    const exam = getExam(result.exam_id);

    if (!exam) {
      return null;
    }

    return getSubject(exam.subject_id);
  };

  // =========================================================
  // AVAILABLE SUBJECTS
  // =========================================================

  const availableSubjects = [
    ...new Map(
      results
        .map((result) => {
          const subject = getResultSubject(result);

          return subject ? [String(subject.subject_id), subject] : null;
        })
        .filter(Boolean),
    ).values(),
  ];

  // =========================================================
  // FILTER RESULTS
  // =========================================================

  const filteredResults = results.filter((result) => {
    const exam = getExam(result.exam_id);
    const subject = getResultSubject(result);

    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      subject?.subject_name?.toLowerCase().includes(search) ||
      exam?.date?.toLowerCase().includes(search) ||
      String(result.obtained_marks).toLowerCase().includes(search) ||
      String(result.percentage).toLowerCase().includes(search) ||
      result.status?.toLowerCase().includes(search);

    const matchesSubject =
      selectedSubject === "all" ||
      String(subject?.subject_id) === String(selectedSubject);

    const matchesStatus =
      selectedStatus === "all" ||
      result.status?.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesSubject && matchesStatus;
  });

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSubject("all");
    setSelectedStatus("all");
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
  // CALCULATE STATISTICS
  // =========================================================

  const totalResults = results.length;

  const passedResults = results.filter(
    (result) => result.status?.toLowerCase() === "pass",
  ).length;

  const failedResults = results.filter(
    (result) => result.status?.toLowerCase() === "fail",
  ).length;

  const averagePercentage =
    totalResults > 0
      ? (
          results.reduce(
            (sum, result) => sum + Number(result.percentage || 0),
            0,
          ) / totalResults
        ).toFixed(1)
      : 0;

  // =========================================================
  // VIEW RESULT DETAILS
  // =========================================================

  const handleViewDetails = (result) => {
    const exam = getExam(result.exam_id);
    const subject = getResultSubject(result);

    alert(
      `Student: ${student?.student_name || "Student"}\n` +
        `Subject: ${subject?.subject_name || "Unknown Subject"}\n` +
        `Exam Date: ${formatDate(exam?.date)}\n` +
        `Obtained Marks: ${result.obtained_marks}\n` +
        `Total Marks: ${result.total_marks}\n` +
        `Passing Marks: ${result.passing_marks}\n` +
        `Percentage: ${result.percentage}%\n` +
        `Status: ${result.status}`,
    );
  };

  // =========================================================
  // STUDENT NOT LOGGED IN
  // =========================================================

  if (!studentId) {
    return (
      <>
        <StudentSider />
        <Header />

        <div className="result-page">
          <div className="result-no-data">
            <div className="result-no-data-icon">⚠️</div>

            <h2>Student Login Required</h2>

            <p>
              Student information was not found. Please login again to view your
              results.
            </p>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // =========================================================
  // STUDENT NOT FOUND
  // =========================================================

  if (!loading && !student) {
    return (
      <>
        <StudentSider />
        <Header />

        <div className="result-page">
          <div className="result-no-data">
            <div className="result-no-data-icon">⚠️</div>

            <h2>Student Not Found</h2>

            <p>Your student account could not be found. Please login again.</p>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // =========================================================
  // JSX
  // =========================================================

  return (
    <>
      <StudentSider />

      <Header />

      <div className="result-page">
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="result-page-header">
          <div>
            <h1>My Results</h1>

            <p>View your examination results and performance.</p>
          </div>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="result-error">
            <span>{error}</span>

            <button type="button" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        {/* =====================================================
            RESULT CARD
        ===================================================== */}

        <div className="result-card">
          {/* HEADER */}

          <div className="result-list-header">
            <div>
              <h2>Examination Results</h2>

              <p>Only your examination results are displayed.</p>
            </div>

            <div className="result-count">{filteredResults.length} Results</div>
          </div>

          {/* ===================================================
              FILTERS
          =================================================== */}

          <div className="result-filters">
            {/* SEARCH */}

            <div className="result-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search subject, marks or status..."
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

            {/* STATUS */}

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>

              <option value="Pass">Passed</option>

              <option value="Fail">Failed</option>
            </select>

            {/* CLEAR */}

            <button
              type="button"
              className="clear-result-btn"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>

          {/* ===================================================
              LOADING
          =================================================== */}

          {loading ? (
            <div className="result-loading">
              <div className="result-spinner"></div>

              <p>Loading your results...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="result-no-data">
              <div className="result-no-data-icon">📊</div>

              <h3>No Results Found</h3>

              <p>You do not have any results matching the selected filters.</p>
            </div>
          ) : (
            /* =================================================
               RESULT CARDS
            ================================================= */

            <div className="result-card-grid">
              {filteredResults.map((result, index) => {
                const exam = getExam(result.exam_id);

                const subject = getResultSubject(result);

                const isPassed = result.status?.toLowerCase() === "pass";

                return (
                  <div
                    className="student-result-card"
                    key={result.id || result.result_id}
                  >
                    {/* TOP */}

                    <div className="result-card-top">
                      <div className="result-subject-icon">📚</div>

                      <div
                        className={
                          isPassed ? "result-status pass" : "result-status fail"
                        }
                      >
                        {isPassed ? "✓ Passed" : "✕ Failed"}
                      </div>
                    </div>

                    {/* SUBJECT */}

                    <div className="result-card-subject">
                      <h3>{subject?.subject_name || "Unknown Subject"}</h3>

                      <span>Result #{index + 1}</span>
                    </div>

                    {/* EXAM DATE */}

                    <div className="result-date-section">
                      <div className="result-date-icon">📅</div>

                      <div>
                        <span>Exam Date</span>

                        <strong>{formatDate(exam?.date)}</strong>
                      </div>
                    </div>

                    {/* MARKS */}

                    <div className="marks-section">
                      <div className="marks-header">
                        <span>Marks Obtained</span>

                        <strong>
                          {result.obtained_marks} / {result.total_marks}
                        </strong>
                      </div>

                      <div className="marks-progress">
                        <div
                          className={
                            isPassed
                              ? "marks-progress-bar passed"
                              : "marks-progress-bar failed"
                          }
                          style={{
                            width: `${Math.min(
                              Number(result.percentage || 0),
                              100,
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* RESULT DETAILS */}

                    <div className="result-details">
                      <div>
                        <small>Passing Marks</small>

                        <strong>{result.passing_marks}</strong>
                      </div>

                      <div>
                        <small>Percentage</small>

                        <strong>{result.percentage}%</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ===================================================
              FOOTER
          =================================================== */}

          <div className="result-list-footer">
            <span>
              Showing <strong>{filteredResults.length}</strong> of{" "}
              <strong>{results.length}</strong> results
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
