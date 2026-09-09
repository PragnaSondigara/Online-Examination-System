import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function GuestHome() {
  const navigate = useNavigate();

  const [showContact, setShowContact] = useState(false);

  const [contactData, setContactData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/tbl_admin")
      .then((response) => response.json())
      .then((data) => {
        setContactData(data);
      })
      .catch((error) => {
        console.error("Contact data error:", error);
      });
  }, []);

  return (
    <div className="guest-page">
      {/* ================= HEADER ================= */}
      <header className="header">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="logo">
            <span>ExamHub</span>
            <small>Play to Pass</small>
          </Link>

          {/* Right Side */}
          <div className="nav-buttons">
            {/* Contact Us */}
            <button
              type="button"
              className="contact-btn"
              onClick={() => setShowContact(true)}
            >
              Contact Us
            </button>

            {/* Login Dropdown */}
            <div className="role-dropdown">
              <button type="button" className="account-btn">
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

      {/* ================= CONTACT US POPUP ================= */}
      {showContact && (
        <div className="contact-overlay" onClick={() => setShowContact(false)}>
          <div
            className="contact-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              className="contact-close"
              onClick={() => setShowContact(false)}
            >
              ×
            </button>

            {/* Contact Header */}
            <div className="contact-header">
              <div className="contact-icon">☎</div>

              <div>
                <h2>Contact Us</h2>
                <p>Get in touch with our team</p>
              </div>
            </div>

            {/* DATABASE CONTACT DATA */}
            {contactData.map((contact) => (
              <div className="contact-person" key={contact.id}>
                <div className="person-avatar">
                  {contact.admin_name ? contact.admin_name.charAt(0) : "A"}
                </div>

                <div className="person-details">
                  <h3>{contact.admin_name}</h3>

                  <p>✉ {contact.email}</p>

                  <p>☎ {contact.mobile_no || "Not Available"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
