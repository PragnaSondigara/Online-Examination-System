import "./ChangePassword.css";

function ChangePassword() {
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

          <div className="form-group">
            <label>Current Password</label>

            <div className="password-input">
              <span>🔒</span>
              <input type="password" placeholder="Enter current password" />
              <span>👁</span>
            </div>
          </div>

          <div className="form-group">
            <label>New Password</label>

            <div className="password-input">
              <span>🔒</span>
              <input type="password" placeholder="Enter new password" />
              <span>👁</span>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>

            <div className="password-input">
              <span>🔒</span>
              <input type="password" placeholder="Confirm new password" />
              <span>👁</span>
            </div>
          </div>

          <button className="update-password-btn">Update Password</button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
