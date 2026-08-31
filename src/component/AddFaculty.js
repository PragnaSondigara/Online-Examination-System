import { useNavigate } from "react-router-dom";
import "./AddFaculty.css";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { useState } from "react";
import axios from "axios";

export function AddFaculty() {
  const navigate = useNavigate();

  const [fname, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [mno, setMno] = useState("");
  const [subject, setSubject] = useState("");
  const [password, setPassword] = useState("");
  function handleNameChange(e) {
        const value = e.target.value;
        setFname(value);

        const cleanName = value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ".");

        if (cleanName) {
            setEmail(cleanName + "@examhub.com");
            setPassword(value.replace(/\s+/g, "") + "@123");
        } else {
            setEmail("");
            setPassword("");
        }
    }

  // Add faculty
  const addFaculty = async (e) => {
    e.preventDefault();

    if (
      !fname.trim() ||
      !email.trim() ||
      !mno.trim() ||
      !subject.trim() ||
      !password.trim()
    ) {
      return;
    }

    if (!window.confirm("Do you want to add this faculty?")) {
      return;
    }

    try {
      await axios.post("http://localhost:5000/tbl_faculty", {
        faculty_name: fname,
        email: email,
        mobile_no: mno,
        subject: subject,
        password: password,
        is_active: true,
      });

      alert("Faculty added successfully!");

      setFname("");
      setEmail("");
      setMno("");
      setSubject("");
      setPassword("");

      navigate("/ManageFaculty");
    } catch (error) {
      console.error("Error adding faculty:", error);
      alert("Unable to add faculty. Make sure the JSON server is running.");
    }
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
              <h2>Add Faculty</h2>
              <p>Enter faculty details below</p>
            </div>

            <button
              className="student-form-close"
              onClick={() => navigate("/ManageFaculty")}
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form className="student-form" onSubmit={addFaculty}>
            {/* Faculty Name */}
            <div className="form-group">
              <label>Faculty Name</label>

              <input
                type="text"
                placeholder="Enter faculty name"
                value={fname}
                onChange={handleNameChange}
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter email address"
                value={email} readOnly
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

            {/* Subject */}
            <div className="form-group">
              <label>Subject</label>

              <input
                type="text"
                placeholder="Enter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter password"
                value={password} readOnly
              />
            </div>

            {/* Buttons */}
            <div className="student-form-buttons">
              <button
                type="button"
                className="student-cancel-btn"
                onClick={() => navigate("/ManageFaculty")}
              >
                Cancel
              </button>

              <button type="submit" className="student-submit-btn">
                Add Faculty
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
