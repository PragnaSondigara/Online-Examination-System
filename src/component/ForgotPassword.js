import "./ForgotPassword.css";
import forgotPasswordImage from "./image/p2.png";

function ForgotPassword() {
  return (
    <div className="forgot-password-page">

      {/* One Main Container */}
      <div className="forgot-password-container">

        {/* Left Side Image */}
        <div className="forgot-password-left">
          <img
            src={forgotPasswordImage}
            alt="Forgot Password"
            className="forgot-password-image"
          />
        </div>

        {/* Right Side Form */}
        <div className="forgot-password-card">

          <h2>Reset Password</h2>

          <p className="forgot-description">
            Enter your email address below to receive a password reset link.
          </p>

          <div className="forgot-form-group">
            <label>Email Address</label>

            <div className="email-input">
              <span>✉</span>

              <input
                type="email"
                placeholder="Enter your registered email"
              />
            </div>
          </div>

          <button className="send-reset-btn">
            Send Reset Link
          </button>

          <div className="back-login">
            ← Back to Login
          </div>

        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;