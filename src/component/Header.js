import "./Header.css";

export default function Header() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  return (
    <header className="admin-header">
      <div className="header-right">
        <div className="admin-profile">
          <div className="profile-circle">
            {username ? username.charAt(0).toUpperCase() : "A"}
          </div>

          <div className="profile-info">
            <span className="admin-name">{username}</span>
            <span className="admin-role">{role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
