import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function GuestHome() {
  const navigate = useNavigate();

  const [showContact, setShowContact] = useState(false);
  const [contactData, setContactData] = useState([]);

  // ================= FETCH ADMIN CONTACT DATA =================
  useEffect(() => {
    const getContactData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/tbl_admin"
        );

        console.log("Admin Data:", data);

        setContactData(data);
      } catch (error) {
        console.error("Contact data error:", error);
      }
    };

    getContactData();
  }, []);

  return (
    <div className="guest-page">

      {/* ================= HEADER ================= */}
      <header className="header">
        <div className="nav-container">

          {/* ================= LOGO ================= */}
          <Link to="/" className="brand-logo">
            <div className="brand-icon">
              <img
                src="/image/R2.png"
                alt="ExamHub Logo"
                className="brand-logo-img"
              />
            </div>

            <div className="brand-text">
              <span className="brand-name">
                ExamHub
              </span>

              <small>
                Play to Pass
              </small>
            </div>
          </Link>

          {/* ================= LOGIN ================= */}
          <div className="nav-buttons">

            {/* CONTACT US */}
            <button
              type="button"
              className="contact-btn"
              onClick={() => setShowContact(true)}
            >
              Contact Us
            </button>

            {/* LOGIN DROPDOWN */}
            <div className="role-dropdown">

              <button
                type="button"
                className="account-btn"
              >
                <span className="login-text">
                  Login As
                </span>

                <span className="dropdown-arrow">
                  ▾
                </span>
              </button>

              <div className="role-menu">

                <Link to="/LoginPage?role=admin">
                  <span className="menu-icon">
                    ⚙
                  </span>
                  Admin
                </Link>

                <Link to="/LoginPage?role=faculty">
                  <span className="menu-icon">
                    👨‍🏫
                  </span>
                  Faculty
                </Link>

                <Link to="/LoginPage?role=student">
                  <span className="menu-icon">
                    🎓
                  </span>
                  Student
                </Link>

              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <main className="home">
        <div className="home-container">

          {/* ================= LEFT CONTENT ================= */}
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
              A simple and secure platform for conducting online
              examinations, managing assessments and tracking
              student performance.
            </p>

            {/* ================= BUTTONS ================= */}
            <div className="hero-actions">

              <button
                className="get-started-btn"
                onClick={() =>
                  navigate("/LoginPage?role=student")
                }
              >
                <span className="play-circle">
                  ▶
                </span>

                Get Started
              </button>

              <button
                className="explore-btn"
                onClick={() =>
                  navigate("/LoginPage?role=student")
                }
              >
                Start Exam

                <span className="button-arrow">
                  →
                </span>
              </button>

            </div>

            {/* ================= STATS ================= */}
            <div className="hero-stats">

              <div className="stat">
                <strong>
                  100+
                </strong>

                <span>
                  Practice Tests
                </span>
              </div>

              <div className="stat-divider"></div>

              <div className="stat">
                <strong>
                  Secure
                </strong>

                <span>
                  Online Exams
                </span>
              </div>

              <div className="stat-divider"></div>

              <div className="stat">
                <strong>
                  Free
                </strong>

                <span>
                  To Get Started
                </span>
              </div>

            </div>
          </div>

          {/* ================= RIGHT IMAGE ================= */}
          <div className="home-image">

            <div className="image-bg"></div>

            <div className="decor-circle circle-one"></div>

            <div className="decor-circle circle-two"></div>

            {/* FLOATING CARD 1 */}
            <div className="floating-card card-one">

              <span className="floating-icon check-icon">
                ✓
              </span>

              <div>
                <strong>
                  Easy Exams
                </strong>

                <small>
                  Simple &amp; Fast
                </small>
              </div>

            </div>

            {/* FLOATING CARD 2 */}
            <div className="floating-card card-two">

              <span className="floating-icon star-icon">
                ★
              </span>

              <div>
                <strong>
                  Track Progress
                </strong>

                <small>
                  Improve your score
                </small>
              </div>

            </div>

            {/* MAIN IMAGE */}
            <img
              src="/image/guest.svg"
              alt="Online examination"
              className="hero-image"
            />

          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="gfooter">
        <p>
          © 2026 Online Examination System.
          All Rights Reserved.
        </p>
      </footer>

      {/* ================= CONTACT POPUP ================= */}
      {showContact && (

        <div
          className="contact-overlay"
          onClick={() => setShowContact(false)}
        >

          <div
            className="contact-container"
            onClick={(e) => e.stopPropagation()}
          >

            {/* ================= CLOSE BUTTON ================= */}
            <button
              type="button"
              className="contact-close"
              onClick={() => setShowContact(false)}
            >
              ×
            </button>

            {/* ================= CONTACT HEADER ================= */}
            <div className="contact-header">

              <div className="contact-icon">
                ☎
              </div>

              <div>

                <h2>
                  Contact Us
                </h2>

                <p>
                  Get in touch with our team
                </p>

              </div>

            </div>

            {/* ================= CONTACT DATA ================= */}

            {contactData.length > 0 ? (

              contactData.map((contact) => (

                <div
                  className="contact-person"
                  key={contact.id}
                >

                  {/* AVATAR */}
                  <div className="person-avatar">

                    {contact.admin_name
                      ? contact.admin_name.charAt(0)
                      : "A"}

                  </div>

                  {/* DETAILS */}
                  <div className="person-details">

                    <h3>
                      {contact.admin_name ||
                        "Administrator"}
                    </h3>

                    <p>
                      ✉ {contact.email ||
                        "Not Available"}
                    </p>

                    <p>
                      ☎ {contact.mobile_no ||
                        "Not Available"}
                    </p>

                  </div>

                </div>

              ))

            ) : (

              <p className="no-contact-data">
                Contact information is not available.
              </p>

            )}

          </div>
        </div>
      )}

    </div>
  );
}