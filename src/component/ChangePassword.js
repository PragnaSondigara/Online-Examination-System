import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

function ChangePassword() {
  const navigate = useNavigate();

  // =========================================
  // LOGIN USER DATA
  // =========================================

  const username = localStorage.getItem("username") || "";
  const role = localStorage.getItem("role") || "";

  // =========================================
  // PASSWORD STATES
  // =========================================

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // =========================================
  // GET TABLE NAME
  // =========================================

  const getTableName = () => {
    if (role === "Administrator") {
      return "tbl_admin";
    }

    if (role === "Faculty") {
      return "tbl_faculty";
    }

    if (role === "Student") {
      return "tbl_student";
    }

    return "";
  };

  // =========================================
  // GET NAME FIELD
  // =========================================

  const getNameField = () => {
    if (role === "Administrator") {
      return "admin_name";
    }

    if (role === "Faculty") {
      return "faculty_name";
    }

    if (role === "Student") {
      return "student_name";
    }

    return "";
  };

  // =========================================
  // CHANGE PASSWORD
  // =========================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // =========================================
    // CHECK LOGIN
    // =========================================

    if (!username || !role) {
      alert("User is not logged in.");
      return;
    }

    // =========================================
    // CHECK FIELDS
    // =========================================

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      alert("Please fill all password fields.");
      return;
    }

    // =========================================
    // PASSWORD LENGTH
    // =========================================

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    // =========================================
    // CONFIRM PASSWORD
    // =========================================

    if (newPassword !== confirmPassword) {
      alert(
        "New password and confirm password do not match."
      );
      return;
    }

    // =========================================
    // SAME PASSWORD
    // =========================================

    if (currentPassword === newPassword) {
      alert(
        "New password must be different from current password."
      );
      return;
    }

    try {
      const tableName = getTableName();
      const nameField = getNameField();

      // =========================================
      // CHECK ROLE
      // =========================================

      if (!tableName || !nameField) {
        alert("Invalid user role.");
        return;
      }

      // =========================================
      // FIND LOGGED-IN USER
      // =========================================

      const response = await axios.get(
        `http://localhost:5000/${tableName}?${nameField}=${encodeURIComponent(
          username
        )}`
      );

      // =========================================
      // USER NOT FOUND
      // =========================================

      if (response.data.length === 0) {
        alert("User account not found.");
        return;
      }

      const user = response.data[0];

      // =========================================
      // CHECK CURRENT PASSWORD
      // =========================================

      if (user.password !== currentPassword) {
        alert("Current password is incorrect.");
        return;
      }

      // =========================================
      // UPDATE PASSWORD
      // =========================================

      await axios.patch(
        `http://localhost:5000/${tableName}/${user.id}`,
        {
          password: newPassword,
        }
      );

      // =========================================
      // SUCCESS
      // =========================================

      alert("Password changed successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      navigate("/Settings");

    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      alert("Unable to change password.");
    }
  };

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="change-password-page">

      <div className="change-password-container">

        {/* =================================
            LEFT IMAGE
        ================================= */}

        <div className="change-password-left">

          <img
            src="/image/p3.png"
            alt="Change Password"
            className="change-password-image"
          />

        </div>

        {/* =================================
            RIGHT FORM
        ================================= */}

        <div className="change-password-card">

          <h2>Change Password</h2>

          <p className="form-description">
            Enter your current password and create a new one.
          </p>

          {/* =================================
              CURRENT PASSWORD
          ================================= */}

          <div className="form-group">

            <label>
              Current Password
            </label>

            <div className="password-input">

              <span>🔒</span>

              <input
                type={
                  showCurrent
                    ? "text"
                    : "password"
                }
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
              />

              <span
                onClick={() =>
                  setShowCurrent(!showCurrent)
                }
                style={{
                  cursor: "pointer",
                }}
              >
                {showCurrent ? "🙈" : "👁"}
              </span>

            </div>

          </div>

          {/* =================================
              NEW PASSWORD
          ================================= */}

          <div className="form-group">

            <label>
              New Password
            </label>

            <div className="password-input">

              <span>🔒</span>

              <input
                type={
                  showNew
                    ? "text"
                    : "password"
                }
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
              />

              <span
                onClick={() =>
                  setShowNew(!showNew)
                }
                style={{
                  cursor: "pointer",
                }}
              >
                {showNew ? "🙈" : "👁"}
              </span>

            </div>

          </div>

          {/* =================================
              CONFIRM PASSWORD
          ================================= */}

          <div className="form-group">

            <label>
              Confirm New Password
            </label>

            <div className="password-input">

              <span>🔒</span>

              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

              <span
                onClick={() =>
                  setShowConfirm(!showConfirm)
                }
                style={{
                  cursor: "pointer",
                }}
              >
                {showConfirm ? "🙈" : "👁"}
              </span>

            </div>

          </div>

          {/* =================================
              BUTTON
          ================================= */}

          <button
            type="button"
            className="update-password-btn"
            onClick={handleChangePassword}
          >
            Update Password
          </button>

        </div>

      </div>

    </div>
  );
}

export default ChangePassword;