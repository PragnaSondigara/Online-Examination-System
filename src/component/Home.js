import "./Home.css";
import { Link, useNavigate } from "react-router-dom";

export default function GuestHome() {
  const navigate = useNavigate();

  return (
    <div className="guest-page">
      {/* ================= HEADER ================= */}
      <header className="header">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="logo">
            <span>exambly</span>
            <small>Play to Pass</small>
          </Link>

          {/* Right Side */}
          <div className="nav-buttons">
            <div className="role-dropdown">
              <button className="account-btn">
                Login As <span>▾</span>
              </button>

              <div className="role-menu">
                <Link to="/LoginPage?role=admin">Admin</Link>

                <Link to="/LoginPage?role=faculty">Faculty</Link>

                <Link to="/LoginPage?role=student">Student</Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <main className="home">
        <div className="home-container">
          {/* Left Content */}
          <div className="home-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Smart • Secure • Simple
            </div>

            <h1>
              Online Examination
              <span> System.</span>
            </h1>

            <p>
              A simple and secure platform for conducting online examinations,
              managing assessments and tracking student performance.
            </p>

            <div className="hero-actions">
              <button
                className="get-started-btn"
                onClick={() => navigate("/LoginPage?role=student")}
              >
                <span className="play-circle">▶︎</span>
                Get Started
              </button>

              <button
                className="explore-btn"
                onClick={() => navigate("/LoginPage?role=student")}
              >
                Start Exam
              </button>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="stat">
                <strong>100+</strong>
                <span>Practice Tests</span>
              </div>

              <div className="stat-divider"></div>

              <div className="stat">
                <strong>Secure</strong>
                <span>Online Exams</span>
              </div>

              <div className="stat-divider"></div>

              <div className="stat">
                <strong>Free</strong>
                <span>To Get Started</span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT IMAGE ================= */}
          <div className="home-image">
            <div className="image-bg"></div>

            <div className="floating-card card-one">
              <span>✓</span>

              <div>
                <strong>Easy Exams</strong>
                <small>Simple &amp; Fast</small>
              </div>
            </div>

            <div className="floating-card card-two">
              <span>★</span>

              <div>
                <strong>Track Progress</strong>
                <small>Improve your score</small>
              </div>
            </div>

            <img src="/image/guest.svg" alt="Online examination" />
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="gfooter">
        <p>© 2026 Online Examination System. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
