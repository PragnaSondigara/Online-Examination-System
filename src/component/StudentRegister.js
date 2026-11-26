
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentRegister.css";

function StudentRegister() {
  const navigate = useNavigate();

  const [sname, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mno, setMno] = useState("");
  const [sem, setSem] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Allow only 10 digits
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setMno(value.slice(0, 10));
  };

  // Student registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!sname.trim()) {
      alert("Please enter student name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter email address.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mno)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!sem) {
      alert("Please select semester.");
      return;
    }

    if (!password.trim()) {
      alert("Please enter password.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password and Confirm Password do not match.");
      return;
    }

    if (!window.confirm("Do you want to register as a student?")) {
      return;
    }

    setLoading(true);

    try {
      // Check whether email already exists
      const existingStudent = await axios.get(
        "http://localhost:5000/tbl_student",
        {
          params: { email: email.trim() }
        }
      );

      if (existingStudent.data.length > 0) {
        alert("This email is already registered.");
        return;
      }

      // Save student
      await axios.post("http://localhost:5000/tbl_student", {
        student_name: sname.trim(),
        email: email.trim(),
        mobile_no: mno,
        semester: Number(sem),
        password: password,
        is_active: true
      });

      alert("Student registration successful!");

      // Clear form
      setName("");
      setEmail("");
      setMno("");
      setSem("");
      setPassword("");
      setConfirmPassword("");

      navigate("/LoginPage?role=student");

    } catch (error) {
      console.error("Student registration error:", error);
      alert("Registration failed. Please check whether JSON Server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-register-page">

      <main className="student-register-main">

        {/* LEFT ILLUSTRATION */}
        <div className="col-6">
          <img src="/image/login.png" alt="Student Login" />
        </div>

        {/* RIGHT REGISTRATION FORM */}
        <div className="student-register-form-section">

          <div className="student-register-heading">
            <h1>REGISTRATION</h1>
            <p>Create your student account</p>
          </div>

          <form onSubmit={handleRegister}>

            {/* STUDENT NAME */}
            <div className="student-register-input">
              <i className="fa-solid fa-user"></i>
              <input
                type="text"
                placeholder="Student Name"
                value={sname}
                onChange={(e) => setName(e.target.value)}
                maxLength="60"
                required
              />
            </div>

            {/* EMAIL */}
            <div className="student-register-input">
              <i className="fa-solid fa-envelope"></i>
              <input
                type="email"
                placeholder="User Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* MOBILE */}
            <div className="student-register-input">
              <i className="fa-solid fa-phone"></i>
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mno}
                onChange={handleMobileChange}
                inputMode="numeric"
                maxLength="10"
                required
              />
            </div>

            {/* SEMESTER */}
            <div className="student-register-input">
              <i className="fa-solid fa-graduation-cap"></i>
              <select
                value={sem}
                onChange={(e) => setSem(e.target.value)}
                required
              >
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
              </select>
            </div>

            {/* PASSWORD */}
            <div className="student-register-input">
              <i className="fa-solid fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="student-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="student-register-input">
              <i className="fa-solid fa-shield-halved"></i>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="student-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            {/* PASSWORD MATCH MESSAGE */}
            {confirmPassword && (
              <small className={
                password === confirmPassword
                  ? "student-password-match"
                  : "student-password-error"
              }>
                {password === confirmPassword
                  ? "Passwords match"
                  : "Passwords do not match"}
              </small>
            )}

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              className="student-register-submit"
              disabled={loading}
            >
              {loading ? "REGISTERING..." : "REGISTER"}
            </button>

          </form>

          {/* LOGIN LINK */}
          <div className="student-register-footer">
            Already have an account?
            <Link to="/LoginPage?role=student"> Login</Link>
          </div>

        </div>
      </main>
    </div>
  );
}

export default StudentRegister;
