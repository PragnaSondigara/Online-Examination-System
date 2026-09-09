
import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import AdminSidebar from "./AdminSidebar";
import Header from "./Header";
import FacultySider from "./FacultySider";
import StudentSider from "./StudentSider";

export default function Profile() {
  // =========================================
  // LOGIN DATA
  // =========================================

  const username = localStorage.getItem("username") || "";
  const role = localStorage.getItem("role") || "";

  // =========================================
  // PROFILE DATA
  // =========================================

  const [formData, setFormData] = useState({
    username: username,
    email: "",
    phone: "",
    role: role,
    extra: "",
  });

  const [userId, setUserId] = useState("");

  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);

  // =========================================
  // GET TABLE NAME
  // =========================================

  const getTableName = () => {
    if (role === "Administrator") {
      return "tbl_admin";
    }

    if (role === "Faculty") {
      return "tbl_faculty";
    }

    if (role === "Student") {
      return "tbl_student";
    }

    return "";
  };

  // =========================================
  // GET NAME FIELD
  // =========================================

  const getNameField = () => {
    if (role === "Administrator") {
      return "admin_name";
    }

    if (role === "Faculty") {
      return "faculty_name";
    }

    if (role === "Student") {
      return "student_name";
    }

    return "";
  };

  // =========================================
  // FETCH PROFILE
  // =========================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const tableName = getTableName();
        const nameField = getNameField();

        if (!tableName || !nameField) {
          alert("Invalid Role");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/${tableName}?${nameField}=${encodeURIComponent(
            username
          )}`
        );

        console.log("Profile Data:", res.data);

        if (res.data.length === 0) {
          alert("User data not found.");
          setLoading(false);
          return;
        }

        const user = res.data[0];

        // Save JSON Server id
        setUserId(user.id);

        // Active status
        setIsActive(user.is_active);

        // =========================================
        // SET COMMON DATA
        // =========================================

        setFormData({
          username:
            user.admin_name ||
            user.faculty_name ||
            user.student_name ||
            username,

          email: user.email || "",

          phone: user.mobile_no || "",

          role: role,

          // Faculty = Subject
          // Student = Semester
          // Admin = blank
          extra:
            role === "Faculty"
              ? user.subject || user.subject_id || ""
              : role === "Student"
              ? user.semester || ""
              : "",
        });
      } catch (error) {
        console.error("Profile fetch error:", error);
        alert("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, role]);

  // =========================================
  // AVATAR
  // =========================================

  const firstLetter = formData.username
    ? formData.username.charAt(0).toUpperCase()
    : "U";

  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================
  // SAVE PROFILE
  // =========================================

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      const tableName = getTableName();

      if (!tableName) {
        alert("Invalid Role");
        return;
      }

      if (!userId) {
        alert("User ID not found.");
        return;
      }

      let updateData = {};

      // =========================================
      // ADMIN
      // =========================================

      if (role === "Administrator") {
        updateData = {
          admin_name: formData.username,
          email: formData.email,
        };
      }

      // =========================================
      // FACULTY
      // =========================================

      if (role === "Faculty") {
        updateData = {
          faculty_name: formData.username,
          email: formData.email,
          mobile_no: formData.phone,
        };
      }

      // =========================================
      // STUDENT
      // =========================================

      if (role === "Student") {
        updateData = {
          student_name: formData.username,
          email: formData.email,
          mobile_no: formData.phone,
        };
      }

      // =========================================
      // UPDATE JSON SERVER
      // =========================================

      await axios.patch(
        `http://localhost:5000/${tableName}/${userId}`,
        updateData
      );

      // Update Header username also
      localStorage.setItem("username", formData.username);

      alert("Profile updated successfully!");

      // Reload page so Header gets new username
      window.location.reload();
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Unable to update profile.");
    }
  };

  // =========================================
  // SIDEBAR
  // =========================================

  const getSidebar = () => {
    if (role === "Administrator") {
      return <AdminSidebar />;
    }

    if (role === "Faculty") {
      return <FacultySider/>;
    }

    if (role === "Student") {
      return <StudentSider />;
    }

    return null;
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="profile-container">
        {getSidebar()}

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

      {/* =====================================
          SIDEBAR
      ===================================== */}

      {getSidebar()}

      {/* =====================================
          MAIN
      ===================================== */}

      <div className="profile-main">

        {/* HEADER */}

        <Header />

        {/* PROFILE PAGE */}

        <div className="profile-page">

          {/* PAGE HEADER */}

          <div className="profile-page-header">

            <div>
              <h1>My Profile</h1>

              <p>
                Manage your account information and password.
              </p>
            </div>

          </div>

          {/* PROFILE CONTENT */}

          <div className="profile-content">

            {/* =================================
                LEFT PROFILE SUMMARY
            ================================= */}

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

                <span
                  className={
                    isActive
                      ? ""
                      : "inactive-dot"
                  }
                ></span>

                {isActive ? "Active" : "Inactive"}

              </div>

              <div className="summary-line"></div>

              {/* EMAIL */}

              <div className="summary-row">

                <span>Email</span>

                <strong>
                  {formData.email || "Not provided"}
                </strong>

              </div>

              {/* MOBILE */}

              <div className="summary-row">

                <span>Mobile</span>

                <strong>
                  {formData.phone || "Not provided"}
                </strong>

              </div>

              {/* ROLE */}

              <div className="summary-row">

                <span>Role</span>

                <strong>
                  {formData.role}
                </strong>

              </div>

              {/* FACULTY SUBJECT */}

              {/* {role === "Faculty" && (
                <div className="summary-row">

                  <span>Subject</span>

                  <strong>
                    {formData.extra || "Not provided"}
                  </strong>

                </div>
              )} */}

              {/* STUDENT SEMESTER */}

              {role === "Student" && (
                <div className="summary-row">

                  <span>Semester</span>

                  <strong>
                    {formData.extra || "Not provided"}
                  </strong>

                </div>
              )}

            </div>

            {/* =================================
                RIGHT PERSONAL INFORMATION
            ================================= */}

            <div className="profile-card personal-card">

              {/* HEADER */}

              <div className="card-title">

                <h2>
                  Personal Information
                </h2>

                <p>
                  Update your personal account details.
                </p>

              </div>

              {/* FORM */}

              <form onSubmit={handleProfileSubmit}>

                <div className="input-grid">

                  {/* USERNAME */}

                  <div className="input-group">

                    <label>
                      Username
                    </label>

                    <input
                      type="text"
                      name="username"
                      value={formData.username}
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
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      required
                    />

                  </div>

                  {/* MOBILE */}

                  <div className="input-group">

                    <label>
                      Mobile Number
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
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
                      value={formData.role}
                      disabled
                    />

                  </div>

                </div>

                {/* SAVE BUTTON */}

                <div className="button-area">

                  <button type="submit">
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