import { Link, useNavigate } from "react-router-dom";

export default function StudentSider() {
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
        <span>Student Portal</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <Link to="/StudentDashboard" className="nav-item active">
          <span className="nav-icon">⌂</span>
          <span>Dashboard</span>
        </Link>

        <Link to="/ViewExamSchedule" className="nav-item">
          <span className="nav-icon">📅</span>
          <span>View Exam Schedule</span>
        </Link>

        <Link to="/ViewResult" className="nav-item">
          <span className="nav-icon">📝</span>
          <span>View Result</span>
        </Link>

        <Link to="/Feedback" className="nav-item">
          <span className="nav-icon">💬</span>
          <span>Provide Feedback</span>
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
