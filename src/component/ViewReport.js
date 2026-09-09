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

  const [totalParticipants, setTotalParticipants] = useState(0);
  const [averageMarks, setAverageMarks] = useState(0);
  const [passRate, setPassRate] = useState(0);

  const [loadingExams, setLoadingExams] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  const [showReport, setShowReport] = useState(false);
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
    return subjects.find((subject) => String(subject.id) === String(subjectId));
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
  // FORMAT DATE
  // =====================================================

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

  // =====================================================
  // EXAM CHANGE
  // =====================================================

  const handleExamChange = (e) => {
    setSelectedExam(e.target.value);

    setTopStudents([]);

    setTotalParticipants(0);
    setAverageMarks(0);
    setPassRate(0);

    setShowReport(false);
    setError("");
  };

  // =====================================================
  // GENERATE REPORT
  // =====================================================

  const handleViewReport = async () => {
    if (!selectedExam) {
      alert("Please select an exam.");
      return;
    }

    try {
      setLoadingReport(true);
      setShowReport(false);
      setTopStudents([]);

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
        const passedStudents = reportData.filter(
          (student) => String(student.status).toLowerCase() === "pass",
        ).length;

        const calculatedPassRate = (passedStudents / reportData.length) * 100;

        setPassRate(Number(calculatedPassRate.toFixed(2)));
      }

      // -------------------------------------------------
      // SORT BY MARKS
      // -------------------------------------------------

      reportData.sort(
        (a, b) => Number(b.obtained_marks || 0) - Number(a.obtained_marks || 0),
      );

      // -------------------------------------------------
      // GET TOP 5
      // -------------------------------------------------

      const topFive = reportData.slice(0, 5);

      setTopStudents(topFive);

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

              <p>Select an exam to view the top 5 performing students.</p>
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
                      {subject?.subject_name || "Unknown Subject"} -{" "}
                      {formatDate(exam.date)} ({exam.start_time} -{" "}
                      {exam.end_time})
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              type="button"
              className="view-report-btn"
              onClick={handleViewReport}
              disabled={loadingReport || !selectedExam}
            >
              {loadingReport ? "Generating..." : "View Top 5"}
            </button>
          </div>
        </section>

        {/* =================================================
            REPORT
        ================================================= */}

        {showReport && (
          <section className="top-students-card">
            {/* =================================================
                REPORT HEADER
            ================================================= */}

            <div className="top-students-header">
              <div>
                <h2>🏆 Top 5 Students</h2>

                <p>
                  {selectedSubject?.subject_name || "Unknown Subject"}

                  {selectedExamData && (
                    <>
                      {" | "}
                      {formatDate(selectedExamData.date)}

                      {" | "}

                      {selectedExamData.start_time}

                      {" - "}

                      {selectedExamData.end_time}
                    </>
                  )}
                </p>
              </div>

              <button type="button" className="print-btn" onClick={handlePrint}>
                🖨 Print
              </button>
            </div>

            {/* =================================================
                NO RESULTS
            ================================================= */}

            {topStudents.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">📊</div>

                <h3>No Results Found</h3>

                <p>No student results are available for this exam.</p>
              </div>
            ) : (
              <>
                {/* =================================================
                    TABLE
                ================================================= */}

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
                            <span
                              className={
                                String(student.status).toLowerCase() === "pass"
                                  ? "pass-badge"
                                  : "fail-badge"
                              }
                            >
                              {student.status || "-"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* =================================================
                    NEW SUMMARY
                ================================================= */}

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
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
