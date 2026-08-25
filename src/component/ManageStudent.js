import "./ManageStudent.css";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import AdminHeader from "./AdminHeader";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageStudent() {
  const [student, setStudent] = useState([]);

  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("All Semesters");

  // Edit states
  const [editId, setEditId] = useState(null);

  const [editStudent, setEditStudent] = useState({
    student_name: "",
    email: "",
    mobile_no: "",
    semester: "",
    is_active: true,
  });

  const navigate = useNavigate();

  // =====================================================
  // LOAD STUDENT DATA
  // =====================================================

  const loaddata = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/tbl_student"
      );

      setStudent(res.data);
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  useEffect(() => {
    loaddata();
  }, []);

  // =====================================================
  // START EDIT
  // =====================================================

  const startEdit = (studentData) => {
    setEditId(studentData.id);

    setEditStudent({
      student_name: studentData.student_name || "",
      email: studentData.email || "",
      mobile_no: studentData.mobile_no || "",
      semester: studentData.semester || "",
      is_active:
        studentData.is_active === true ||
        studentData.is_active === 1,
    });
  };

  // =====================================================
  // HANDLE EDIT INPUT
  // =====================================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SAVE EDIT
  // =====================================================

  const saveEdit = async (id) => {
    try {
      if (!editStudent.student_name.trim()) {
        alert("Student name is required.");
        return;
      }

      if (!editStudent.email.trim()) {
        alert("Email is required.");
        return;
      }

      if (!editStudent.mobile_no.trim()) {
        alert("Mobile number is required.");
        return;
      }

      if (!editStudent.semester) {
        alert("Please select a semester.");
        return;
      }

      // Find existing student
      const existingStudent = student.find(
        (s) => s.id === id
      );

      if (!existingStudent) {
        alert("Student not found.");
        return;
      }

      // Keep existing fields and update edited fields
      const updatedStudent = {
        ...existingStudent,

        student_name: editStudent.student_name.trim(),

        email: editStudent.email.trim(),

        mobile_no: editStudent.mobile_no.trim(),

        semester: editStudent.semester,

        is_active: editStudent.is_active,
      };

      // Update JSON Server
      await axios.put(
        `http://localhost:5000/tbl_student/${id}`,
        updatedStudent
      );

      // Exit edit mode
      setEditId(null);

      // Reset edit form
      setEditStudent({
        student_name: "",
        email: "",
        mobile_no: "",
        semester: "",
        is_active: true,
      });

      // Reload students
      await loaddata();

      alert("Student updated successfully!");
    } catch (error) {
      console.error("Error updating student:", error);

      alert("Failed to update student.");
    }
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEdit = () => {
    setEditId(null);

    setEditStudent({
      student_name: "",
      email: "",
      mobile_no: "",
      semester: "",
      is_active: true,
    });
  };

  // =====================================================
  // DELETE STUDENT
  // =====================================================

  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/tbl_student/${id}`
      );

      await loaddata();

      alert("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);

      alert("Failed to delete student.");
    }
  };

  // =====================================================
  // ACTIVE STUDENT COUNT
  // =====================================================

  const activeStudent = student.filter(
    (s) =>
      s.is_active === true ||
      s.is_active === 1
  ).length;

  // =====================================================
  // SEMESTER COUNT
  // =====================================================

  const totalSemesters = new Set(
    student.map((s) => s.semester)
  ).size;

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredStudents = student.filter((s) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (s.student_name || "")
        .toLowerCase()
        .includes(searchText) ||

      (s.email || "")
        .toLowerCase()
        .includes(searchText) ||

      (s.mobile_no || "")
        .toLowerCase()
        .includes(searchText);

    const matchesSemester =
      semesterFilter === "All Semesters" ||
      String(s.semester) === String(semesterFilter);

    return matchesSearch && matchesSemester;
  });

  return (
    <>
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <AdminSidebar />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <AdminHeader />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="manage-student">

        {/* =====================================================
            PAGE TOP
        ===================================================== */}

        <div className="page-top">

          <div>
            <h1>Manage Student</h1>

            <p>
              View, manage and monitor all registered students.
            </p>
          </div>

          <button
            className="add-student-btn"
            onClick={() => navigate("/AddStudent")}
          >
            <span>+</span>

            Add Student
          </button>

        </div>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="student-stats">

          {/* TOTAL STUDENTS */}

          <div className="stat-card purple">

            <div className="stat-icon">
              👥
            </div>

            <div>
              <span>
                Total Students
              </span>

              <strong>
                {student.length}
              </strong>
            </div>

          </div>

          {/* ACTIVE STUDENTS */}

          <div className="stat-card green">

            <div className="stat-icon">
              ✓
            </div>

            <div>
              <span>
                Active Students
              </span>

              <strong>
                {activeStudent}
              </strong>
            </div>

          </div>

          {/* SEMESTERS */}

          <div className="stat-card orange">

            <div className="stat-icon">
              🎓
            </div>

            <div>
              <span>
                Semesters
              </span>

              <strong>
                {totalSemesters}
              </strong>
            </div>

          </div>

          {/* INACTIVE STUDENTS */}

          <div className="stat-card blue">

            <div className="stat-icon">
              ⚠
            </div>

            <div>
              <span>
                Inactive Students
              </span>

              <strong>
                {student.length - activeStudent}
              </strong>
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

              <h2>
                All Students
              </h2>

              <p>
                {filteredStudents.length} students found
              </p>

            </div>

            <div className="toolbar-actions">

              {/* SEARCH */}

              <div className="search-box">

                <span>
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search student..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              {/* SEMESTER FILTER */}

              <select
                className="course-filter"
                value={semesterFilter}
                onChange={(e) =>
                  setSemesterFilter(e.target.value)
                }
              >

                <option value="All Semesters">
                  All Semesters
                </option>

                <option value="1">
                  Semester 1
                </option>

                <option value="2">
                  Semester 2
                </option>

                <option value="3">
                  Semester 3
                </option>

                <option value="4">
                  Semester 4
                </option>

                <option value="5">
                  Semester 5
                </option>

                <option value="6">
                  Semester 6
                </option>

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

                  <th>
                    STUDENT
                  </th>

                  <th>
                    EMAIL
                  </th>

                  <th>
                    MOBILE
                  </th>

                  <th>
                    SEMESTER
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

                {filteredStudents.length > 0 ? (

                  filteredStudents.map((s) => (

                    <tr
                      key={s.id}
                      className={
                        editId === s.id
                          ? "editing-row"
                          : ""
                      }
                    >

                      {/* =====================================================
                          STUDENT
                      ===================================================== */}

                      <td>

                        <div className="student-info">

                          <div
                            className="student-avatar"
                            style={{
                              background:
                                s.color ||
                                "#6c63ff",
                            }}
                          >
                            {s.student_name
                              ? s.student_name
                                  .charAt(0)
                                  .toUpperCase()
                              : "?"}
                          </div>

                          <div className="student-name-wrapper">

                            {editId === s.id ? (

                              <input
                                type="text"
                                name="student_name"
                                className="edit-input student-name-input"
                                placeholder="Student name"
                                value={
                                  editStudent.student_name
                                }
                                onChange={
                                  handleEditChange
                                }
                              />

                            ) : (

                              <strong>
                                {s.student_name ||
                                  "Unknown Student"}
                              </strong>

                            )}

                          </div>

                        </div>

                      </td>

                      {/* =====================================================
                          EMAIL
                      ===================================================== */}

                      <td>

                        {editId === s.id ? (

                          <input
                            type="email"
                            name="email"
                            className="edit-input email-input"
                            placeholder="Enter email"
                            value={
                              editStudent.email
                            }
                            onChange={
                              handleEditChange
                            }
                          />

                        ) : (

                          <span>
                            {s.email ||
                              "No email"}
                          </span>

                        )}

                      </td>

                      {/* =====================================================
                          MOBILE
                      ===================================================== */}

                      <td>

                        {editId === s.id ? (

                          <input
                            type="text"
                            name="mobile_no"
                            className="edit-input mobile-input"
                            placeholder="Mobile number"
                            value={
                              editStudent.mobile_no
                            }
                            onChange={
                              handleEditChange
                            }
                          />

                        ) : (

                          <span>
                            {s.mobile_no ||
                              "No mobile"}
                          </span>

                        )}

                      </td>

                      {/* =====================================================
                          SEMESTER
                      ===================================================== */}

                      <td>

                        {editId === s.id ? (

                          <select
                            name="semester"
                            className="edit-input semester-input"
                            value={
                              editStudent.semester
                            }
                            onChange={
                              handleEditChange
                            }
                          >

                            <option value="">
                              Select
                            </option>

                            <option value="1">
                              Semester 1
                            </option>

                            <option value="2">
                              Semester 2
                            </option>

                            <option value="3">
                              Semester 3
                            </option>

                            <option value="4">
                              Semester 4
                            </option>

                            <option value="5">
                              Semester 5
                            </option>

                            <option value="6">
                              Semester 6
                            </option>

                          </select>

                        ) : (

                          <span className="course-badge">
                            Semester{" "}
                            {s.semester ||
                              "N/A"}
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
                              editStudent.is_active
                                ? "active"
                                : "inactive"
                            }
                            onChange={(e) =>
                              setEditStudent(
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
                              s.is_active === true ||
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
                                onClick={() =>
                                  saveEdit(s.id)
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
                                  startEdit(s)
                                }
                              >
                                ✎
                              </button>

                              {/* DELETE */}

                              <button
                                className="icon-btn delete"
                                title="Delete"
                                onClick={() =>
                                  deleteStudent(
                                    s.id
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

                      <div className="no-students">

                        No students found.

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

      <AdminFooter />

    </>
  );
}