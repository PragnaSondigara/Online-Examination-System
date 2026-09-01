import "./StudentDashboard.css";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import StudentSider from "./StudentSider";

export default function StudentDashboard() {
  return (
    <>
      <StudentSider />
      <Header />

      <main className="manage-student">
        {/* Top Heading */}
        <div className="page-top">
          <div>
            <h1>Student Dashboard</h1>
            <p>
              View your exam schedule, examination results and exam details.
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="student-stats">
          
          {/* Upcoming Exams */}
          <div className="stat-card purple">
            <div className="stat-icon">📅</div>
            <div>
              <span>Upcoming Exams</span>
              <strong>5</strong>
            </div>
          </div>

          {/* Completed Exams */}
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div>
              <span>Completed Exams</span>
              <strong>12</strong>
            </div>
          </div>

          {/* Results */}
          <div className="stat-card orange">
            <div className="stat-icon">📋</div>
            <div>
              <span>Available Results</span>
              <strong>10</strong>
            </div>
          </div>
        </div>

        {/* Student Modules */}
        <section className="student-card">
          <div className="table-toolbar">
            <div>
              <h2>Student Modules</h2>
              <p>Quick access to your examination modules.</p>
            </div>
          </div>

          <div className="dashboard-cards" style={{ padding: "20px" }}>
            
            {/* View Exam Schedule */}
            <Link
              to="/ViewExamSchedule"
              className="dashboard-card dashboard-exam"
            >
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">📅</div>
                <div className="dashboard-card-arrow">→</div>
              </div>

              <h3>View Exam Schedule</h3>

              <p>
                View your upcoming examination dates, subjects and exam timing.
              </p>
            </Link>

            {/* View Result */}
            <Link
              to="/ViewResult"
              className="dashboard-card dashboard-result"
            >
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">📝</div>
                <div className="dashboard-card-arrow">→</div>
              </div>

              <h3>View Result</h3>

              <p>
                Check your examination results, marks and overall performance.
              </p>
            </Link>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}