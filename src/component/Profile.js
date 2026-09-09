import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import AdminSidebar from "./AdminSidebar";
import Header from "./Header";

export default function Profile() {
  // =========================================
  // LOGGED-IN USERNAME
  // =========================================

  const username = localStorage.getItem("username") || "Admin";

  // =========================================
  // PROFILE DATA
  // =========================================

  const [formData, setFormData] = useState({
    username: username,
    email: "",
    phone: "",
    role: "Administrator",
  });

  // =========================================
  // PASSWORD DATA
  // =========================================

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // =========================================
  // LOADING
  // =========================================

  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH LOGGED-IN ADMIN
  // =========================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/tbl_admin?admin_name=${username}`
        );

        if (res.data.length > 0) {
          const user = res.data[0];

          setFormData({
            username: user.admin_name || username,

            email:
              user.email ||
              "",

            // MOBILE NUMBER
            phone:
              user.mobile_no ||
              "",

            role: "Administrator",
          });
        }
      } catch (error) {
        console.error(
          "Error fetching profile:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  // =========================================
  // AVATAR LETTER
  // =========================================

  const firstLetter = formData.username
    ? formData.username.charAt(0).toUpperCase()
    : "A";

  // =========================================
  // HANDLE PROFILE INPUT
  // =========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================
  // HANDLE PASSWORD INPUT
  // =========================================

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================
  // SAVE PROFILE
  // =========================================

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      // Find logged-in admin
      const res = await axios.get(
        `http://localhost:5000/tbl_admin?admin_name=${username}`
      );

      if (res.data.length === 0) {
        alert("User not found.");
        return;
      }

      const user = res.data[0];

      // Update admin record
      await axios.patch(
        `http://localhost:5000/tbl_admin/${user.id}`,
        {
          admin_name: formData.username,
          email: formData.email,

          // MOBILE NUMBER
          mobile_no: formData.phone,
        }
      );

      // Update local username
      localStorage.setItem(
        "username",
        formData.username
      );

      alert("Profile updated successfully!");

    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      alert("Unable to update profile.");
    }
  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="profile-container">

        <AdminSidebar />

        <div className="profile-main">

          <Header />

          <div className="profile-loading">
            Loading profile...
          </div>

        </div>

      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="profile-container">

      {/* SIDEBAR */}

      <AdminSidebar />

      {/* MAIN CONTENT */}

      <div className="profile-main">

        {/* HEADER */}

        <Header />

        {/* PROFILE PAGE */}

        <div className="profile-page">

          {/* PAGE HEADER */}

          <div className="profile-page-header">

            <div>

              <h1>
                My Profile
              </h1>

              <p>
                Manage your account information
                and password.
              </p>

            </div>

          </div>

          {/* PROFILE CONTENT */}

          <div className="profile-content">

            {/* PROFILE SUMMARY */}

            <div className="profile-card profile-summary">

              {/* Avatar */}

              <div className="profile-avatar">
                {firstLetter}
              </div>

              {/* Username */}

              <h2>
                {formData.username}
              </h2>

              {/* Role */}

              <p className="profile-role">
                {formData.role}
              </p>

              {/* Status */}

              <div className="active-status">

                <span></span>

                Active

              </div>

              <div className="summary-line"></div>

              {/* Email */}

              <div className="summary-row">

                <span>
                  Email
                </span>

                <strong>
                  {formData.email ||
                    "Not provided"}
                </strong>

              </div>

              {/* Mobile Number */}

              <div className="summary-row">

                <span>
                  Mobile
                </span>

                <strong>
                  {formData.phone ||
                    "Not provided"}
                </strong>

              </div>

              {/* Role */}

              <div className="summary-row">

                <span>
                  Role
                </span>

                <strong>
                  {formData.role}
                </strong>

              </div>

            </div>

            {/* PERSONAL INFORMATION */}

            <div className="profile-card personal-card">

              {/* Card Header */}

              <div className="card-title">

                <h2>
                  Personal Information
                </h2>

                <p>
                  Update your personal account details.
                </p>

              </div>

              {/* Form */}

              <form
                onSubmit={handleProfileSubmit}
              >

                <div className="input-grid">

                  {/* USERNAME */}

                  <div className="input-group">

                    <label>
                      Username
                    </label>

                    <input
                      type="text"
                      name="username"
                      value={
                        formData.username
                      }
                      onChange={handleChange}
                      placeholder="Enter username"
                      required
                    />

                  </div>

                  {/* EMAIL */}

                  <div className="input-group">

                    <label>
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={
                        formData.email
                      }
                      onChange={handleChange}
                      placeholder="Enter email address"
                      required
                    />

                  </div>

                  {/* MOBILE NUMBER */}

                  <div className="input-group">

                    <label>
                      Mobile Number
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={
                        formData.phone
                      }
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                    />

                  </div>

                  {/* ROLE */}

                  <div className="input-group">

                    <label>
                      Role
                    </label>

                    <input
                      type="text"
                      value={
                        formData.role
                      }
                      disabled
                    />

                  </div>

                </div>

                {/* SAVE BUTTON */}

                <div className="button-area">

                  <button
                    type="submit"
                  >
                    Save Changes
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}