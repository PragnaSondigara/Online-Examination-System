import { Link, useNavigate } from "react-router-dom";

export default function FacultySider() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("facultyId");
    localStorage.removeItem("studentId");

    navigate("/");
  };
  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src="/image/logo.png" alt="Logo" className="logo-circle" />
        <span>Faculty Portal</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <Link to="/FacultyDashboard" className="nav-item active">
          <span className="nav-icon">⌂</span>
          <span>Dashboard</span>
        </Link>

        <Link to="/ScheduleManagement" className="nav-item">
          <span className="nav-icon">🗓️</span>
          <span>Schedule Exam</span>
        </Link>

        <Link to="/ManageQuestion" className="nav-item">
          <span className="nav-icon">❓</span>
          <span>Manage Question</span>
        </Link>

        <Link to="/ViewStudentResult" className="nav-item">
          <span className="nav-icon">📋</span>
          <span>View Result</span>
        </Link>

        <Link to="/faculty/ViewFeedback" className="nav-item">
          <span className="nav-icon">💬</span>
          <span>View Feedback</span>
        </Link>
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <button className="logout-item" onClick={handleLogout}>
          <span className="nav-icon">↪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
