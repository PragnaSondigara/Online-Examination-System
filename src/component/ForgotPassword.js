import "./ForgotPassword.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      let user = null;
      let table = "";

      // Check Student
      const studentRes = await axios.get(
        `http://localhost:5000/tbl_student?email=${email}`,
      );

      if (studentRes.data.length > 0) {
        user = studentRes.data[0];
        table = "tbl_student";
      }

      // Check Faculty
      if (!user) {
        const facultyRes = await axios.get(
          `http://localhost:5000/tbl_faculty?email=${email}`,
        );

        if (facultyRes.data.length > 0) {
          user = facultyRes.data[0];
          table = "tbl_faculty";
        }
      }

      // Check Admin
      if (!user) {
        const adminRes = await axios.get(
          `http://localhost:5000/tbl_admin?email=${email}`,
        );

        if (adminRes.data.length > 0) {
          user = adminRes.data[0];
          table = "tbl_admin";
        }
      }

      // Email not found
      if (!user) {
        setError("Email address is not registered.");
        return;
      }

      // Generate temporary password
      const newPassword = "Reset@" + Math.floor(1000 + Math.random() * 9000);

      // Update password
      const updateRes = await axios.patch(
        `http://localhost:5000/${table}/${user.id}`,
        {
          password: newPassword,
        },
      );

      if (updateRes.status === 200) {
        alert(
          `Password reset successfully!\n\nYour new password is: ${newPassword}`,
        );

        // Go to Login page
        navigate("/ChangePassword");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        {/* Left Side Image */}
        <div className="forgot-password-left">
          <img
            src="/image/p2.png"
            alt="Forgot Password"
            className="forgot-password-image"
          />
        </div>

        {/* Right Side Form */}
        <div className="forgot-password-card">
          <h2>Reset Password</h2>

          <p className="forgot-description">
            Enter your email address below to reset your password.
          </p>

          {message && <p style={{ color: "green" }}>{message}</p>}

          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handleForgotPassword}>
            <div className="forgot-form-group">
              <label>Email Address</label>

              <div className="email-input">
                <span>✉</span>

                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="send-reset-btn">
              Send Reset Link
            </button>
          </form>

          <div className="back-login" onClick={() => navigate("/loginPage")}>
            ← Back to Login
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;