import { useState } from "react";
import "./LoginPage.css";
import logo from "./image/login.png";
import axios from "axios";
import { Navigate } from "react-router-dom";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPasswordd] = useState("");

  return (
    <>
      <div className="login-page">
        <div className="container">
          <div className="row">
            <div className="col-6">
              <img src={logo} alt="Student Login" />
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
                    name="password"
                    placeholder="Password"
                  />

                  <label htmlFor="studentId">Password</label>
                </div>
                <button type="submit" >
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
