import React, { useState } from "react";
import "./ViewFeedback.css";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export function ViewFeedback() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  // Feedback Data
  const feedbackData = [
    {
      id: 1,
      name: "abc",
      role: "Student",
      feedback:
        "The online examination system is very easy to use.",
      date: "25 Aug 2026",
      status: "New",
    },
    {
      id: 2,
      name: "xyz",
      role: "Faculty",
      feedback:
        "The exam scheduling feature is very useful and simple.",
      date: "24 Aug 2026",
      status: "Reviewed",
    },
    {
      id: 3,
      name: "Pooja",
      role: "Student",
      feedback:
        "Please add more practice tests for students.",
      date: "23 Aug 2026",
      status: "New",
    },
    {
      id: 4,
      name: "Rahul",
      role: "Faculty",
      feedback:
        "The result management system is working well.",
      date: "22 Aug 2026",
      status: "Reviewed",
    },
  ];

  // Search + Filter
  const filteredFeedback = feedbackData.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(searchText) ||
      item.feedback.toLowerCase().includes(searchText);

    const matchesType =
      type === "All" || item.role === type;

    return matchesSearch && matchesType;
  });

  // View Feedback
  const viewFeedback = (item) => {
    alert(
      `Feedback from ${item.name}\n\n${item.feedback}\n\nRole: ${item.role}\nDate: ${item.date}\nStatus: ${item.status}`
    );
  };

  return (
    <>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Header */}
      <AdminHeader />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="view-feedback">

        {/* ===================================================
            PAGE TITLE
        =================================================== */}

        <div className="view-feedback-top">

          <div>
            <h1>Feedback</h1>

            <p>
              View and manage feedback from students and faculty.
            </p>
          </div>

        </div>


        {/* ===================================================
            FEEDBACK CARD
        =================================================== */}

        <section className="feedback-table-card">

          {/* =================================================
              TOP SECTION
          ================================================= */}

          <div className="table-top">

            <div>
              <h3>All Feedback</h3>

              <p>
                {filteredFeedback.length} feedback records available
              </p>
            </div>


            {/* =================================================
                SEARCH + FILTER
            ================================================= */}

            <div className="feedback-filters">

              {/* Search */}

              <div className="search-box">

                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search feedback..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>


              {/* Type Filter */}

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >

                <option value="All">
                  All Types
                </option>

                <option value="Student">
                  Student
                </option>

                <option value="Faculty">
                  Faculty
                </option>

              </select>

            </div>

          </div>


          {/* =================================================
              FEEDBACK CARDS
          ================================================= */}

          <div className="feedback-card-grid">

            {filteredFeedback.length > 0 ? (

              filteredFeedback.map((item) => (

                <div
                  className="feedback-item-card"
                  key={item.id}
                >

                  {/* =========================================
                      CARD HEADER
                  ========================================= */}

                  <div className="feedback-card-header">

                    {/* User Information */}

                    <div className="feedback-user">

                      <div className="user-avatar">

                        {item.name
                          ? item.name.charAt(0).toUpperCase()
                          : "?"}

                      </div>


                      <div>

                        <h4>
                          {item.name}
                        </h4>

                        <span
                          className={
                            item.role === "Student"
                              ? "role student-role"
                              : "role faculty-role"
                          }
                        >
                          {item.role}
                        </span>

                      </div>

                    </div>


                    {/* Status */}

                    <span
                      className={
                        item.status === "New"
                          ? "status new-status"
                          : "status reviewed-status"
                      }
                    >
                      ● {item.status}
                    </span>

                  </div>


                  {/* =========================================
                      FEEDBACK MESSAGE
                  ========================================= */}

                  <div className="feedback-card-message">

                    <span className="feedback-label">
                      Feedback
                    </span>

                    <p>
                      {item.feedback}
                    </p>

                  </div>


                  {/* =========================================
                      CARD FOOTER
                  ========================================= */}

                  <div className="feedback-card-footer">

                    <div className="feedback-date">
                      📅 {item.date}
                    </div>


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

              /* =============================================
                 NO DATA
              ============================================= */

              <div className="no-feedback-card">

                <div className="no-feedback-icon">
                  💬
                </div>

                <h4>
                  No Feedback Found
                </h4>

                <p>
                  Try changing your search or filter.
                </p>

              </div>

            )}

          </div>

        </section>

      </main>
    </>
  );
}

export default ViewFeedback;