import "./ManageStudent.css";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import AdminHeader from "./AdminHeader";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageStudent() {
  const [student, setStudent] = useState([]);
  const navigate = useNavigate();

  // Load student data from JSON Server
  const loaddata = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tbl_student");
      setStudent(res.data);
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  useEffect(() => {
    loaddata();
  }, []);

  // Count active students
  const activeStudent = student.filter(
    (s) => s.is_active === true || s.is_active === 1
  ).length;

  // Count different semesters
  const totalSemesters = new Set(
    student.map((s) => s.semester)
  ).size;

  return (
    <>
      <AdminSidebar />
      <AdminHeader />

      <main className="manage-student">
        {/* Top Heading */}
        <div className="page-top">
          <div>
            <h1>Manage Student</h1>
            <p>View, manage and monitor all registered students.</p>
          </div>

          <button
            className="add-student-btn"
            onClick={() => navigate("/AddStudent")}
          >
            <span>+</span>
            Add Student
          </button>
        </div>

        {/* Stats */}
        <div className="student-stats">

          {/* Total Students */}
          <div className="stat-card purple">
            <div className="stat-icon">👥</div>

            <div>
              <span>Total Students</span>
              <strong>{student.length}</strong>
            </div>
          </div>

          {/* Active Students */}
          <div className="stat-card green">
            <div className="stat-icon">✓</div>

            <div>
              <span>Active Students</span>
              <strong>{activeStudent}</strong>
            </div>
          </div>

          {/* Semesters */}
          <div className="stat-card orange">
            <div className="stat-icon">🎓</div>

            <div>
              <span>Semesters</span>
              <strong>{totalSemesters}</strong>
            </div>
          </div>

          {/* Inactive Students */}
          <div className="stat-card blue">
            <div className="stat-icon">⚠</div>

            <div>
              <span>Inactive Students</span>
              <strong>{student.length - activeStudent}</strong>
            </div>
          </div>

        </div>

        {/* Table Card */}
        <section className="student-card">

          {/* Toolbar */}
          <div className="table-toolbar">

            <div>
              <h2>All Students</h2>
              <p>{student.length} students registered</p>
            </div>

            <div className="toolbar-actions">

              {/* Search */}
              <div className="search-box">
                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search student..."
                />
              </div>

              {/* Semester Filter */}
              <select className="course-filter">
                <option>All Semesters</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>

              </select>

            </div>
          </div>

          {/* Student Table */}
          <div className="student-table-wrapper">

            <table className="student-table">

              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>EMAIL</th>
                  <th>MOBILE</th>
                  <th>SEMESTER</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>

                {student.length > 0 ? (

                  student.map((s) => (

                    <tr key={s.id}>

                      {/* Student Name */}
                      <td>
                        <div className="student-info">

                          <div
                            className="student-avatar"
                            style={{
                              background: s.color || "#6c63ff",
                            }}
                          >
                            {s.student_name
                              ? s.student_name.charAt(0).toUpperCase()
                              : "?"}
                          </div>

                          <div>
                            <strong>
                              {s.student_name || "Unknown Student"}
                            </strong>
                          </div>

                        </div>
                      </td>

                      {/* Email */}
                      <td>
                        <span>
                          {s.email || "No email"}
                        </span>
                      </td>

                      {/* Mobile Number */}
                      <td>
                        <span>
                          {s.mobile_no || "No mobile"}
                        </span>
                      </td>

                      {/* Semester */}
                      <td>
                        <span className="course-badge">
                          Semester {s.semester || "N/A"}
                        </span>
                      </td>

                      {/* Status */}
                      <td>

                        <span
                          className={`status ${s.is_active === true ||
                            s.is_active === 1
                            ? "active"
                            : "inactive"
                            }`}
                        >

                          <i></i>

                          {s.is_active === true ||
                            s.is_active === 1
                            ? "Active"
                            : "Inactive"}

                        </span>

                      </td>

                      {/* Actions */}
                      <td>

                        <div className="action-buttons">

                          <button
                            className="icon-btn edit"
                            title="Edit"
                          >
                            ✎
                          </button>

                          <button
                            className="icon-btn delete"
                            title="Delete"
                          >
                            🗑
                          </button>

                          <button
                            className="icon-btn view"
                            title="View"
                          >
                            →
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
                        No students found.
                      </div>
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* Pagination */}
          <div className="table-footer">

            <span>
              Showing 1–{student.length} of{" "}
              {student.length} students
            </span>

            <div className="pagination">

              <button disabled>
                ‹
              </button>

              <button className="current-page">
                1
              </button>

              <button>
                2
              </button>

              <button>
                3
              </button>

              <button>
                ›
              </button>

            </div>

          </div>

        </section>

      </main>

      <AdminFooter />
    </>
  );
}