import "./Settings.css";
import AdminSidebar from "./AdminSidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="settings-container">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Area */}
      <div className="settings-main">

        {/* Header */}
        <Header />

        {/* Settings Content */}
        <div className="settings-page">

          {/* Page Header */}
          <div className="settings-page-header">
            <h1>Settings</h1>
            <p>
              Manage your account settings and security preferences.
            </p>
          </div>


        

          {/* =================================
              SECURITY
          ================================= */}

          <div className="settings-card">

            <div className="settings-card-header">

              <div className="settings-icon security-icon">
                🔒
              </div>

              <div>

                <h2>Security</h2>

                <p>
                  Manage your password and account security.
                </p>

              </div>

            </div>


            {/* Change Password */}

            <div className="settings-option">

              <div className="option-left">

                <div className="option-icon">
                  🔑
                </div>

                <div>

                  <h3>Change Password</h3>

                  <p>
                    Update your current account password.
                  </p>

                </div>

              </div>


              <button
                className="settings-action"
                onClick={() =>
                  navigate("/ChangePassword")
                }
              >
                Change
                <span>→</span>
              </button>

            </div>


            {/* Forgot Password */}

            <div className="settings-option">

              <div className="option-left">

                <div className="option-icon">
                  🔐
                </div>

                <div>

                  <h3>Forgot Password</h3>

                  <p>
                    Reset your password if you cannot remember it.
                  </p>

                </div>

              </div>


              <button
                className="settings-action"
                onClick={() =>
                  navigate("/ForgotPassword")
                }
              >
                Reset
                <span>→</span>
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}