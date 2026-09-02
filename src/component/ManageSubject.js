import AdminSidebar from "./AdminSidebar";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageSubject() {
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);

  const [search, setSearch] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("All Faculties");

  // Edit states
  const [editId, setEditId] = useState(null);

  const [editSubject, setEditSubject] = useState({
    subject_name: "",
    faculty_id: "",
    is_active: true,
  });

  const navigate = useNavigate();

  // =====================================================
  // LOAD SUBJECT DATA
  // =====================================================

  const loadSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tbl_subject");

      setSubjects(res.data);
    } catch (error) {
      console.error("Error loading subjects:", error);
    }
  };

  // =====================================================
  // LOAD FACULTY DATA
  // =====================================================

  const loadFaculty = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tbl_faculty");

      setFaculty(res.data);
    } catch (error) {
      console.error("Error loading faculty:", error);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadSubjects();
    loadFaculty();
  }, []);

  // =====================================================
  // GET FACULTY NAME
  // =====================================================

  const getFacultyName = (facultyId) => {
    const foundFaculty = faculty.find(
      (f) =>
        String(f.faculty_id) === String(facultyId) ||
        String(f.id) === String(facultyId),
    );

    if (!foundFaculty) {
      return `Faculty ${facultyId || "N/A"}`;
    }

    return (
      foundFaculty.faculty_name ||
      foundFaculty.name ||
      foundFaculty.faculty_username ||
      `Faculty ${facultyId}`
    );
  };

  // =====================================================
  // START EDIT
  // =====================================================

  const startEdit = (subjectData) => {
    setEditId(subjectData.id);

    setEditSubject({
      subject_name: subjectData.subject_name || "",
      faculty_id: subjectData.faculty_id || "",
      is_active: subjectData.is_active === true || subjectData.is_active === 1,
    });
  };

  // =====================================================
  // HANDLE EDIT INPUT
  // =====================================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditSubject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SAVE EDIT
  // =====================================================

  const saveEdit = async (id) => {
    try {
      if (!editSubject.subject_name.trim()) {
        alert("Subject name is required.");
        return;
      }

      if (!editSubject.faculty_id) {
        alert("Please select a faculty.");
        return;
      }

      const existingSubject = subjects.find((s) => s.id === id);

      if (!existingSubject) {
        alert("Subject not found.");
        return;
      }

      const updatedSubject = {
        ...existingSubject,
        subject_name: editSubject.subject_name.trim(),
        faculty_id: editSubject.faculty_id,
        is_active: editSubject.is_active,
      };

      await axios.put(
        `http://localhost:5000/tbl_subject/${id}`,
        updatedSubject,
      );

      setEditId(null);

      setEditSubject({
        subject_name: "",
        faculty_id: "",
        is_active: true,
      });

      await loadSubjects();

      alert("Subject updated successfully!");
    } catch (error) {
      console.error("Error updating subject:", error);

      alert("Failed to update subject.");
    }
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEdit = () => {
    setEditId(null);

    setEditSubject({
      subject_name: "",
      faculty_id: "",
      is_active: true,
    });
  };

  // =====================================================
  // DELETE SUBJECT
  // =====================================================

  const deleteSubject = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subject?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/tbl_subject/${id}`);

      await loadSubjects();

      alert("Subject deleted successfully!");
    } catch (error) {
      console.error("Error deleting subject:", error);

      alert("Failed to delete subject.");
    }
  };

  // =====================================================
  // ACTIVE SUBJECT COUNT
  // =====================================================

  const activeSubjects = subjects.filter(
    (s) => s.is_active === true || s.is_active === 1,
  ).length;

  // =====================================================
  // INACTIVE SUBJECT COUNT
  // =====================================================

  const inactiveSubjects = subjects.length - activeSubjects;

  // =====================================================
  // FACULTY COUNT
  // =====================================================

  const totalFaculties = new Set(subjects.map((s) => String(s.faculty_id)))
    .size;

  // =====================================================
  // SEARCH + FACULTY FILTER
  // =====================================================

  const filteredSubjects = subjects.filter((s) => {
    const searchText = search.toLowerCase();

    const facultyName = getFacultyName(s.faculty_id).toLowerCase();

    const matchesSearch =
      (s.subject_name || "").toLowerCase().includes(searchText) ||
      facultyName.includes(searchText);

    const matchesFaculty =
      facultyFilter === "All Faculties" ||
      String(s.faculty_id) === String(facultyFilter);

    return matchesSearch && matchesFaculty;
  });

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <>
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <AdminSidebar />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="manage-student">
        {/* =====================================================
            PAGE TOP
        ===================================================== */}

        <div className="page-top">
          <div>
            <h1>Manage Subject</h1>

            <p>View, manage and monitor all available subjects.</p>
          </div>

          <button
            className="add-student-btn"
            onClick={() => navigate("/AddSubject")}
          >
            <span>+</span>
            Add Subject
          </button>
        </div>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="student-stats">
          {/* TOTAL SUBJECTS */}

          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                background: "#f0efff",
                color: "#6860ee",
              }}
            >
              📚
            </div>

            <div>
              <span>Total Subjects</span>

              <strong>{subjects.length}</strong>
            </div>
          </div>

          {/* ACTIVE SUBJECTS */}

          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                background: "#e8faf3",
                color: "#20a879",
              }}
            >
              ✓
            </div>

            <div>
              <span>Active Subjects</span>

              <strong>{activeSubjects}</strong>
            </div>
          </div>

          {/* FACULTIES */}

          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                background: "#fff5e8",
                color: "#e99a38",
              }}
            >
              👨‍🏫
            </div>

            <div>
              <span>Faculties</span>

              <strong>{totalFaculties}</strong>
            </div>
          </div>

          {/* INACTIVE SUBJECTS */}

          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                background: "#eef6ff",
                color: "#4b8bd8",
              }}
            >
              ⚠
            </div>

            <div>
              <span>Inactive Subjects</span>

              <strong>{inactiveSubjects}</strong>
            </div>
          </div>
        </div>

        {/* =====================================================
            TABLE CARD
        ===================================================== */}

        <section className="student-card">
          {/* =====================================================
              TOOLBAR
          ===================================================== */}

          <div className="table-toolbar">
            <div>
              <h2>All Subjects</h2>

              <p>{filteredSubjects.length} subjects found</p>
            </div>

            <div className="toolbar-actions">
              {/* SEARCH */}

              <div className="search-box">
                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search subject..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* FACULTY FILTER */}

              <select
                className="course-filter"
                value={facultyFilter}
                onChange={(e) => setFacultyFilter(e.target.value)}
              >
                <option value="All Faculties">All Faculties</option>

                {faculty.map((f) => (
                  <option
                    key={f.id || f.faculty_id}
                    value={f.faculty_id || f.id}
                  >
                    {f.faculty_name ||
                      f.name ||
                      f.faculty_username ||
                      `Faculty ${f.faculty_id || f.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* =====================================================
              TABLE
          ===================================================== */}

          <div className="student-table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>SUBJECT</th>
                  <th>FACULTY</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map((s) => (
                    <tr
                      key={s.id}
                      className={editId === s.id ? "editing-row" : ""}
                    >
                      {/* =====================================================
                          SUBJECT
                      ===================================================== */}

                      <td>
                        <div className="student-info">
                          <div className="student-avatar">
                            {s.subject_name
                              ? s.subject_name.charAt(0).toUpperCase()
                              : "?"}
                          </div>

                          <div>
                            {editId === s.id ? (
                              <input
                                type="text"
                                name="subject_name"
                                className="edit-input student-name-input"
                                placeholder="Subject name"
                                value={editSubject.subject_name}
                                onChange={handleEditChange}
                              />
                            ) : (
                              <>
                                <strong>
                                  {s.subject_name || "Unknown Subject"}
                                </strong>

                                <span>Subject</span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* =====================================================
                          FACULTY
                      ===================================================== */}

                      <td>
                        {editId === s.id ? (
                          <select
                            name="faculty_id"
                            className="edit-input faculty-input"
                            value={editSubject.faculty_id}
                            onChange={handleEditChange}
                          >
                            <option value="">Select Faculty</option>

                            {faculty.map((f) => (
                              <option
                                key={f.id || f.faculty_id}
                                value={f.faculty_id || f.id}
                              >
                                {f.faculty_name ||
                                  f.name ||
                                  f.faculty_username ||
                                  `Faculty ${f.faculty_id || f.id}`}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="course-badge">
                            {getFacultyName(s.faculty_id)}
                          </span>
                        )}
                      </td>

                      {/* =====================================================
                          STATUS
                      ===================================================== */}

                      <td>
                        {editId === s.id ? (
                          <select
                            name="is_active"
                            className="edit-input status-input"
                            value={
                              editSubject.is_active ? "active" : "inactive"
                            }
                            onChange={(e) =>
                              setEditSubject((prev) => ({
                                ...prev,
                                is_active: e.target.value === "active",
                              }))
                            }
                          >
                            <option value="active">Active</option>

                            <option value="inactive">Inactive</option>
                          </select>
                        ) : (
                          <span
                            className={`status ${
                              s.is_active === true || s.is_active === 1
                                ? "active"
                                : "inactive"
                            }`}
                          >
                            <i></i>

                            {s.is_active === true || s.is_active === 1
                              ? "Active"
                              : "Inactive"}
                          </span>
                        )}
                      </td>

                      {/* =====================================================
                          ACTION
                      ===================================================== */}

                      <td>
                        <div className="action-buttons">
                          {editId === s.id ? (
                            <>
                              {/* SAVE */}

                              <button
                                className="icon-btn save"
                                title="Save"
                                onClick={() => saveEdit(s.id)}
                              >
                                ✓
                              </button>

                              {/* CANCEL */}

                              <button
                                className="icon-btn cancel"
                                title="Cancel"
                                onClick={cancelEdit}
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
                                onClick={() => startEdit(s)}
                              >
                                ✎
                              </button>

                              {/* DELETE */}

                              <button
                                className="icon-btn delete"
                                title="Delete"
                                onClick={() => deleteSubject(s.id)}
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
                    <td colSpan="4">
                      <div
                        style={{
                          padding: "35px",
                          textAlign: "center",
                          color: "#98a2b1",
                          fontSize: "13px",
                        }}
                      >
                        No subjects found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />
    </>
  );
}
