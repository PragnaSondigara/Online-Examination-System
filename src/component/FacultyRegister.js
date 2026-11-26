
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./FacultyRegister.css";

function FacultyRegister() {
  const navigate = useNavigate();

  const [facultyName, setFacultyName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mobile number: only 10 digits
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setMobile(value.slice(0, 10));
  };

  // Faculty Registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!facultyName.trim()) {
      alert("Please enter faculty name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter email address.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
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

    if (!window.confirm("Do you want to register as faculty?")) {
      return;
    }

    setLoading(true);

    try {
      // Check whether email already exists
      const existingFaculty = await axios.get(
        "http://localhost:5000/tbl_faculty",
        {
          params: { email: email.trim() }
        }
      );

      if (existingFaculty.data.length > 0) {
        alert("This email is already registered.");
        return;
      }

      // Save faculty details
      await axios.post("http://localhost:5000/tbl_faculty", {
        faculty_name: facultyName.trim(),
        email: email.trim(),
        mobile_no: mobile,
        password: password,
        is_active: true
      });

      alert("Faculty registration successful!");

      // Clear form
      setFacultyName("");
      setEmail("");
      setMobile("");
      setPassword("");
      setConfirmPassword("");

      navigate("/LoginPage?role=faculty");

    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please check whether JSON Server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faculty-register-page">

      <main className="faculty-register-main">

        {/* LEFT ILLUSTRATION */}
        <div className="col-6">
          <img src="/image/login.png" alt="Faculty Registration" />
        </div>

        {/* RIGHT REGISTRATION FORM */}
        <div className="faculty-register-form-section">

          <div className="faculty-register-heading">
            <h1>REGISTRATION</h1>
            <p>Create your faculty account</p>
          </div>

          <form onSubmit={handleRegister}>

            {/* FACULTY NAME */}
            <div className="faculty-input-group">
              <i className="fa-solid fa-user"></i>
              <input
                type="text"
                placeholder="Faculty Name"
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
                maxLength="60"
                required
              />
            </div>

            {/* EMAIL */}
            <div className="faculty-input-group">
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
            <div className="faculty-input-group">
              <i className="fa-solid fa-phone"></i>
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                onChange={handleMobileChange}
                inputMode="numeric"
                maxLength="10"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="faculty-input-group">
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
                className="faculty-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="faculty-input-group">
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
                className="faculty-password-toggle"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            {/* PASSWORD MATCH MESSAGE */}
            {confirmPassword && (
              <small className={
                password === confirmPassword
                  ? "faculty-password-match"
                  : "faculty-password-error"
              }>
                {password === confirmPassword
                  ? "Passwords match"
                  : "Passwords do not match"}
              </small>
            )}

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              className="faculty-submit-btn"
              disabled={loading}
            >
              {loading ? "REGISTERING..." : "REGISTER"}
            </button>

          </form>

          {/* LOGIN LINK */}
          <div className="faculty-register-footer">
            Already have an account?
            <Link to="/LoginPage?role=faculty"> Login</Link>
          </div>

        </div>
      </main>
    </div>
  );
}

export default FacultyRegister;
