import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

function ChangePassword() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!username) {
      alert("User is not logged in.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      alert("New password must be different from current password.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/tbl_admin?admin_name=${username}`
      );

      if (response.data.length === 0) {
        alert("Admin account not found.");
        return;
      }

      const admin = response.data[0];

      if (admin.password !== currentPassword) {
        alert("Current password is incorrect.");
        return;
      }

      await axios.patch(
        `http://localhost:5000/tbl_admin/${admin.id}`,
        {
          password: newPassword,
        }
      );

      alert("Password changed successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      navigate("/Settings");

    } catch (error) {
      console.error("Change password error:", error);
      alert("Unable to change password.");
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-container">

        {/* Left Side Image */}
        <div className="change-password-left">
          <img
            src="/image/p3.png"
            alt="Change Password"
            className="change-password-image"
          />
        </div>

        {/* Right Side Form */}
        <div className="change-password-card">

          <h2>Change Password</h2>

          <p className="form-description">
            Enter your current password and create a new one.
          </p>

          {/* Current Password */}
          <div className="form-group">
            <label>Current Password</label>

            <div className="password-input">
              <span>🔒</span>

              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
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
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
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
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

              <span
                onClick={() => setShowConfirm(!showConfirm)}
                style={{ cursor: "pointer" }}
              >
                {showConfirm ? "🙈" : "👁"}
              </span>
            </div>
          </div>

          {/* Button */}
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