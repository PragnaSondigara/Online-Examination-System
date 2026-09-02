import { Link } from "react-router-dom";
import "./StudentSider.css";

export default function StudentSider() {
  return (
    <aside className="student-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-circle">S</div>
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
