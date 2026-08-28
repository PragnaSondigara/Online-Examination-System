import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewFeedback.css";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export function ViewFeedback() {
  const [feedback, setFeedback] = useState([]);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  // =====================================================
  // LOAD FEEDBACK DATA FROM db.json
  // =====================================================

  const loadFeedback = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tbl_feedback");

      setFeedback(res.data);
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredFeedback = feedback.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.name?.toLowerCase().includes(searchText) ||
      item.feedback?.toLowerCase().includes(searchText);

    const matchesType = type === "All" || item.type === type;

    return matchesSearch && matchesType;
  });

  // =====================================================
  // VIEW FEEDBACK
  // =====================================================

  const viewFeedback = (item) => {
    alert(
      `Name: ${item.name}\n\nFeedback: ${item.feedback}\n\nDate: ${item.date}`,
    );
  };

  return (
    <>
      <AdminSidebar />

      <AdminHeader />

      <main className="view-feedback">
        {/* PAGE HEADER */}
        <div className="view-feedback-top">
          <div>
            <h1>Feedback</h1>

            <p>View and manage feedback from students and faculty.</p>
          </div>
        </div>

        {/* FEEDBACK CARD */}
        <section className="feedback-table-card">
          {/* TOP */}
          <div className="table-top">
            <div>
              <h3>All Feedback</h3>

              <p>{filteredFeedback.length} feedback records available</p>
            </div>

            {/* FILTERS */}
            <div className="feedback-filters">
              {/* SEARCH */}
              <div className="search-box">
                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search feedback..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* TYPE FILTER */}
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
              </select>
            </div>
          </div>

          {/* FEEDBACK GRID */}
          <div className="feedback-card-grid">
            {filteredFeedback.length > 0 ? (
              filteredFeedback.map((item) => (
                <div className="feedback-item-card" key={item.id}>
                  {/* CARD HEADER */}
                  <div className="feedback-card-header">
                    <div className="feedback-user">
                      <div className="user-avatar">
                        {item.name ? item.name.charAt(0).toUpperCase() : "?"}
                      </div>

                      <div>
                        <h4>{item.name}</h4>

                        <span>{item.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* FEEDBACK MESSAGE */}
                  <div className="feedback-card-message">
                    <span className="feedback-label">Feedback</span>

                    <p>{item.feedback}</p>
                  </div>

                  {/* FOOTER */}
                  <div className="feedback-card-footer">
                    <div className="feedback-date">📅 {item.date}</div>

                    <button
                      className="view-btn"
                      onClick={() => viewFeedback(item)}
                    >
                      👁 View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-feedback-card">
                <div className="no-feedback-icon">💬</div>

                <h4>No Feedback Found</h4>

                <p>Try changing your search or filter.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
