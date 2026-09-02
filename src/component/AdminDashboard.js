import "./AdminDashboard.css";
import AdminSidebar from "./AdminSidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
export default function AdminDashboard() {
const [stats, setStats] = useState({
  students: 0,
  faculty: 0,
  subjects: 0,
  exams: 0,
});

useEffect(() => {
  const fetchStats = async () => {
    try {
      // Get Students
      const studentRes = await axios.get(
        "http://localhost:5000/tbl_student"
      );

      // Get Faculty
      const facultyRes = await axios.get(
        "http://localhost:5000/tbl_faculty"
      );

      // Get Subjects
      const subjectRes = await axios.get(
        "http://localhost:5000/tbl_subject"
      );

      // Get Exams
      const examRes = await axios.get(
        "http://localhost:5000/tbl_exam"
      );

      setStats({
        students: studentRes.data.length,
        faculty: facultyRes.data.length,
        subjects: subjectRes.data.length,
        exams: examRes.data.length,
      });

    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  fetchStats();
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
      <strong>{stats.students}</strong>
    </div>
  </div>

  {/* Total Faculty */}
  <div className="stat-card green">
    <div className="stat-icon">👨‍🏫</div>
    <div>
      <span>Total Faculty</span>
      <strong>{stats.faculty}</strong>
    </div>
  </div>

  {/* Total Subjects */}
  <div className="stat-card orange">
    <div className="stat-icon">📚</div>
    <div>
      <span>Total Subjects</span>
      <strong>{stats.subjects}</strong>
    </div>
  </div>

  {/* Online Exams */}
  <div className="stat-card blue">
    <div className="stat-icon">📝</div>
    <div>
      <span>Online Exams</span>
      <strong>{stats.exams}</strong>
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

            <Link
              to="/Feedback"
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
