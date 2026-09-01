import "./ScheduleManagement.css";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import { useState, useEffect } from "react";
import FacultySider from "./FacultySider";

export default function ScheduleManagement() {
  const [schedule, setSchedule] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [editId, setEditId] = useState(null);

  const [editSchedule, setEditSchedule] = useState({
    faculty_id: "",
    subject_id: "",
    date: "",
    start_time: "",
    end_time: "",
    duration: "",
    passing_marks: "",
    total_marks: "",
    is_active: true,
  });

  // =====================================================
  // LOAD DATABASE DATA
  // =====================================================

  const loadData = async () => {
    try {
      const [examRes, facultyRes, subjectRes] = await Promise.all([
        axios.get("http://localhost:5000/tbl_exam"),
        axios.get("http://localhost:5000/tbl_faculty"),
        axios.get("http://localhost:5000/tbl_subject"),
      ]);

      setSchedule(examRes.data);
      setFacultyList(facultyRes.data);
      setSubjectList(subjectRes.data);
    } catch (error) {
      console.error("Error loading exam data:", error);
      alert("Failed to load schedule data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =====================================================
  // GET FACULTY NAME
  // =====================================================

  const getFacultyName = (facultyId) => {
    const faculty = facultyList.find(
      (f) => Number(f.faculty_id) === Number(facultyId),
    );

    return faculty ? faculty.faculty_name : "Unknown Faculty";
  };

  // =====================================================
  // GET SUBJECT NAME
  // =====================================================

  const getSubjectName = (subjectId) => {
    const subject = subjectList.find(
      (s) => Number(s.subject_id) === Number(subjectId),
    );

    return subject ? subject.subject_name : "Unknown Subject";
  };

  // =====================================================
  // START EDIT
  // =====================================================

  const startEdit = (exam) => {
    setEditId(exam.id);

    setEditSchedule({
      faculty_id: exam.faculty_id || "",
      subject_id: exam.subject_id || "",
      date: exam.date || "",
      start_time: exam.start_time || "",
      end_time: exam.end_time || "",
      duration: exam.duration || "",
      passing_marks: exam.passing_marks || "",
      total_marks: exam.total_marks || "",
      is_active: exam.is_active ?? true,
    });
  };

  // =====================================================
  // HANDLE EDIT INPUT
  // =====================================================

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditSchedule((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // SAVE EDIT
  // =====================================================

  const saveEdit = async (id) => {
    try {
      if (!editSchedule.faculty_id) {
        alert("Please select faculty.");
        return;
      }

      if (!editSchedule.subject_id) {
        alert("Please select subject.");
        return;
      }

      if (!editSchedule.date) {
        alert("Date is required.");
        return;
      }

      if (!editSchedule.start_time) {
        alert("Start time is required.");
        return;
      }

      if (!editSchedule.end_time) {
        alert("End time is required.");
        return;
      }

      if (editSchedule.start_time >= editSchedule.end_time) {
        alert("End time must be after start time.");
        return;
      }

      if (!editSchedule.duration) {
        alert("Duration is required.");
        return;
      }

      if (!editSchedule.passing_marks) {
        alert("Passing marks are required.");
        return;
      }

      if (!editSchedule.total_marks) {
        alert("Total marks are required.");
        return;
      }

      if (
        Number(editSchedule.passing_marks) > Number(editSchedule.total_marks)
      ) {
        alert("Passing marks cannot be greater than total marks.");
        return;
      }

      const existingExam = schedule.find((exam) => exam.id === id);

      if (!existingExam) {
        alert("Exam schedule not found.");
        return;
      }

      const updatedExam = {
        ...existingExam,

        faculty_id: Number(editSchedule.faculty_id),

        subject_id: Number(editSchedule.subject_id),

        date: editSchedule.date,

        start_time: editSchedule.start_time,

        end_time: editSchedule.end_time,

        duration: Number(editSchedule.duration),

        passing_marks: Number(editSchedule.passing_marks),

        total_marks: Number(editSchedule.total_marks),

        is_active: editSchedule.is_active,
      };

      // =================================================
      // UPDATE tbl_exam
      // =================================================

      await axios.put(`http://localhost:5000/tbl_exam/${id}`, updatedExam);

      setEditId(null);

      setEditSchedule({
        faculty_id: "",
        subject_id: "",
        date: "",
        start_time: "",
        end_time: "",
        duration: "",
        passing_marks: "",
        total_marks: "",
        is_active: true,
      });

      await loadData();

      alert("Exam schedule updated successfully!");
    } catch (error) {
      console.error("Error updating exam:", error);
      alert("Failed to update exam schedule.");
    }
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEdit = () => {
    setEditId(null);

    setEditSchedule({
      faculty_id: "",
      subject_id: "",
      date: "",
      start_time: "",
      end_time: "",
      duration: "",
      passing_marks: "",
      total_marks: "",
      is_active: true,
    });
  };

  // =====================================================
  // DELETE EXAM
  // =====================================================

  const deleteSchedule = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this exam schedule?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/tbl_exam/${id}`);

      await loadData();

      alert("Exam schedule deleted successfully!");
    } catch (error) {
      console.error("Error deleting exam:", error);
      alert("Failed to delete exam schedule.");
    }
  };

  // =====================================================
  // SCHEDULE STATS
  // =====================================================

  const totalSchedule = schedule.length;

  const activeCount = schedule.filter((exam) => exam.is_active === true).length;

  const inactiveCount = schedule.filter(
    (exam) => exam.is_active === false,
  ).length;

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredSchedules = schedule.filter((exam) => {
    const facultyName = getFacultyName(exam.faculty_id);
    const subjectName = getSubjectName(exam.subject_id);

    const searchText = search.toLowerCase();

    const matchesSearch =
      facultyName.toLowerCase().includes(searchText) ||
      subjectName.toLowerCase().includes(searchText) ||
      (exam.date || "").toLowerCase().includes(searchText) ||
      (exam.start_time || "").toLowerCase().includes(searchText) ||
      (exam.end_time || "").toLowerCase().includes(searchText);

    const examStatus = exam.is_active ? "Active" : "Inactive";

    const matchesStatus =
      statusFilter === "All Status" || examStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const newDate = new Date(date);

    return newDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      <FacultySider />

      <Header />

      <main className="manage-schedule">
        {/* PAGE TOP */}

        <div className="page-top">
          <div>
            <h1>Manage Exam Schedule</h1>

            <p>View, manage and monitor all examination schedules.</p>
          </div>

          <button
            className="add-schedule-btn"
            onClick={() => {
              window.location.href = "/AddSchedule";
            }}
          >
            <span>+</span>
            Add Exam
          </button>
        </div>

        {/* STATS */}

        <div className="schedule-stats">
          <div className="stat-card purple">
            <div className="stat-icon">📅</div>

            <div>
              <span>Total Exams</span>
              <strong>{totalSchedule}</strong>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">✓</div>

            <div>
              <span>Active</span>
              <strong>{activeCount}</strong>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">⏱</div>

            <div>
              <span>Duration</span>
              <strong>
                {schedule.reduce(
                  (total, exam) => total + Number(exam.duration || 0),
                  0,
                )}
                h
              </strong>
            </div>
          </div>

          <div className="stat-card blue">
            <div className="stat-icon">⚠</div>

            <div>
              <span>Inactive</span>
              <strong>{inactiveCount}</strong>
            </div>
          </div>
        </div>

        {/* TABLE CARD */}

        <section className="schedule-card">
          {/* TOOLBAR */}

          <div className="table-toolbar">
            <div>
              <h2>All Exam Schedules</h2>

              <p>{filteredSchedules.length} exams found</p>
            </div>

            <div className="toolbar-actions">
              {/* SEARCH */}

              <div className="search-box">
                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search exam..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* STATUS */}

              <select
                className="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All Status">All Status</option>

                <option value="Active">Active</option>

                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* TABLE */}

          <div className="schedule-table-wrapper">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>FACULTY</th>
                  <th>SUBJECT</th>
                  <th>DATE</th>
                  <th>TIME</th>
                  <th>DURATION</th>
                  <th>MARKS</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((exam) => (
                    <tr
                      key={exam.id}
                      className={editId === exam.id ? "editing-row" : ""}
                    >
                      {/* FACULTY */}

                      <td>
                        {editId === exam.id ? (
                          <select
                            name="faculty_id"
                            className="edit-input"
                            value={editSchedule.faculty_id}
                            onChange={handleEditChange}
                          >
                            <option value="">Select Faculty</option>

                            {facultyList.map((faculty) => (
                              <option
                                key={faculty.faculty_id}
                                value={faculty.faculty_id}
                              >
                                {faculty.faculty_name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="faculty-info">
                            <div className="faculty-avatar">
                              {getFacultyName(exam.faculty_id)
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <strong>{getFacultyName(exam.faculty_id)}</strong>
                          </div>
                        )}
                      </td>

                      {/* SUBJECT */}

                      <td>
                        {editId === exam.id ? (
                          <select
                            name="subject_id"
                            className="edit-input"
                            value={editSchedule.subject_id}
                            onChange={handleEditChange}
                          >
                            <option value="">Select Subject</option>

                            {subjectList.map((subject) => (
                              <option
                                key={subject.subject_id}
                                value={subject.subject_id}
                              >
                                {subject.subject_name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span>{getSubjectName(exam.subject_id)}</span>
                        )}
                      </td>

                      {/* DATE */}

                      <td>
                        {editId === exam.id ? (
                          <input
                            type="date"
                            name="date"
                            className="edit-input"
                            value={editSchedule.date}
                            onChange={handleEditChange}
                          />
                        ) : (
                          <span>{formatDate(exam.date)}</span>
                        )}
                      </td>

                      {/* TIME */}

                      <td>
                        {editId === exam.id ? (
                          <div className="time-edit">
                            <input
                              type="time"
                              name="start_time"
                              className="edit-input"
                              value={editSchedule.start_time}
                              onChange={handleEditChange}
                            />

                            <span>-</span>

                            <input
                              type="time"
                              name="end_time"
                              className="edit-input"
                              value={editSchedule.end_time}
                              onChange={handleEditChange}
                            />
                          </div>
                        ) : (
                          <span className="time-text">
                            {exam.start_time || "--:--"}
                            {" - "}
                            {exam.end_time || "--:--"}
                          </span>
                        )}
                      </td>

                      {/* DURATION */}

                      <td>
                        {editId === exam.id ? (
                          <input
                            type="number"
                            name="duration"
                            className="edit-input"
                            min="1"
                            value={editSchedule.duration}
                            onChange={handleEditChange}
                          />
                        ) : (
                          <span>{exam.duration} hours</span>
                        )}
                      </td>

                      {/* MARKS */}

                      <td>
                        {editId === exam.id ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "5px",
                            }}
                          >
                            <input
                              type="number"
                              name="total_marks"
                              className="edit-input"
                              placeholder="Total"
                              value={editSchedule.total_marks}
                              onChange={handleEditChange}
                            />

                            <input
                              type="number"
                              name="passing_marks"
                              className="edit-input"
                              placeholder="Passing"
                              value={editSchedule.passing_marks}
                              onChange={handleEditChange}
                            />
                          </div>
                        ) : (
                          <span>
                            {exam.passing_marks} / {exam.total_marks}
                          </span>
                        )}
                      </td>

                      {/* STATUS */}

                      <td>
                        {editId === exam.id ? (
                          <select
                            name="is_active"
                            className="edit-input"
                            value={editSchedule.is_active ? "true" : "false"}
                            onChange={(e) =>
                              setEditSchedule((prev) => ({
                                ...prev,
                                is_active: e.target.value === "true",
                              }))
                            }
                          >
                            <option value="true">Active</option>

                            <option value="false">Inactive</option>
                          </select>
                        ) : (
                          <span
                            className={`status ${
                              exam.is_active ? "scheduled" : "cancelled"
                            }`}
                          >
                            <i></i>

                            {exam.is_active ? "Active" : "Inactive"}
                          </span>
                        )}
                      </td>

                      {/* ACTION */}

                      <td>
                        <div className="action-buttons">
                          {editId === exam.id ? (
                            <>
                              <button
                                className="icon-btn save"
                                title="Save"
                                onClick={() => saveEdit(exam.id)}
                              >
                                ✓
                              </button>

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
                              <button
                                className="icon-btn edit"
                                title="Edit"
                                onClick={() => startEdit(exam)}
                              >
                                ✎
                              </button>

                              <button
                                className="icon-btn delete"
                                title="Delete"
                                onClick={() => deleteSchedule(exam.id)}
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
                    <td colSpan="8">
                      <div className="no-schedules">
                        No exam schedules found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
