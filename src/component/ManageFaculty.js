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

  // Edit state
  const [editId, setEditId] = useState(null);

  const [editFaculty, setEditFaculty] = useState({
    faculty_name: "",
    email: "",
    mobile_no: "",
    subject: "",
    is_active: true,
  });

  // =====================================================
  // LOAD FACULTY DATA
  // =====================================================

  const loaddata = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/tbl_faculty"
      );

      setFaculty(res.data);
    } catch (error) {
      console.error(
        "Error fetching faculty data:",
        error
      );
    }
  };

  useEffect(() => {
    loaddata();
  }, []);

  // =====================================================
  // START EDIT
  // =====================================================

  const startEdit = (facultyData) => {
    setEditId(facultyData.id);

    setEditFaculty({
      faculty_name: facultyData.faculty_name || "",
      email: facultyData.email || "",
      mobile_no: facultyData.mobile_no || "",
      subject: facultyData.subject || "",
      is_active:
        facultyData.is_active === true ||
        facultyData.is_active === 1,
    });
  };

  // =====================================================
  // HANDLE EDIT INPUT
  // =====================================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditFaculty((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SAVE / UPDATE FACULTY
  // =====================================================

  const saveEdit = async (id) => {
    try {
      // Basic validation
      if (!editFaculty.faculty_name.trim()) {
        alert("Faculty name is required.");
        return;
      }

      if (!editFaculty.email.trim()) {
        alert("Email is required.");
        return;
      }

      if (!editFaculty.mobile_no.trim()) {
        alert("Mobile number is required.");
        return;
      }

      if (!editFaculty.subject.trim()) {
        alert("Subject is required.");
        return;
      }

      // Find existing faculty
      const existingFaculty = faculty.find(
        (f) => f.id === id
      );

      if (!existingFaculty) {
        alert("Faculty not found.");
        return;
      }

      // Keep all existing fields and update edited fields
      const updatedFaculty = {
        ...existingFaculty,

        faculty_name:
          editFaculty.faculty_name.trim(),

        email:
          editFaculty.email.trim(),

        mobile_no:
          editFaculty.mobile_no.trim(),

        subject:
          editFaculty.subject.trim(),

        is_active:
          editFaculty.is_active,
      };

      // PUT request to JSON Server
      await axios.put(
        `http://localhost:5000/tbl_faculty/${id}`,
        updatedFaculty
      );

      // Exit edit mode
      setEditId(null);

      // Reset edit data
      setEditFaculty({
        faculty_name: "",
        email: "",
        mobile_no: "",
        subject: "",
        is_active: true,
      });

      // Reload data
      await loaddata();

      alert("Faculty updated successfully!");
    } catch (error) {
      console.error(
        "Error updating faculty:",
        error
      );

      alert("Failed to update faculty.");
    }
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEdit = () => {
    setEditId(null);

    setEditFaculty({
      faculty_name: "",
      email: "",
      mobile_no: "",
      subject: "",
      is_active: true,
    });
  };

  // =====================================================
  // DELETE FACULTY
  // =====================================================

  const deleteFaculty = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this faculty member?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/tbl_faculty/${id}`
      );

      await loaddata();

      alert("Faculty deleted successfully!");
    } catch (error) {
      console.error(
        "Error deleting faculty:",
        error
      );

      alert("Failed to delete faculty.");
    }
  };

  return (
    <>
      <AdminSidebar />
      <AdminHeader />

      <main className="manage-faculty">

        {/* =====================================================
            TOP HEADING
        ===================================================== */}

        <div className="page-top">
          <div>
            <h1>Manage Faculty</h1>

            <p>
              View, manage and monitor all registered
              faculty members.
            </p>
          </div>

          <button
            className="add-faculty-btn"
            onClick={() =>
              navigate("/AddFaculty")
            }
          >
            <span>+</span>
            Add Faculty
          </button>
        </div>

        {/* =====================================================
            TABLE CARD
        ===================================================== */}

        <section className="faculty-card">

          {/* Toolbar */}

          <div className="table-toolbar">

            <div>
              <h2>
                All Faculty
              </h2>

              <p>
                {faculty.length} faculty members
                registered
              </p>
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

                <option>
                  All Departments
                </option>

                <option>
                  Computer Science
                </option>

                <option>
                  Information Technology
                </option>

                <option>
                  Management
                </option>

                <option>
                  Computer Applications
                </option>

              </select>

            </div>

          </div>

          {/* =====================================================
              FACULTY TABLE
          ===================================================== */}

          <div className="faculty-table-wrapper">

            <table className="faculty-table">

              <thead>

                <tr>

                  <th>
                    FACULTY
                  </th>

                  <th>
                    EMAIL
                  </th>

                  <th>
                    MOBILE
                  </th>

                  <th>
                    SUBJECT
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    ACTION
                  </th>

                </tr>

              </thead>

              <tbody>

                {faculty.length > 0 ? (

                  faculty.map((f) => (

                    <tr
                      key={f.id}
                      className={
                        editId === f.id
                          ? "editing-row"
                          : ""
                      }
                    >

                      {/* =================================================
                          FACULTY NAME
                      ================================================= */}

                      <td>

                        <div className="faculty-info">

                          <div
                            className="student-avatar"
                            style={{
                              background:
                                f.color ||
                                "#6c63ff",
                            }}
                          >
                            {f.faculty_name
                              ? f.faculty_name
                                  .charAt(0)
                                  .toUpperCase()
                              : "?"}
                          </div>

                          <div>

                            {editId === f.id ? (

                              <input
                                type="text"
                                name="faculty_name"
                                className="edit-input"
                                placeholder="Faculty name"
                                value={
                                  editFaculty.faculty_name
                                }
                                onChange={
                                  handleEditChange
                                }
                              />

                            ) : (

                              <strong>
                                {f.faculty_name ||
                                  "Unknown Faculty"}
                              </strong>

                            )}

                          </div>

                        </div>

                      </td>

                      {/* =================================================
                          EMAIL
                      ================================================= */}

                      <td>

                        {editId === f.id ? (

                          <input
                            type="email"
                            name="email"
                            className="edit-input"
                            placeholder="Email"
                            value={
                              editFaculty.email
                            }
                            onChange={
                              handleEditChange
                            }
                          />

                        ) : (

                          <span>
                            {f.email ||
                              "No email"}
                          </span>

                        )}

                      </td>

                      {/* =================================================
                          MOBILE
                      ================================================= */}

                      <td>

                        {editId === f.id ? (

                          <input
                            type="text"
                            name="mobile_no"
                            className="edit-input"
                            placeholder="Mobile number"
                            value={
                              editFaculty.mobile_no
                            }
                            onChange={
                              handleEditChange
                            }
                          />

                        ) : (

                          <span>
                            {f.mobile_no ||
                              "No mobile"}
                          </span>

                        )}

                      </td>

                      {/* =================================================
                          SUBJECT
                      ================================================= */}

                      <td>

                        {editId === f.id ? (

                          <input
                            type="text"
                            name="subject"
                            className="edit-input"
                            placeholder="Subject"
                            value={
                              editFaculty.subject
                            }
                            onChange={
                              handleEditChange
                            }
                          />

                        ) : (

                          <span className="course-badge">
                            {f.subject ||
                              "N/A"}
                          </span>

                        )}

                      </td>

                      {/* =================================================
                          STATUS
                      ================================================= */}

                      <td>

                        {editId === f.id ? (

                          <select
                            name="is_active"
                            className="edit-input"
                            value={
                              editFaculty.is_active
                                ? "active"
                                : "inactive"
                            }
                            onChange={(e) =>
                              setEditFaculty(
                                (prev) => ({
                                  ...prev,
                                  is_active:
                                    e.target.value ===
                                    "active",
                                })
                              )
                            }
                          >

                            <option value="active">
                              Active
                            </option>

                            <option value="inactive">
                              Inactive
                            </option>

                          </select>

                        ) : (

                          <span
                            className={`status ${
                              f.is_active === true ||
                              f.is_active === 1
                                ? "active"
                                : "inactive"
                            }`}
                          >

                            <i></i>

                            {f.is_active === true ||
                            f.is_active === 1
                              ? "Active"
                              : "Inactive"}

                          </span>

                        )}

                      </td>

                      {/* =================================================
                          ACTIONS
                      ================================================= */}

                      <td>

                        <div className="action-buttons">

                          {editId === f.id ? (

                            <>

                              {/* SAVE */}

                              <button
                                className="icon-btn save"
                                title="Save"
                                onClick={() =>
                                  saveEdit(f.id)
                                }
                              >
                                ✓
                              </button>

                              {/* CANCEL */}

                              <button
                                className="icon-btn cancel"
                                title="Cancel"
                                onClick={
                                  cancelEdit
                                }
                              >
                                ✕
                              </button>

                            </>

                          ) : (

                            <>

                              {/* EDIT */}

                              <button
                                className="icon-btn edit"
                                title="Edit"
                                onClick={() =>
                                  startEdit(f)
                                }
                              >
                                ✎
                              </button>

                              {/* DELETE */}

                              <button
                                className="icon-btn delete"
                                title="Delete"
                                onClick={() =>
                                  deleteFaculty(
                                    f.id
                                  )
                                }
                              >
                                🗑
                              </button>

                            </>

                          )}

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