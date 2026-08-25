import "./ManageFaculty.css";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import AdminHeader from "./AdminHeader";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageFaculty() {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);

  const loaddata = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tbl_faculty");
      setFaculty(res.data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    }
  };

  useEffect(() => {
    loaddata();
  }, []);

  return (
    <>
      <AdminSidebar />
      <AdminHeader />

      <main className="manage-faculty">
        {/* Top Heading */}
        <div className="page-top">
          <div>
            <h1>Manage Faculty</h1>
            <p>View, manage and monitor all registered faculty members.</p>
          </div>

          <button
            className="add-faculty-btn"
            onClick={() => navigate("/AddFaculty")}
          >
            <span>+</span>
            Add Faculty
          </button>
        </div>

        {/* Table Card */}
        <section className="faculty-card">
          <div className="table-toolbar">
            <div>
              <h2>All Faculty</h2>
              <p>{faculty.length} faculty members registered</p>
            </div>

            <div className="toolbar-actions">
              <div className="search-box">
                <span>⌕</span>
                <input type="text" placeholder="Search faculty..." />
              </div>

              <select className="department-filter">
                <option>All Departments</option>
                <option>Computer Science</option>
                <option>Information Technology</option>
                <option>Management</option>
                <option>Computer Applications</option>
              </select>
            </div>
          </div>

          <div className="faculty-table-wrapper">
            <table className="faculty-table">
              <thead>
                <tr>
                  <th>FACULTY</th>
                  <th>EMAIL</th>
                  <th>MOBILE</th>
                  <th>SUBJECT</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {faculty.length > 0 ? (
                  faculty.map((f) => (
                    <tr key={f.id}>
                      {/* Faculty Name */}
                      <td>
                        <div className="faculty-info">
                          <div
                            className="student-avatar"
                            style={{
                              background: f.color || "#6c63ff",
                            }}
                          >
                            {f.faculty_name
                              ? f.faculty_name.charAt(0).toUpperCase()
                              : "?"}
                          </div>

                          <div>
                            <strong>
                              {f.faculty_name || "Unknown Faculty"}
                            </strong>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td>
                        <span>{f.email || "No email"}</span>
                      </td>

                      {/* Mobile Number */}
                      <td>
                        <span>{f.mobile_no || "No mobile"}</span>
                      </td>

                      {/* Subject */}
                      <td>
                        <span className="course-badge">
                          {f.subject || "N/A"}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`status ${
                            f.is_active === true || f.is_active === 1
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          <i></i>

                          {f.is_active === true || f.is_active === 1
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="action-buttons">
                          <button className="icon-btn edit me-4" title="Edit">
                            ✎
                          </button>

                          <button className="icon-btn delete" title="Delete">
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div
                        style={{
                          textAlign: "center",
                          padding: "30px",
                        }}
                      >
                        No faculty found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <AdminFooter />
    </>
  );
}
