import "./FacultyDashboard.css";
import FacultySidebar from "./FacultySider";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FacultyDashboard() {
  // Dynamic counts
  const [examCount, setExamCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [resultCount, setResultCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get Scheduled Exams
        const examRes = await axios.get("http://localhost:5000/tbl_exam");

        const activeExams = examRes.data.filter(
          (exam) => exam.is_active === true,
        );

        setExamCount(activeExams.length);

        // Get Total Questions
        const questionRes = await axios.get(
          "http://localhost:5000/tbl_question",
        );

        setQuestionCount(questionRes.data.length);

        // Get Exam Results
        const resultRes = await axios.get("http://localhost:5000/tbl_result");

        setResultCount(resultRes.data.length);

        // Get Feedback
        const feedbackRes = await axios.get(
          "http://localhost:5000/tbl_feedback",
        );

        setFeedbackCount(feedbackRes.data.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <FacultySidebar />
      <Header />

      <main className="manage-student">
        {/* Top Heading */}
        <div className="page-top">
          <div>
            <h1>Faculty Dashboard</h1>
            <p>Manage exams, questions, results, and student feedback.</p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="student-stats">
          {/* Scheduled Exams */}
          <div className="stat-card purple">
            <div className="stat-icon">📅</div>

            <div>
              <span>Scheduled Exams</span>
              <strong>{examCount}</strong>
            </div>
          </div>

          {/* Total Questions */}
          <div className="stat-card green">
            <div className="stat-icon">❓</div>

            <div>
              <span>Total Questions</span>
              <strong>{questionCount}</strong>
            </div>
          </div>

          {/* Exam Results */}
          <div className="stat-card orange">
            <div className="stat-icon">📋</div>

            <div>
              <span>Exam Results</span>
              <strong>{resultCount}</strong>
            </div>
          </div>

          {/* Feedback */}
          <div className="stat-card blue">
            <div className="stat-icon">💬</div>

            <div>
              <span>Feedback</span>
              <strong>{feedbackCount}</strong>
            </div>
          </div>
        </div>

        {/* Management Modules */}
        <section className="student-card">
          <div className="table-toolbar">
            <div>
              <h2>Faculty Management Modules</h2>
              <p>Quick access to all faculty modules.</p>
            </div>
          </div>

          <div className="dashboard-cards" style={{ padding: "20px" }}>
            {/* Schedule Exam */}
            <Link
              to="/ScheduleManagement"
              className="dashboard-card dashboard-exam"
            >
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">📅</div>
                <div className="dashboard-card-arrow">→</div>
              </div>

              <h3>Schedule Exam</h3>

              <p>Create and schedule online examinations for students.</p>
            </Link>

            {/* Manage Question */}
            <Link
              to="/ManageQuestion"
              className="dashboard-card dashboard-question"
            >
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">❓</div>
                <div className="dashboard-card-arrow">→</div>
              </div>

              <h3>Manage Question</h3>

              <p>Add, edit, view and manage examination questions.</p>
            </Link>

            {/* View Result */}
            <Link to="/ViewResult" className="dashboard-card dashboard-result">
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">📋</div>
                <div className="dashboard-card-arrow">→</div>
              </div>

              <h3>View Result</h3>

              <p>View student examination results and performance.</p>
            </Link>

            {/* View Feedback */}
            <Link
              to="/faculty/ViewFeedback"
              className="dashboard-card dashboard-feedback"
            >
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">💬</div>
                <div className="dashboard-card-arrow">→</div>
              </div>

              <h3>View Feedback</h3>

              <p>Review feedback and suggestions submitted by students.</p>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
