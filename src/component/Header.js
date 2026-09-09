import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("role") || "Administrator";

  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const firstLetter = username.charAt(0).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // My Profile
  const handleProfile = () => {
    setShowDropdown(false);
    navigate("/profile");
  };

  // Settings
  const handleSettings = () => {
    setShowDropdown(false);
    navigate("/settings");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("facultyId");
    localStorage.removeItem("studentId");

    setShowDropdown(false);

    navigate("/LoginPage");
  };

  return (
    <header className="admin-header">
      <div className="header-right">
        <div className="admin-profile" ref={dropdownRef}>
          {/* Profile Button */}
          <button
            type="button"
            className={`profile-trigger ${
              showDropdown ? "profile-active" : ""
            }`}
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            {/* Profile Letter */}
            <div className="profile-circle">{firstLetter}</div>

            {/* Profile Information */}
            <div className="profile-info">
              <span className="admin-name">{username}</span>

              <span className="admin-role">{role}</span>
            </div>

            {/* Arrow */}
            <span className={`profile-arrow ${showDropdown ? "arrow-up" : ""}`}>
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
                <span className="dropdown-icon profile-icon">👤</span>

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
  );
}
