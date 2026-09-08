import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  // =========================================
  // LOGIN USER DATA
  // =========================================

  const username = localStorage.getItem("username") || "";
  const role = localStorage.getItem("role") || "";

  // =========================================
  // STATES
  // =========================================

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

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
  // GET LOGGED-IN USER EMAIL
  // =========================================

  useEffect(() => {
    const getLoggedInUserEmail = async () => {
      if (!username || !role) {
        alert("User is not logged in.");
        navigate("/login");
        return;
      }

      try {
        const tableName = getTableName();
        const nameField = getNameField();

        if (!tableName || !nameField) {
          alert("Invalid user role.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/${tableName}?${nameField}=${encodeURIComponent(
            username
          )}`
        );

        console.log("Forgot Password User:", response.data);

        if (response.data.length === 0) {
          alert("User account not found.");
          return;
        }

        const user = response.data[0];

        // Logged-in user's email
        setEmail(user.email || "");
      } catch (error) {
        console.error(
          "Error fetching email:",
          error
        );

        alert("Unable to load your email.");
      } finally {
        setLoading(false);
      }
    };

    getLoggedInUserEmail();
  }, [username, role, navigate]);

  // =========================================
  // RESET BUTTON
  // =========================================

  const handleReset = () => {
    if (!email) {
      alert("Email address not found.");
      return;
    }

    navigate("/ChangePassword");
  };

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="forgot-password-page">

      <div className="forgot-password-container">

        {/* =================================
            LEFT IMAGE
        ================================= */}

        <div className="forgot-password-left">

          <img
            src="/image/p2.png"
            alt="Forgot Password"
            className="forgot-password-image"
          />

        </div>

        {/* =================================
            RIGHT FORM
        ================================= */}

        <div className="forgot-password-card">

          <h2>Reset Password</h2>

          <p className="forgot-description">
            Your registered email address is shown below.
          </p>

          {/* =================================
              EMAIL
          ================================= */}

          <div className="forgot-form-group">

            <label>
              Email Address
            </label>

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

          {/* =================================
              RESET BUTTON
          ================================= */}

          <button
            type="button"
            className="send-reset-btn"
            onClick={handleReset}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Click to reset"}
          </button>

          {/* =================================
              BACK TO LOGIN
          ================================= */}

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