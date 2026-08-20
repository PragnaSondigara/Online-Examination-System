import "./ManageFaculty.css";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import AdminHeader from "./AdminHeader";

export default function ManageFaculty() {
  const faculty = [
    {
      id: "FAC001",
      name: "Dr. Rahul Sharma",
      email: "rahul.sharma@example.com",
      department: "Computer Science",
      subjects: 4,
      status: "Active",
      color: "#35c79a",
    },
    {
      id: "FAC002",
      name: "Prof. Priya Patel",
      email: "priya.patel@example.com",
      department: "Information Technology",
      subjects: 3,
      status: "Active",
      color: "#5ed9b3",
    },
    {
      id: "FAC003",
      name: "Dr. Amit Shah",
      email: "amit.shah@example.com",
      department: "Management",
      subjects: 5,
      status: "Active",
      color: "#2aa982",
    },
    {
      id: "FAC004",
      name: "Prof. Neha Mehta",
      email: "neha.mehta@example.com",
      department: "Computer Applications",
      subjects: 2,
      status: "Inactive",
      color: "#45d4a8",
    },
  ];

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

          <button className="add-faculty-btn">
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
                <input
                  type="text"
                  placeholder="Search faculty..."
                />
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
                  <th>ID</th>
                  <th>DEPARTMENT</th>
                  <th>SUBJECTS</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {faculty.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="faculty-info">
                        <div
                          className="faculty-avatar"
                          style={{ background: member.color }}
                        >
                          {member.name.charAt(0)}
                        </div>

                        <div>
                          <strong>{member.name}</strong>
                          <span>{member.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="faculty-id">
                        {member.id}
                      </span>
                    </td>

                    <td>
                      <span className="department-badge">
                        {member.department}
                      </span>
                    </td>

                    <td>
                      <div className="subject-count">
                        <strong>{member.subjects}</strong>
                        <span>subjects</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`status ${
                          member.status === "Active"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        <i></i>
                        {member.status}
                      </span>
                    </td>

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
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="table-footer">
            <span>
              Showing 1–{faculty.length} of {faculty.length} faculty
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