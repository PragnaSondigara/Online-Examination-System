import "./FacultyDashboard.css";
import AdminSidebar from "./FacultySider";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";

export default function FacultyDashboard() {
  return (
    <>
      <AdminSidebar />
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
          {/* Schedule Exams */}
          <div className="stat-card purple">
            <div className="stat-icon">📅</div>
            <div>
              <span>Scheduled Exams</span>
              <strong>20+</strong>
            </div>
          </div>

          {/* Questions */}
          <div className="stat-card green">
            <div className="stat-icon">❓</div>
            <div>
              <span>Total Questions</span>
              <strong>500+</strong>
            </div>
          </div>

          {/* Results */}
          <div className="stat-card orange">
            <div className="stat-icon">📋</div>
            <div>
              <span>Exam Results</span>
              <strong>100+</strong>
            </div>
          </div>

          {/* Feedback */}
          <div className="stat-card blue">
            <div className="stat-icon">💬</div>
            <div>
              <span>Feedback</span>
              <strong>50+</strong>
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
            <Link to="/ScheduleExam" className="dashboard-card dashboard-exam">
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
              to="/ViewFeedback"
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
