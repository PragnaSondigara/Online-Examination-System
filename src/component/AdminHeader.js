import "./AdminHeader.css";

export default function AdminHeader() {
  return (
    <header className="admin-header">
      

      <div className="header-right">
        <button className="notification-btn">
          🔔
        </button>

        <div className="admin-profile">
          <div className="profile-circle">
            S
          </div>

          <div className="profile-info">
            <span className="admin-name">Admin</span>
            <span className="admin-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}