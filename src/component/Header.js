import "./Header.css";
export default function Header() {
  return (
    <header className="admin-header">
      <div className="header-right">

        <div className="admin-profile">
          <div className="profile-circle">S</div>

          <div className="profile-info">
            <span className="admin-name">Admin</span>
            <span className="admin-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
