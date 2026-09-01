import { useState } from "react";
import "./LoginPage.css";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPasswordd] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let tbl_name;
      if (role === "admin") {
        tbl_name = "tbl_admin";
      } else if (role === "faculty") {
        tbl_name = "tbl_faculty";
      } else if (role === "student") {
        tbl_name = "tbl_student";
      }
      const res = await axios.get(
        `http://localhost:5000/${tbl_name}?email=${email}&password=${password}`,
      );
      if (res.data.length == 1) {
        localStorage.setItem("auth", "true");
        if (role === "admin") {
          navigate("/AdminDashboard");
        } else if (role === "faculty") {
          navigate("/FacultyDashboard");
        } else if (role === "student") {
          navigate("/StudentDashboard");
        }
        window.location.reload();
      } else {
        alert("Enavlid Data");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="container">
          <div className="row">
            <div className="col-6">
              <img src="/image/login.png" alt="Student Login" />
            </div>
            <div className="col-6">
              <h1 className="login-title">LOGIN</h1>
              {/* Login Form */}
              <form className="login-form">
                {/* User Name */}
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="userEmail"
                    onChange={(e) => setEmail(e.target.value)}
                    name="userEmail"
                    placeholder="User Name"
                  />

                  <label htmlFor="studentName">User Eamil</label>
                </div>

                {/* Password */}
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    onChange={(e) => setPasswordd(e.target.value)}
                    name="password"
                    placeholder="Password"
                  />

                  <label htmlFor="studentId">Password</label>
                </div>
                <button type="submit" onClick={handleLogin}>
                  LOGIN
                </button>
                <p>
                  Don't have an account?<a href="#">Sign up here</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
