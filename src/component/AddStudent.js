import { useNavigate } from "react-router-dom";
import "./AddStudent.css";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { useState } from "react";
import axios from "axios";

export function AddStudent() {
  const navigate = useNavigate();

  const [sname, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mno, setMno] = useState("");
  const [sem, setSem] = useState("");

  // Add student
  const addStudent = async (e) => {
    e.preventDefault();

    if (!sname.trim() || !email.trim() || !mno.trim() || !sem) {
      return;
    }

    if (!window.confirm("Do you want to add this student?")) {
      return;
    }

    await axios.post("http://localhost:5000/tbl_student", {
      student_name: sname,
      email: email,
      mobile_no: mno,
      semester: Number(sem),
    });

    alert("Student added successfully!");

    setName("");
    setEmail("");
    setMno("");
    setSem("");

    navigate("/ManageStudent");
  };

  return (
    <>
      <AdminSidebar />
      <AdminHeader />

      <div className="student-form-overlay">
        <div className="student-form-modal">
          {/* Header */}
          <div className="student-form-header">
            <div>
              <h2>Add Student</h2>
              <p>Enter student details below</p>
            </div>

            <button
              className="student-form-close"
              onClick={() => navigate("/ManageStudent")}
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form className="student-form" onSubmit={addStudent}>
            {/* Student Name */}
            <div className="form-group">
              <label>Student Name</label>

              <input
                type="text"
                placeholder="Enter student name"
                value={sname}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Mobile */}
            <div className="form-group">
              <label>Mobile Number</label>

              <input
                type="text"
                placeholder="Enter mobile number"
                value={mno}
                onChange={(e) => setMno(e.target.value)}
              />
            </div>

            {/* Semester */}
            <div className="form-group">
              <label>Semester</label>

              <select value={sem} onChange={(e) => setSem(e.target.value)}>
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="student-form-buttons">
              <button
                type="button"
                className="student-cancel-btn"
                onClick={() => navigate("/ManageStudent")}
              >
                Cancel
              </button>

              <button type="submit" className="student-submit-btn">
                Add Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
