import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

import AdminSidebar from "./AdminSidebar";
import FacultySider from "./FacultySider";
import StudentSider from "./StudentSider";

export default function Header() {
  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("role") || "Student";

  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  const firstLetter = username.charAt(0).toUpperCase();

  const handleProfile = () => {
    setShowDropdown(false);
    navigate("/profile");
  };

  const handleSettings = () => {
    setShowDropdown(false);
    navigate("/settings");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("facultyId");
    localStorage.removeItem("studentId");

    setShowDropdown(false);

    navigate("/");
  };

  // Role pramane sidebar select karo
  let sidebar = null;

  if (role === "Administrator") {
    sidebar = <AdminSidebar />;
  } else if (role === "Faculty") {
    sidebar = <FacultySider />;
  } else if (role === "Student") {
    sidebar = <StudentSider />;
  }

  return (
    <>
      {/* Role Based Sidebar */}
      {sidebar}

      {/* Header */}
      <header className="admin-header">
        <div className="header-right">
          <div className="admin-profile">
            {/* Profile Trigger */}
            <button
              type="button"
              className={`profile-trigger ${
                showDropdown ? "profile-active" : ""
              }`}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="profile-circle">{firstLetter}</div>

              <div className="profile-info">
                <span className="admin-name">{username}</span>

                <span className="admin-role">{role}</span>
              </div>

              <span
                className={`profile-arrow ${showDropdown ? "arrow-up" : ""}`}
              >
                ▾
              </span>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="profile-dropdown">
                {/* User Information */}
                <div className="dropdown-user">
                  <div className="dropdown-avatar">{firstLetter}</div>

                  <div className="dropdown-user-info">
                    <div className="dropdown-user-name">{username}</div>

                    <div className="dropdown-user-role">{role}</div>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                {/* My Profile */}
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={handleProfile}
                >
                  <span className="dropdown-icon profile-icon">♙</span>

                  <span>My Profile</span>
                </button>

                {/* Settings */}
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={handleSettings}
                >
                  <span className="dropdown-icon settings-icon">⚙</span>

                  <span>Settings</span>
                </button>

                <div className="dropdown-divider"></div>

                {/* Logout */}
                <button
                  type="button"
                  className="dropdown-item logout-item"
                  onClick={handleLogout}
                >
                  <span className="dropdown-icon logout-icon">↪</span>

                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}