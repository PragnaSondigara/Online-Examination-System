import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Feedback.css";

import StudentSider from "./StudentSider";
import Header from "./Header";
import Footer from "./Footer";

const API_URL = "http://localhost:5000";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Logged-in student information
  const studentId = localStorage.getItem("studentId");
  const studentName = localStorage.getItem("username");

  // ==========================================
  // GET STUDENT FEEDBACK
  // ==========================================
  const fetchFeedbacks = async () => {
    if (!studentId) {
      alert("Student session not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/tbl_feedback`, {
        params: {
          student_id: studentId,
        },
      });

      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedback:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load your feedback. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD FEEDBACK ON PAGE LOAD
  // ==========================================
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // ==========================================
  // SUBMIT FEEDBACK
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Login validation
    if (!studentId || !studentName) {
      alert("Student session not found. Please login again.");
      return;
    }

    // Empty validation
    if (!feedback.trim()) {
      alert("Please enter your feedback.");
      return;
    }

    try {
      setSubmitting(true);

      const newFeedback = {
        student_id: studentId,
        name: studentName,
        feedback: feedback.trim(),
        date: new Date().toISOString().split("T")[0],
      };

      const response = await axios.post(`${API_URL}/tbl_feedback`, newFeedback);

      // Add newly created feedback to the list
      setFeedbacks((prev) => [...prev, response.data]);

      // Clear textarea
      setFeedback("");

      // Success alert
      alert("Feedback submitted successfully.");
    } catch (error) {
      console.error("Error submitting feedback:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const sortedFeedbacks = feedbacks
    .filter((item) => String(item.student_id) === String(studentId));

  return (
    <>
      <StudentSider />

      <Header />

      <main className="main-content">
        <section className="page-content">
          {/* ================= PAGE TITLE ================= */}
          <div className="page-title">
            <h1>Provide Feedback</h1>

            <p>
              Share your experience and help us improve the examination system.
            </p>
          </div>

          {/* ================= FEEDBACK FORM ================= */}
          <div className="feedback-card">
            <div className="feedback-card-header">
              <div className="header-content">
                <span className="card-label">YOUR OPINION MATTERS</span>

                <h2>Give Your Feedback</h2>

                <p>
                  We value your opinion. Tell us about your experience with the
                  examination system.
                </p>
              </div>

              <div className="feedback-icon">💬</div>
            </div>

            <form className="feedback-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="feedback">Your Feedback</label>

                  <span className="required-text">Required</span>
                </div>

                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Write your feedback here..."
                  rows={6}
                  maxLength={500}
                  disabled={submitting}
                />

                <div className="textarea-footer">
                  <span>Please share your honest experience.</span>

                  <span className="character-count">{feedback.length}/500</span>
                </div>
              </div>

              {/* ================= SUBMIT BUTTON ================= */}
              <button
                type="submit"
                className="submit-button"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Feedback
                    <span className="button-arrow">→</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ================= PREVIOUS FEEDBACK ================= */}
          <div className="previous-card">
            <div className="previous-header">
              <div>
                <span className="card-label">FEEDBACK HISTORY</span>

                <h2>Your Previous Feedback</h2>

                <p>Feedback you have submitted previously.</p>
              </div>

              <div className="result-count">
                <strong>{feedbacks.length}</strong>

                <span>{feedbacks.length === 1 ? "Feedback" : "Feedbacks"}</span>
              </div>
            </div>

            <div className="feedback-list">
              {/* ================= LOADING ================= */}
              {loading ? (
                <div className="empty-state">
                  <div className="loading-spinner"></div>

                  <h3>Loading feedback...</h3>

                  <p>Please wait while we load your feedback.</p>
                </div>
              ) : feedbacks.length === 0 ? (
                /* ================= EMPTY ================= */
                <div className="empty-state">
                  <div className="empty-icon">💬</div>

                  <h3>No feedback submitted yet</h3>

                  <p>Your submitted feedback will appear here.</p>
                </div>
              ) : (
                /* ================= FEEDBACK LIST ================= */
                sortedFeedbacks.map((item) => (
                  <div className="feedback-item" key={item.id}>
                    <div className="feedback-avatar">
                      {item.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="feedback-details">
                      <div className="feedback-top">
                        <div>
                          <h3>{item.name}</h3>

                          <span className="student-label">Student</span>
                        </div>

                        <span className="feedback-date">
                          {new Date(item.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <p>{item.feedback}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
