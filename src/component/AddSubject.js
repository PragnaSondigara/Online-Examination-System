import "./AddStudent.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddSubject() {
  const navigate = useNavigate();

  // =====================================================
  // FORM STATE
  // =====================================================

  const [subject, setSubject] = useState({
    subject_name: "",
    faculty_id: "",
    is_active: true,
  });

  // =====================================================
  // FACULTY DATA
  // =====================================================

  const [faculty, setFaculty] = useState([]);

  // =====================================================
  // LOADING STATE
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOAD FACULTY
  // =====================================================

  const loadFaculty = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tbl_faculty");

      setFaculty(res.data);
    } catch (error) {
      console.error("Error loading faculty:", error);

      alert("Failed to load faculty.");
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadFaculty();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSubject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // HANDLE STATUS
  // =====================================================

  const handleStatusChange = (e) => {
    setSubject((prev) => ({
      ...prev,
      is_active: e.target.value === "true",
    }));
  };

  // =====================================================
  // ADD SUBJECT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===================================================
    // VALIDATION
    // ===================================================

    if (!subject.subject_name.trim()) {
      alert("Subject name is required.");
      return;
    }

    if (!subject.faculty_id) {
      alert("Please select a faculty.");
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // CREATE SUBJECT OBJECT
      // =================================================

      const newSubject = {
        subject_id: Date.now(),
        faculty_id: subject.faculty_id,
        subject_name: subject.subject_name.trim(),
        is_active: subject.is_active,
      };

      // =================================================
      // SAVE TO JSON SERVER
      // =================================================

      await axios.post(
        "http://localhost:5000/tbl_subject",
        newSubject,
      );

      alert("Subject added successfully!");

      // =================================================
      // GO BACK TO MANAGE SUBJECT
      // =================================================

      navigate("/ManageSubject");
    } catch (error) {
      console.error("Error adding subject:", error);

      alert("Failed to add subject.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    navigate("/ManageSubject");
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="student-form-overlay">
      <div className="student-form-modal">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="student-form-header">
          <div>
            <h2>Add Subject</h2>

            <p>
              Add a new subject to the examination system.
            </p>
          </div>

          <button
            type="button"
            className="student-form-close"
            onClick={handleCancel}
            title="Close"
          >
            ×
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          className="student-form"
          onSubmit={handleSubmit}
        >

          {/* =================================================
              SUBJECT NAME
          ================================================= */}

          <div className="form-group">
            <label htmlFor="subject_name">
              Subject Name
            </label>

            <input
              id="subject_name"
              type="text"
              name="subject_name"
              placeholder="Enter subject name"
              value={subject.subject_name}
              onChange={handleChange}
              autoFocus
            />
          </div>

          {/* =================================================
              FACULTY
          ================================================= */}

          <div className="form-group">
            <label htmlFor="faculty_id">
              Faculty
            </label>

            <select
              id="faculty_id"
              name="faculty_id"
              value={subject.faculty_id}
              onChange={handleChange}
            >
              <option value="">
                Select Faculty
              </option>

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

          {/* =================================================
              STATUS
          ================================================= */}

          <div className="form-group">
            <label htmlFor="is_active">
              Status
            </label>

            <select
              id="is_active"
              name="is_active"
              value={subject.is_active ? "true" : "false"}
              onChange={handleStatusChange}
            >
              <option value="true">
                Active
              </option>

              <option value="false">
                Inactive
              </option>
            </select>
          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="student-form-buttons">

            {/* CANCEL */}

            <button
              type="button"
              className="student-cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>

            {/* ADD */}

            <button
              type="submit"
              className="student-submit-btn"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Subject"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}