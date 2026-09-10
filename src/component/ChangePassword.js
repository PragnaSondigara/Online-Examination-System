import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const role = localStorage.getItem("role");
    const studentId = localStorage.getItem("studentId");
    const facultyId = localStorage.getItem("facultyId");
    const username = localStorage.getItem("username");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different from current password.");
      return;
    }

    try {
      let url = "";
      let user = null;

      // Student
      if (role === "Student") {
        const res = await axios.get(
          `http://localhost:5000/tbl_student?id=${studentId}`,
        );

        if (res.data.length === 0) {
          setError("Student not found.");
          return;
        }

        user = res.data[0];
        url = `http://localhost:5000/tbl_student/${studentId}`;
      }

      // Faculty
      else if (role === "Faculty") {
        const res = await axios.get(
          `http://localhost:5000/tbl_faculty?id=${facultyId}`,
        );

        if (res.data.length === 0) {
          setError("Faculty not found.");
          return;
        }

        user = res.data[0];
        url = `http://localhost:5000/tbl_faculty/${facultyId}`;
      }

      // Admin
      else if (role === "Administrator") {
        const res = await axios.get(
          `http://localhost:5000/tbl_admin?admin_name=${username}`,
        );

        if (res.data.length === 0) {
          setError("Admin not found.");
          return;
        }

        user = res.data[0];
        url = `http://localhost:5000/tbl_admin/${user.id}`;
      } else {
        setError("Invalid user role.");
        return;
      }

      // Check current password
      if (user.password !== currentPassword) {
        setError("Current password is incorrect.");
        return;
      }

      // Update password
      const updateRes = await axios.patch(url, {
        password: newPassword,
      });

      // Successfully updated
      if (updateRes.status === 200) {
        alert("Password updated successfully. Please login again.");

        // Logout current user
        localStorage.removeItem("auth");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("studentId");
        localStorage.removeItem("facultyId");

        // Go to Login Page
        navigate("/");
      }
    } catch (error) {
      console.error("Change password error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

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

          {/* Success Message */}
          {message && (
            <p style={{ color: "green", marginBottom: "15px" }}>{message}</p>
          )}

          {/* Error Message */}
          {error && (
            <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>
          )}

          <form onSubmit={handleChangePassword}>
            {/* Current Password */}
            <div className="form-group">
              <label>Current Password</label>

              <div className="password-input">
                <span>🔒</span>

                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <span
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{ cursor: "pointer" }}
                >
                  {showCurrent ? "🙈" : "👁"}
                </span>
              </div>
            </div>

            {/* New Password */}
            <div className="form-group">
              <label>New Password</label>

              <div className="password-input">
                <span>🔒</span>

                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <span
                  onClick={() => setShowNew(!showNew)}
                  style={{ cursor: "pointer" }}
                >
                  {showNew ? "🙈" : "👁"}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>Confirm New Password</label>

              <div className="password-input">
                <span>🔒</span>

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <span
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{ cursor: "pointer" }}
                >
                  {showConfirm ? "🙈" : "👁"}
                </span>
              </div>
            </div>

            <button type="submit" className="update-password-btn">
              Update Password
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}

export default ChangePassword;