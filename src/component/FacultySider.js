import { Link } from "react-router-dom";
import "./FacultySider.css";

export default function FacultySider() {
  return (
    <aside className="faculty-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-circle">S</div>
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

        <Link to="#" className="nav-item">
          <span className="nav-icon">📋</span>
          <span>View Result</span>
        </Link>

        <Link to="/faculty/view-feedback" className="nav-item">
          <span className="nav-icon">💬</span>
          <span>View Feedback</span>
        </Link>
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <Link className="logout-item" to="/LoginPage">
          <span className="nav-icon">↪</span>
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
