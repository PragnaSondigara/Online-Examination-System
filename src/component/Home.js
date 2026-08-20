import guestimg from "./image/guest.svg";
import "./Home.css";
import { Link } from "react-router-dom";

export default function GuestHome() {
  return (
    <div className="guest-page">
      {/* Header */}
      <header className="header">
        <div className="nav-container">

          {/* Logo */}
          <Link to="/" className="logo">
            <span>exambly</span>
            <small>Play to Pass</small>
          </Link>

          {/* Exams */}
          <div className="exam-menu">
            <span>Exams</span>
          </div>

          {/* Search */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Search eg. Online Exam 2026"
            />
            <span className="search-icon">⌕</span>
          </div>

          {/* Buttons */}
          <div className="nav-buttons">
            <Link className="login-btn" to="/LoginPage">
              Login
            </Link>

            <button className="account-btn">
              Create Free Account
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="home">
        <div className="home-container">

          {/* Left Content */}
          <div className="home-content">

            <div className="hero-badge">
              <span className="badge-dot"></span>
              Learn • Practice • Succeed
            </div>

            <h1>
              Online Examination
              <span> System.</span>
            </h1>

            <p>
              Take online exams, practice tests and assessments easily.
              Prepare, perform and track your progress from anywhere.
            </p>

            <div className="hero-actions">
              <button className="get-started-btn">
                <span className="play-circle">
                  ▶︎
                </span>
                Get Started
              </button>

              <button className="explore-btn">
                Explore Exams
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <strong>100+</strong>
                <span>Practice Tests</span>
              </div>

              <div className="stat-divider"></div>

              <div className="stat">
                <strong>24/7</strong>
                <span>Learn Anywhere</span>
              </div>

              <div className="stat-divider"></div>

              <div className="stat">
                <strong>Free</strong>
                <span>To Get Started</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
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

            <img
              src={guestimg}
              alt="Online examination"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="gfooter">
        <p>
          © 2026 Online Examination System. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}