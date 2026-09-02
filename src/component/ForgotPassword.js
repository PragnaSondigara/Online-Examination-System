import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username");

  useEffect(() => {
    const getLoggedInUserEmail = async () => {
      if (!username) {
        alert("User is not logged in.");
        navigate("/Login");
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

        const user = response.data[0];

        // Get logged-in user's email
        setEmail(user.email || "");

      } catch (error) {
        console.error("Error fetching email:", error);
        alert("Unable to load your email.");
      } finally {
        setLoading(false);
      }
    };

    getLoggedInUserEmail();
  }, [username, navigate]);


  const handleReset = () => {
    if (!email) {
      alert("Email address not found.");
      return;
    }

    // Go to Change Password
    navigate("/ChangePassword");
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
            Enter your email address below to receive a
            password reset link.
          </p>


          <div className="forgot-form-group">

            <label>Email Address</label>

            <div className="email-input">

              <span>✉</span>

              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                readOnly
              />

            </div>

          </div>


          {/* Reset Button */}
          <button
            type="button"
            className="send-reset-btn"
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? "Loading..." : "Click to reset"}
          </button>


          {/* Back to Login */}
          <div
            className="back-login"
            onClick={() => navigate("/login")}
          >
            ← Back to Login
          </div>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;