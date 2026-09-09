import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import Header from "./Header";
import Footer from "./Footer";
import "./Reports.css";

export default function Reports() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Fetch all exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/tbl_exam"
        );

        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, []);

  // Generate report
  const handleViewReport = async () => {
    if (!selectedExam) {
      alert("Please select an exam.");
      return;
    }

    try {
      setLoading(true);
      setShowReport(false);
      setTopStudents([]);

      // Get results for selected exam
      const resultResponse = await axios.get(
        `http://localhost:5000/tbl_result?exam_id=${selectedExam}`
      );

      // Get all students
      const studentResponse = await axios.get(
        "http://localhost:5000/tbl_student"
      );

      const results = resultResponse.data;
      const students = studentResponse.data;

      // Match result with student
      const reportData = results.map((result) => {
        const student = students.find(
          (student) =>
            String(student.student_id) === String(result.student_id)
        );

        return {
          ...result,
          studentName: student
            ? student.student_name
            : "Unknown Student",
          email: student
            ? student.email
            : "",
        };
      });

      // Sort by obtained marks
      reportData.sort(
        (a, b) =>
          Number(b.obtained_marks) - Number(a.obtained_marks)
      );

      // Get top 5
      setTopStudents(reportData.slice(0, 5));
      setShowReport(true);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Unable to generate report.");
    } finally {
      setLoading(false);
    }
  };

  // Get selected exam information
  const selectedExamData = exams.find(
    (exam) =>
      String(exam.id) === String(selectedExam)
  );

  return (
    <>
      <AdminSidebar />

      <Header />

      <main className="reports-page">
        {/* Page Header */}
        <div className="reports-header">
          <div>
            <h1>Reports</h1>
            <p>
              View examination performance and student reports.
            </p>
          </div>
        </div>

        {/* Exam Selection */}
        <section className="report-selection-card">
          <div className="report-card-header">
            <div className="report-icon">📊</div>

            <div>
              <h2>Exam Performance Report</h2>

              <p>
                Select an exam to view the top 5 performing students.
              </p>
            </div>
          </div>

          <div className="report-form">
            <div className="report-input-group">
              <label>Select Exam</label>

              <select
                value={selectedExam}
                onChange={(e) => {
                  setSelectedExam(e.target.value);
                  setShowReport(false);
                  setTopStudents([]);
                }}
              >
                <option value="">
                  -- Select Exam --
                </option>

                {exams.map((exam) => (
                  <option
                    key={exam.id}
                    value={exam.id}
                  >
                    {exam.exam_title}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="view-report-btn"
              onClick={handleViewReport}
              disabled={loading}
            >
              {loading
                ? "Generating..."
                : "View Top 5"}
            </button>
          </div>
        </section>

        {/* Report */}
        {showReport && (
          <section className="top-students-card">
            {/* Report Header */}
            <div className="top-students-header">
              <div>
                <h2>🏆 Top 5 Students</h2>

                <p>
                  {selectedExamData
                    ? selectedExamData.exam_title
                    : "Selected Exam"}
                </p>
              </div>

              <button
                className="print-btn"
                onClick={() => window.print()}
              >
                🖨 Print
              </button>
            </div>

            {/* No Results */}
            {topStudents.length === 0 ? (
              <div className="no-results">
                No results found for this exam.
              </div>
            ) : (
              <>
                {/* Table */}
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
                      {topStudents.map(
                        (student, index) => (
                          <tr
                            key={
                              student.id || index
                            }
                          >
                            {/* Rank */}
                            <td>
                              <span
                                className={`rank rank-${
                                  index + 1
                                }`}
                              >
                                {index + 1}
                              </span>
                            </td>

                            {/* Student Name */}
                            <td>
                              <strong>
                                {student.studentName}
                              </strong>
                            </td>

                            {/* Email */}
                            <td>
                              {student.email || "-"}
                            </td>

                            {/* Marks */}
                            <td>
                              <strong>
                                {student.obtained_marks}
                              </strong>
                            </td>

                            {/* Percentage */}
                            <td>
                              {student.percentage !==
                                undefined &&
                              student.percentage !==
                                null
                                ? `${student.percentage}%`
                                : "-"}
                            </td>

                            {/* Result */}
                            <td>
                              <span className="pass-badge">
                                {student.status || "-"}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="report-summary">
                  <div className="summary-box">
                    <span>
                      Students Shown
                    </span>

                    <strong>
                      {topStudents.length}
                    </strong>
                  </div>

                  <div className="summary-box">
                    <span>
                      Highest Marks
                    </span>

                    <strong>
                      {
                        topStudents[0]
                          .obtained_marks
                      }
                    </strong>
                  </div>

                  <div className="summary-box">
                    <span>
                      Lowest of Top 5
                    </span>

                    <strong>
                      {
                        topStudents[
                          topStudents.length - 1
                        ].obtained_marks
                      }
                    </strong>
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