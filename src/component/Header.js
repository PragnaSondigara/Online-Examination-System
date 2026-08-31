import "./Header.css";

export default function Header() {
  const username = localStorage.getItem("username");

  return (
    <header className="admin-header">
      <div className="header-right">
        <div className="admin-profile">
          <div className="profile-circle">
            {username ? username.charAt(0).toUpperCase() : "A"}
          </div>

          <div className="profile-info">
            <span className="admin-name">{username || "Admin"}</span>
            <span className="admin-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
