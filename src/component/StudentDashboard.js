import "./StudentDashboard.css";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import StudentSider from "./StudentSider";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentDashboard() {
  const [upcomingExamCount, setUpcomingExamCount] = useState(0);
  const [completedExamCount, setCompletedExamCount] = useState(0);
  const [resultCount, setResultCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const studentId = localStorage.getItem("studentId");

        if (!studentId) {
          console.log("Student ID not found");
          return;
        }

        const examRes = await axios.get("http://localhost:5000/tbl_exam");

        const studentExamRes = await axios.get(
          "http://localhost:5000/tbl_student_exam",
        );

        const resultRes = await axios.get("http://localhost:5000/tbl_result");

        // Student's exam records
        const studentExams = studentExamRes.data.filter(
          (exam) => exam.student_id === studentId,
        );

        // Completed exams
        const completedExams = studentExams.filter(
          (exam) => exam.status === "Completed",
        );

        setCompletedExamCount(completedExams.length);

        // IDs of completed exams
        const completedExamIds = completedExams.map((exam) => exam.exam_id);

        // Upcoming exams
        const upcomingExams = examRes.data.filter(
          (exam) =>
            exam.is_active === true && !completedExamIds.includes(exam.id),
        );

        setUpcomingExamCount(upcomingExams.length);

        // Results
        const studentResults = resultRes.data.filter(
          (result) => result.student_id === studentId,
        );

        setResultCount(studentResults.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <StudentSider />
      <Header />

      <main className="manage-student">
        {/* Top Heading */}
        <div className="page-top">
          <div>
            <h1>Student Dashboard</h1>

            <p>
              View your exam schedule, examination results and exam details.
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="student-stats">
          {/* Upcoming Exams */}
          <div className="stat-card purple">
            <div className="stat-icon">📅</div>

            <div>
              <span>Upcoming Exams</span>
              <strong>{upcomingExamCount}</strong>
            </div>
          </div>

          {/* Completed Exams */}
          <div className="stat-card green">
            <div className="stat-icon">✅</div>

            <div>
              <span>Completed Exams</span>
              <strong>{completedExamCount}</strong>
            </div>
          </div>

          {/* Results */}
          <div className="stat-card orange">
            <div className="stat-icon">📋</div>

            <div>
              <span>Available Results</span>
              <strong>{resultCount}</strong>
            </div>
          </div>
        </div>

        {/* Student Modules */}
        <section className="student-card">
          <div className="table-toolbar">
            <div>
              <h2>Student Modules</h2>

              <p>Quick access to your examination modules.</p>
            </div>
          </div>

          <div className="dashboard-cards" style={{ padding: "20px" }}>
            {/* View Exam Schedule */}
            <Link
              to="/ViewExamSchedule"
              className="dashboard-card dashboard-exam"
            >
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">📅</div>

                <div className="dashboard-card-arrow">→</div>
              </div>

              <h3>View Exam Schedule</h3>

              <p>
                View your upcoming examination dates, subjects and exam timing.
              </p>
            </Link>

            {/* View Result */}
            <Link to="/ViewResult" className="dashboard-card dashboard-result">
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">📝</div>

                <div className="dashboard-card-arrow">→</div>
              </div>

              <h3>View Result</h3>

              <p>
                Check your examination results, marks and overall performance.
              </p>
            </Link>

            {/* Provide Feedback */}
            <Link to="/Feedback" className="dashboard-card dashboard-feedback">
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">💬</div>

                <div className="dashboard-card-arrow">→</div>
              </div>

              <h3>Provide Feedback</h3>

              <p>
                Share your thoughts and suggestions about the examination
                system.
              </p>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
