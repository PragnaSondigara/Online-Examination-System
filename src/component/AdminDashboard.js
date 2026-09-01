import "./AdminDashboard.css";
import AdminSidebar from "./AdminSidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  // Dynamic statistics
  const [studentCount, setStudentCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [examCount, setExamCount] = useState(0);

  useEffect(() => {
    // Total Students
    fetch("http://localhost:5000/tbl_student")
      .then((response) => response.json())
      .then((data) => {
        setStudentCount(data.length);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });

    // Total Faculty
    fetch("http://localhost:5000/tbl_faculty")
      .then((response) => response.json())
      .then((data) => {
        setFacultyCount(data.length);
      })
      .catch((error) => {
        console.error("Error fetching faculty:", error);
      });

    // Total Subjects
    fetch("http://localhost:5000/tbl_subject")
      .then((response) => response.json())
      .then((data) => {
        setSubjectCount(data.length);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });

    // Online Exams
    fetch("http://localhost:5000/tbl_exam")
      .then((response) => response.json())
      .then((data) => {
        setExamCount(data.length);
      })
      .catch((error) => {
        console.error("Error fetching exams:", error);
      });
  }, []);

  return (
    <>
      <AdminSidebar />
      <Header />

      <main className="manage-student">
        {/* Top Heading */}
        <div className="page-top">
          <div>
            <h1>Admin Dashboard</h1>
            <p>
              Manage students, faculty, subjects, feedback, and examination
              reports.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="student-stats">
          {/* Total Students */}
          <div className="stat-card purple">
            <div className="stat-icon">👨‍🎓</div>

            <div>
              <span>Total Students</span>
              <strong>{studentCount}</strong>
            </div>
          </div>

          {/* Total Faculty */}
          <div className="stat-card green">
            <div className="stat-icon">👨‍🏫</div>

            <div>
              <span>Total Faculty</span>
              <strong>{facultyCount}</strong>
            </div>
          </div>

          {/* Total Subjects */}
          <div className="stat-card orange">
            <div className="stat-icon">📚</div>

            <div>
              <span>Total Subjects</span>
              <strong>{subjectCount}</strong>
            </div>
          </div>

          {/* Online Exams */}
          <div className="stat-card blue">
            <div className="stat-icon">📝</div>

            <div>
              <span>Online Exams</span>
              <strong>{examCount}</strong>
            </div>
          </div>
        </div>

        {/* Management Modules Section */}
        <section className="student-card">
          <div className="table-toolbar">
            <div>
              <h2>Management Modules</h2>
              <p>Quick access to all administration modules.</p>
            </div>
          </div>

          <div className="dashboard-cards" style={{ padding: "20px" }}>
            {/* Manage Student */}
            <Link
              to="/ManageStudent"
              className="dashboard-card dashboard-student"
            >
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">👨‍🎓</div>
                <div className="dashboard-card-arrow">→</div>
              </div>

              <h3>Manage Student</h3>

              <p>
                Add, edit, view and delete student accounts and manage student
                information.
              </p>
            </Link>

            {/* Manage Faculty */}
            <Link
              to="/ManageFaculty"
              className="dashboard-card dashboard-faculty"
            >
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">👨‍🏫</div>
                <div className="dashboard-card-arrow">→</div>
              </div>

              <h3>Manage Faculty</h3>

              <p>
                Manage faculty profiles, information and teaching activities.
              </p>
            </Link>

            {/* Manage Subject */}
            <Link
              to="/ManageSubject"
              className="dashboard-card dashboard-subject"
            >
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">📚</div>
                <div className="dashboard-card-arrow">→</div>
              </div>

              <h3>Manage Subject</h3>

              <p>
                Add, edit, view and delete subjects and manage subject
                information.
              </p>
            </Link>

            {/* Feedback */}
            <Link
              to="/feedback.php"
              className="dashboard-card dashboard-feedback"
            >
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">💬</div>
                <div className="dashboard-card-arrow">→</div>
              </div>

              <h3>Feedback</h3>

              <p>
                Review feedback and suggestions submitted by students and
                faculty.
              </p>
            </Link>

            {/* Reports */}
            <Link to="/report.php" className="dashboard-card dashboard-report">
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">📊</div>
                <div className="dashboard-card-arrow">→</div>
              </div>

              <h3>Reports</h3>

              <p>
                View examination results, student performance and system
                reports.
              </p>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
