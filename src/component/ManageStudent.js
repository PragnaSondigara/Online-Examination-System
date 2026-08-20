import "./ManageStudent.css";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import AdminHeader from "./AdminHeader";
import axios from "axios";
import { useState, useEffect } from "react";

// const student = [
//   {
//     id: "STU001",
//     name: "Rahul Sharma",
//     email: "rahul@gmail.com",
//     course: "BCA",
//     exams: 5,
//     status: "Active",
//     color: "#6c63ff",
//   },
//   {
//     id: "STU002",
//     name: "Priya Singh",
//     email: "priya@gmail.com",
//     course: "BCA",
//     exams: 3,
//     status: "Active",
//     color: "#ff6584",
//   },
//   {
//     id: "STU003",
//     name: "Amit Kumar",
//     email: "amit@gmail.com",
//     course: "BCA",
//     exams: 7,
//     status: "Inactive",
//     color: "#ff9f43",
//   },
//   {
//     id: "STU004",
//     name: "Neha Patel",
//     email: "neha@gmail.com",
//     course: "MCA",
//     exams: 8,
//     status: "Active",
//     color: "#20bf6b",
//   },
// ];

export default function ManageStudent() {
  //   const activestudent = student.filter(
  //     (student) => student.status === "Active",
  //   ).length;

  const [student, setStudent] = useState([]);
  const loaddata = async () => {
    const res = await axios.get("http://localhost:3000/tbl_student");
    setStudent(res.data);
  };
  useEffect(() => {
    loaddata();
  }, []);
  return (
    <>
      <AdminSidebar />
      <AdminHeader />

      <main className="manage-student">
        {/* Top Heading */}
        <div className="page-top">
          <div>
            <h1>Manage student</h1>
            <p>View, manage and monitor all registered student.</p>
          </div>

          <button className="add-student-btn">
            <span>+</span>
            Add Student
          </button>
        </div>

        {/* Stats */}
        <div className="student-stats">
          <div className="stat-card purple">
            <div className="stat-icon">👥</div>
            <div>
              <span>Total student</span>
              <strong>{student.length}</strong>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">✓</div>
            <div>
              <span>Active student</span>
              <strong>{}</strong>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">📝</div>
            <div>
              <span>Total Exams</span>
              <strong>
                {student.reduce((total, student) => total + student.exams, 0)}
              </strong>
            </div>
          </div>

          <div className="stat-card blue">
            <div className="stat-icon">🎓</div>
            <div>
              <span>Courses</span>
              <strong>2</strong>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <section className="student-card">
          <div className="table-toolbar">
            <div>
              <h2>All student</h2>
              <p>{student.length} student registered</p>
            </div>

            <div className="toolbar-actions">
              <div className="search-box">
                <span>⌕</span>
                <input type="text" placeholder="Search student..." />
              </div>

              <select className="course-filter">
                <option>All Courses</option>
                <option>BCA</option>
                <option>MCA</option>
              </select>
            </div>
          </div>

          <div className="student-table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>ID</th>
                  <th>COURSE</th>
                  <th>EXAMS</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {student.map((s, student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="student-info">
                        <div
                          className="student-avatar"
                          style={{ background: student.color }}
                        >
                          {student.name.charAt(0)}
                        </div>

                        <div>
                          <strong>{student.name}</strong>
                          <span>{student.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="student-id">{student.id}</span>
                    </td>

                    <td>
                      <span className="course-badge">{student.course}</span>
                    </td>

                    <td>
                      <div className="exam-count">
                        <strong>{student.exams}</strong>
                        <span>exams</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`status ${
                          student.status === "Active" ? "active" : "inactive"
                        }`}
                      >
                        <i></i>
                        {student.status}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn edit" title="Edit">
                          ✎
                        </button>

                        <button className="icon-btn delete" title="Delete">
                          🗑
                        </button>

                        <button className="icon-btn view" title="View">
                          →
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="table-footer">
            <span>
              Showing 1–{student.length} of {student.length} student
            </span>

            <div className="pagination">
              <button disabled>‹</button>
              <button className="current-page">1</button>
              <button>2</button>
              <button>3</button>
              <button>›</button>
            </div>
          </div>
        </section>
      </main>

      <AdminFooter />
    </>
  );
}
