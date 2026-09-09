import { Link, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

export default function AdminSidebar() {
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
        {/* <div className="logo-circle">S</div> */}
        <img src="/image/logo.png" alt="Logo" className="logo-circle" />
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

        <Link to="/ViewReport" className="nav-item">
          <span className="nav-icon">📊</span>
          <span>Report</span>
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
