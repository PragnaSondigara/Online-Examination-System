import { Link } from "react-router-dom";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-circle">S</div>
        <span>Admin Portal</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <Link to="/AdminDashboard" className="nav-item active">
          <span className="nav-icon">⌂</span>
          <span>Dashboard</span>
        </Link>

        <Link to="/ManageStudent" className="nav-item">
          <span className="nav-icon">👨‍🎓</span>
          <span>Manage Student</span>
        </Link>

        <Link to="/ManageFaculty" className="nav-item">
          <span className="nav-icon">🧑‍🏫</span>
          <span>Manage Faculty</span>
        </Link>
        <Link to="/ManageSubject" className="nav-item">
          <span className="nav-icon">👨‍🎓</span>
          <span>Manage Subject</span>
        </Link>
        <Link to="/admin/ViewFeedback" className="nav-item">
          <span className="nav-icon">📋</span>
          <span>Feedback</span>
        </Link>

        <Link to="/Report" className="nav-item">
          <span className="nav-icon">📊</span>
          <span>Report</span>
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
