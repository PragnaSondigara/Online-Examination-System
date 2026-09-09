import { useNavigate } from "react-router-dom";
import "./AddStudent.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import FacultySider from "./FacultySider";

export function AddSchedule() {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [facultyId, setFacultyId] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [duration, setDuration] = useState("");

  const [passingMarks, setPassingMarks] = useState("");
  const [totalMarks, setTotalMarks] = useState("");

  const [isActive, setIsActive] = useState(true);

  const [subjectList, setSubjectList] = useState([]);

  // =========================================================
  // LOAD LOGGED-IN FACULTY AND THEIR SUBJECTS
  // =========================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        const loggedInFacultyId = localStorage.getItem("facultyId");
        const loggedInFacultyName = localStorage.getItem("username");

        console.log("Logged-in Faculty ID:", loggedInFacultyId);
        console.log("Logged-in Faculty Name:", loggedInFacultyName);

        // Check faculty login information
        if (!loggedInFacultyId || !loggedInFacultyName) {
          alert("Faculty login information not found.");
          navigate("/FacultyLogin");
          return;
        }

        setFacultyId(loggedInFacultyId);
        setFacultyName(loggedInFacultyName);

        // Get all subjects
        const subjectRes = await axios.get("http://localhost:5000/tbl_subject");

        // Only show active subjects assigned to logged-in faculty
        const assignedSubjects = subjectRes.data.filter(
          (subject) =>
            subject.is_active === true &&
            String(subject.faculty_id) === String(loggedInFacultyId),
        );

        console.log("Assigned Subjects:", assignedSubjects);

        setSubjectList(assignedSubjects);

        // If faculty has only one subject, automatically select it
        if (assignedSubjects.length === 1) {
          setSubjectId(String(assignedSubjects[0].id));
        }
      } catch (error) {
        console.error("Error loading subject data:", error);
        alert("Unable to load subject data.");
      }
    };

    loadData();
  }, [navigate]);

  // =========================================================
  // CALCULATE DURATION FROM START TIME AND END TIME
  // =========================================================

  useEffect(() => {
    if (!startTime || !endTime) {
      setDuration("");
      return;
    }

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    // Invalid time
    if (endTotalMinutes <= startTotalMinutes) {
      setDuration("");
      return;
    }

    const differenceInMinutes = endTotalMinutes - startTotalMinutes;

    // Convert minutes to hours
    const durationInHours = differenceInMinutes / 60;

    setDuration(durationInHours);
  }, [startTime, endTime]);

  // =========================================================
  // ADD EXAM SCHEDULE
  // =========================================================

  const addSchedule = async (e) => {
    e.preventDefault();

    // ---------------------------------------------------------
    // FACULTY VALIDATION
    // ---------------------------------------------------------

    if (!facultyId) {
      alert("Faculty information is missing.");
      return;
    }

    // ---------------------------------------------------------
    // SUBJECT VALIDATION
    // ---------------------------------------------------------

    if (!subjectId) {
      alert("Please select subject.");
      return;
    }

    // IMPORTANT:
    // Subject ID is stored in JSON Server's "id" field.
    const selectedSubject = subjectList.find(
      (subject) => String(subject.id) === String(subjectId),
    );

    if (!selectedSubject) {
      alert("Invalid subject selected.");
      return;
    }

    // Check that selected subject belongs to logged-in faculty
    if (String(selectedSubject.faculty_id) !== String(facultyId)) {
      alert("You can only create an exam for your assigned subject.");
      return;
    }

    // ---------------------------------------------------------
    // DATE VALIDATION
    // ---------------------------------------------------------

    if (!date) {
      alert("Please select exam date.");
      return;
    }

    if (date < today) {
      alert("You cannot select a previous date.");
      return;
    }

    // ---------------------------------------------------------
    // TIME VALIDATION
    // ---------------------------------------------------------

    if (!startTime) {
      alert("Please select start time.");
      return;
    }

    if (!endTime) {
      alert("Please select end time.");
      return;
    }

    if (startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }

    // ---------------------------------------------------------
    // DURATION VALIDATION
    // ---------------------------------------------------------

    if (!duration || Number(duration) <= 0) {
      alert("Invalid exam duration.");
      return;
    }

    // ---------------------------------------------------------
    // MARKS VALIDATION
    // ---------------------------------------------------------

    if (!totalMarks || Number(totalMarks) <= 0) {
      alert("Please enter valid total marks.");
      return;
    }

    if (!passingMarks || Number(passingMarks) < 0) {
      alert("Please enter valid passing marks.");
      return;
    }

    if (Number(passingMarks) > Number(totalMarks)) {
      alert("Passing marks cannot be greater than total marks.");
      return;
    }

    // ---------------------------------------------------------
    // CONFIRMATION
    // ---------------------------------------------------------

    if (!window.confirm("Do you want to add this exam schedule?")) {
      return;
    }

    try {
      // -------------------------------------------------------
      // CHECK EXISTING EXAMS
      // -------------------------------------------------------

      const existingExams = await axios.get("http://localhost:5000/tbl_exam");

      // Check duplicate exam
      const duplicateExam = existingExams.data.find(
        (exam) =>
          String(exam.faculty_id) === String(facultyId) &&
          String(exam.subject_id) === String(subjectId) &&
          exam.date === date &&
          exam.start_time === startTime,
      );

      if (duplicateExam) {
        alert(
          "An exam with the same faculty, subject, date and start time already exists.",
        );
        return;
      }

      // -------------------------------------------------------
      // CREATE NEW EXAM OBJECT
      // -------------------------------------------------------

      const newExam = {
        faculty_id: facultyId,
        subject_id: subjectId,

        duration: Number(duration),

        date: date,

        start_time: startTime,
        end_time: endTime,

        passing_marks: Number(passingMarks),
        total_marks: Number(totalMarks),

        is_active: isActive,
      };

      console.log("New Exam:", newExam);

      // -------------------------------------------------------
      // INSERT EXAM
      // -------------------------------------------------------

      await axios.post("http://localhost:5000/tbl_exam", newExam);

      // -------------------------------------------------------
      // SUCCESS
      // -------------------------------------------------------

      alert("Exam schedule added successfully!");

      // Reset form
      setSubjectId("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setDuration("");
      setPassingMarks("");
      setTotalMarks("");
      setIsActive(true);

      // Go to schedule management
      navigate("/ScheduleManagement");
    } catch (error) {
      console.error("Error adding exam schedule:", error);

      alert(
        "Unable to add exam schedule. Make sure the JSON server is running.",
      );
    }
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <>
      <Header />

      <FacultySider />

      <div className="student-form-overlay">
        <div className="student-form-modal">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="student-form-header">
            <div>
              <h2>Add Exam Schedule</h2>

              <p>Enter examination schedule details below</p>
            </div>

            <button
              type="button"
              className="student-form-close"
              onClick={() => navigate("/ScheduleManagement")}
            >
              ×
            </button>
          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form className="student-form" onSubmit={addSchedule}>
            {/* =================================================
                FACULTY
            ================================================= */}

            <div className="form-group">
              <label>Faculty</label>

              <input
                type="text"
                value={facultyName}
                readOnly
                placeholder="Faculty name"
              />
            </div>

            {/* =================================================
                SUBJECT
            ================================================= */}

            <div className="form-group">
              <label>Subject</label>

              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
              >
                <option value="">Select Subject</option>

                {subjectList.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject_name}
                  </option>
                ))}
              </select>
            </div>

            {/* =================================================
                EXAM DATE
            ================================================= */}

            <div className="form-group">
              <label>Exam Date</label>

              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* =================================================
                START TIME
            ================================================= */}

            <div className="form-group">
              <label>Start Time</label>

              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            {/* =================================================
                END TIME
            ================================================= */}

            <div className="form-group">
              <label>End Time</label>

              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            {/* =================================================
                DURATION
            ================================================= */}

            <div className="form-group">
              <label>Duration (Hours)</label>

              <input
                type="number"
                value={duration}
                readOnly
                placeholder="Automatically calculated"
              />
            </div>

            {/* =================================================
                TOTAL MARKS
            ================================================= */}

            <div className="form-group">
              <label>Total Marks</label>

              <input
                type="number"
                min="1"
                placeholder="Enter total marks"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
              />
            </div>

            {/* =================================================
                PASSING MARKS
            ================================================= */}

            <div className="form-group">
              <label>Passing Marks</label>

              <input
                type="number"
                min="0"
                placeholder="Enter passing marks"
                value={passingMarks}
                onChange={(e) => setPassingMarks(e.target.value)}
              />
            </div>

            {/* =================================================
                STATUS
            ================================================= */}

            <div className="form-group">
              <label>Status</label>

              <select
                value={isActive ? "true" : "false"}
                onChange={(e) => setIsActive(e.target.value === "true")}
              >
                <option value="true">Active</option>

                <option value="false">Inactive</option>
              </select>
            </div>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="student-form-buttons">
              <button
                type="button"
                className="student-cancel-btn"
                onClick={() => navigate("/ScheduleManagement")}
              >
                Cancel
              </button>

              <button type="submit" className="student-submit-btn">
                Add Exam
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
