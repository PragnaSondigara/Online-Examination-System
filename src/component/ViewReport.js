
import React, { useEffect, useState } from "react";
import axios from "axios";

import AdminSidebar from "./AdminSidebar";
import Header from "./Header";
import Footer from "./Footer";

import "./ViewReport.css";

const API_URL = "http://localhost:5000";

export default function ViewReport() {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedExam, setSelectedExam] = useState("");

  const [topStudents, setTopStudents] = useState([]);
  const [failedStudents, setFailedStudents] = useState([]);

  const [totalParticipants, setTotalParticipants] = useState(0);
  const [averageMarks, setAverageMarks] = useState(0);
  const [passRate, setPassRate] = useState(0);

  const [loadingExams, setLoadingExams] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  const [showReport, setShowReport] = useState(false);
  const [reportType, setReportType] = useState("");

  const [error, setError] = useState("");

  // =====================================================
  // FETCH EXAMS AND SUBJECTS
  // =====================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingExams(true);
        setError("");

        const examResponse = await axios.get(`${API_URL}/tbl_exam`);
        const subjectResponse = await axios.get(`${API_URL}/tbl_subject`);

        setExams(examResponse.data);
        setSubjects(subjectResponse.data);
      } catch (error) {
        console.error("Error fetching exams:", error);

        setError(
          "Unable to load exams. Please check whether JSON Server is running.",
        );
      } finally {
        setLoadingExams(false);
      }
    };

    fetchData();
  }, []);

  // =====================================================
  // GET SUBJECT
  // =====================================================

  const getSubject = (subjectId) => {
    return subjects.find(
      (subject) => String(subject.id) === String(subjectId),
    );
  };

  // =====================================================
  // GET SELECTED EXAM
  // =====================================================

  const selectedExamData = exams.find(
    (exam) => String(exam.id) === String(selectedExam),
  );

  // =====================================================
  // GET SELECTED SUBJECT
  // =====================================================

  const selectedSubject = selectedExamData
    ? getSubject(selectedExamData.subject_id)
    : null;

  // =====================================================
  // EXAM CHANGE
  // =====================================================

  const handleExamChange = (e) => {
    setSelectedExam(e.target.value);

    setTopStudents([]);
    setFailedStudents([]);

    setTotalParticipants(0);
    setAverageMarks(0);
    setPassRate(0);

    setReportType("");
    setShowReport(false);
    setError("");
  };

  // =====================================================
  // GENERATE REPORT
  // =====================================================

  const handleViewReport = async (type) => {
    if (!selectedExam) {
      alert("Please select an exam.");
      return;
    }

    try {
      setLoadingReport(true);
      setShowReport(false);
      setReportType(type);

      setTopStudents([]);
      setFailedStudents([]);

      setTotalParticipants(0);
      setAverageMarks(0);
      setPassRate(0);

      setError("");

      // -------------------------------------------------
      // GET RESULTS FOR SELECTED EXAM
      // -------------------------------------------------

      const resultResponse = await axios.get(
        `${API_URL}/tbl_result?exam_id=${selectedExam}`,
      );

      // -------------------------------------------------
      // GET ALL STUDENTS
      // -------------------------------------------------

      const studentResponse = await axios.get(`${API_URL}/tbl_student`);

      const results = resultResponse.data;
      const students = studentResponse.data;

      // -------------------------------------------------
      // MATCH RESULT WITH STUDENT
      // -------------------------------------------------

      const reportData = results.map((result) => {
        const student = students.find(
          (student) => String(student.id) === String(result.student_id),
        );

        return {
          ...result,
          studentName: student ? student.student_name : "Unknown Student",
          email: student ? student.email : "-",
        };
      });

      // -------------------------------------------------
      // TOTAL PARTICIPANTS
      // -------------------------------------------------

      setTotalParticipants(reportData.length);

      // -------------------------------------------------
      // AVERAGE MARKS
      // -------------------------------------------------

      if (reportData.length > 0) {
        const totalObtainedMarks = reportData.reduce(
          (total, student) => total + Number(student.obtained_marks || 0),
          0,
        );

        const average = totalObtainedMarks / reportData.length;

        setAverageMarks(Number(average.toFixed(2)));
      }

      // -------------------------------------------------
      // PASS RATE
      // -------------------------------------------------

      if (reportData.length > 0) {
        const passedCount = reportData.filter(
          (student) => String(student.status).toLowerCase() === "pass",
        ).length;

        const calculatedPassRate =
          (passedCount / reportData.length) * 100;

        setPassRate(Number(calculatedPassRate.toFixed(2)));
      }

      // -------------------------------------------------
      // GET FAILED STUDENTS ONLY
      // -------------------------------------------------

      const failed = reportData.filter(
        (student) => String(student.status).toLowerCase() === "fail",
      );

      setFailedStudents(failed);

      // -------------------------------------------------
      // GET PASSED STUDENTS ONLY
      // -------------------------------------------------

      const passed = reportData.filter(
        (student) => String(student.status).toLowerCase() === "pass",
      );

      // -------------------------------------------------
      // SORT PASSED STUDENTS BY MARKS
      // -------------------------------------------------

      passed.sort(
        (a, b) =>
          Number(b.obtained_marks || 0) - Number(a.obtained_marks || 0),
      );

      // -------------------------------------------------
      // GET TOP 5 PASSED STUDENTS
      // -------------------------------------------------

      const topFive = passed.slice(0, 5);

      setTopStudents(topFive);

      // -------------------------------------------------
      // SHOW SELECTED REPORT
      // -------------------------------------------------

      setShowReport(true);
    } catch (error) {
      console.error("Error generating report:", error);

      setError("Unable to generate report. Please try again.");

      alert("Unable to generate report.");
    } finally {
      setLoadingReport(false);
    }
  };

  // =====================================================
  // PRINT
  // =====================================================

  const handlePrint = () => {
    window.print();
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <>
      <AdminSidebar />

      <Header />

      <main className="reports-page">
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="reports-header">
          <div>
            <h1>Reports</h1>
            <p>View examination performance and student reports.</p>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && <div className="report-error">{error}</div>}

        {/* =================================================
            EXAM SELECTION
        ================================================= */}

        <section className="report-selection-card">
          <div className="report-card-header">
            <div className="report-icon">📊</div>

            <div>
              <h2>Exam Performance Report</h2>
              <p>Select an exam to view student performance.</p>
            </div>
          </div>

          <div className="report-form">
            <div className="report-input-group">
              <label>Select Exam</label>

              <select
                value={selectedExam}
                onChange={handleExamChange}
                disabled={loadingExams}
              >
                <option value="">
                  {loadingExams ? "Loading exams..." : "-- Select Exam --"}
                </option>

                {exams.map((exam) => {
                  const subject = getSubject(exam.subject_id);

                  return (
                    <option key={exam.id} value={exam.id}>
                      {exam.exam_name || "Unnamed Exam"} -{" "}
                      {subject?.subject_name || "Unknown Subject"}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* =================================================
                TWO REPORT BUTTONS
            ================================================= */}

            <div className="report-buttons">
              {/* TOP 5 BUTTON */}

              <button
                type="button"
                className="view-report-btn"
                onClick={() => handleViewReport("top5")}
                disabled={loadingReport || !selectedExam}
              >
                {loadingReport && reportType === "top5"
                  ? "Generating..."
                  : "🏆 View Top 5"}
              </button>

              {/* FAILED STUDENTS BUTTON */}

              <button
                type="button"
                className="view-failed-btn"
                onClick={() => handleViewReport("failed")}
                disabled={loadingReport || !selectedExam}
              >
                {loadingReport && reportType === "failed"
                  ? "Generating..."
                  : "❌ View Failed Students"}
              </button>
            </div>
          </div>
        </section>

        {/* =================================================
            REPORT DISPLAY
        ================================================= */}

        {showReport && (
          <section className="top-students-card">
            {/* =================================================
                REPORT HEADER
            ================================================= */}

            <div className="top-students-header">
              <div>
                <h2>
                  {reportType === "top5"
                    ? "🏆 Top 5 Students"
                    : "❌ Failed Students"}
                </h2>

                <p>
                  {selectedExamData?.exam_name || "Exam Report"}
                  {" | "}
                  {selectedSubject?.subject_name || "Unknown Subject"}
                </p>
              </div>

              <button type="button" className="print-btn" onClick={handlePrint}>
                🖨 Print
              </button>
            </div>

            {/* =================================================
                TOP 5 STUDENTS REPORT
            ================================================= */}

            {reportType === "top5" && (
              <>
                {topStudents.length === 0 ? (
                  <div className="no-results">
                    <div className="no-results-icon">📊</div>
                    <h3>No Passed Students Found</h3>
                    <p>
                      No passed student results are available for this exam.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* TOP 5 TABLE */}

                    <div className="report-table-wrapper">
                      <table className="report-table">
                        <thead>
                          <tr>
                            <th>Rank</th>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Marks</th>
                            <th>Percentage</th>
                            <th>Result</th>
                          </tr>
                        </thead>

                        <tbody>
                          {topStudents.map((student, index) => (
                            <tr
                              key={student.id || `${student.student_id}-${index}`}
                            >
                              {/* RANK */}

                              <td>
                                <span className={`rank rank-${index + 1}`}>
                                  {index + 1}
                                </span>
                              </td>

                              {/* STUDENT NAME */}

                              <td>
                                <strong>{student.studentName}</strong>
                              </td>

                              {/* EMAIL */}

                              <td>{student.email}</td>

                              {/* MARKS */}

                              <td>
                                <strong>{student.obtained_marks}</strong>
                                {" / "}
                                {student.total_marks}
                              </td>

                              {/* PERCENTAGE */}

                              <td>
                                {student.percentage !== undefined &&
                                student.percentage !== null
                                  ? `${student.percentage}%`
                                  : "-"}
                              </td>

                              {/* RESULT */}

                              <td>
                                <span className="pass-badge">
                                  {student.status || "Pass"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* SUMMARY CARDS */}

                    <div className="report-summary">
                      {/* TOTAL PARTICIPANTS */}

                      <div className="summary-box">
                        <div className="summary-icon">👥</div>

                        <div>
                          <span>Total Participants</span>
                          <strong>{totalParticipants}</strong>
                        </div>
                      </div>

                      {/* AVERAGE MARKS */}

                      <div className="summary-box">
                        <div className="summary-icon">📈</div>

                        <div>
                          <span>Average Marks</span>
                          <strong>{averageMarks}</strong>
                        </div>
                      </div>

                      {/* PASS RATE */}

                      <div className="summary-box">
                        <div className="summary-icon">✅</div>

                        <div>
                          <span>Pass Rate</span>
                          <strong>{passRate}%</strong>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* =================================================
                FAILED STUDENTS REPORT
            ================================================= */}

            {reportType === "failed" && (
              <>
                {failedStudents.length === 0 ? (
                  <div className="no-results">
                    <div className="no-results-icon">🎉</div>
                    <h3>No Failed Students</h3>
                    <p>
                      All students passed this exam or no results are available.
                    </p>
                  </div>
                ) : (
                  <div className="report-table-wrapper">
                    <table className="report-table">
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Student Name</th>
                          <th>Email</th>
                          <th>Marks</th>
                          <th>Percentage</th>
                          <th>Result</th>
                        </tr>
                      </thead>

                      <tbody>
                        {failedStudents.map((student, index) => (
                          <tr
                            key={student.id || `${student.student_id}-${index}`}
                          >
                            {/* SERIAL NUMBER */}

                            <td>{index + 1}</td>

                            {/* STUDENT NAME */}

                            <td>
                              <strong>{student.studentName}</strong>
                            </td>

                            {/* EMAIL */}

                            <td>{student.email}</td>

                            {/* MARKS */}

                            <td>
                              <strong>{student.obtained_marks}</strong>
                              {" / "}
                              {student.total_marks}
                            </td>

                            {/* PERCENTAGE */}

                            <td>
                              {student.percentage !== undefined &&
                              student.percentage !== null
                                ? `${student.percentage}%`
                                : "-"}
                            </td>

                            {/* RESULT */}

                            <td>
                              <span className="fail-badge">
                                {student.status || "Fail"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
