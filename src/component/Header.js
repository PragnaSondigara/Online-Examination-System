import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const username = localStorage.getItem("username") || "Admin";

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfile = () => {
    setShowDropdown(false);
    navigate("/profile");
  };

  const handleSettings = () => {
    setShowDropdown(false);
    navigate("/settings");
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");

    setShowDropdown(false);

    navigate("/login");
  };

  const firstLetter = username.charAt(0).toUpperCase();

  return (
    <header className="admin-header">
      <div className="header-right">

        <div className="admin-profile" ref={dropdownRef}>

          {/* Profile Button */}
          <div
            className="profile-trigger"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <div className="profile-circle">
              {firstLetter}
            </div>

            <div className="profile-info">
              <span className="admin-name">
                {username}
              </span>

              <span className="admin-role">
                Administrator
              </span>
            </div>

            <span className="profile-arrow">
              {showDropdown ? "▲" : "▼"}
            </span>
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="profile-dropdown">

              {/* User Information */}
              <div className="dropdown-user">
                <div className="dropdown-avatar">
                  {firstLetter}
                </div>

                <div className="dropdown-user-info">
                  <div className="dropdown-user-name">
                    {username}
                  </div>

                  <div className="dropdown-user-role">
                    Administrator
                  </div>
                </div>
              </div>

              <div className="dropdown-divider"></div>

              {/* My Profile */}
              <button
                type="button"
                className="dropdown-item"
                onClick={handleProfile}
              >
                <span className="dropdown-icon">👤</span>
                <span>My Profile</span>
              </button>

              {/* Settings */}
              <button
                type="button"
                className="dropdown-item"
                onClick={handleSettings}
              >
                <span className="dropdown-icon">⚙</span>
                <span>Settings</span>
              </button>

              <div className="dropdown-divider"></div>

              {/* Logout */}
              <button
                type="button"
                className="dropdown-item logout-item"
                onClick={handleLogout}
              >
                <span className="dropdown-icon">⇥</span>
                <span>Logout</span>
              </button>

            </div>
          )}

        </div>

      </div>
    </header>
  );
}