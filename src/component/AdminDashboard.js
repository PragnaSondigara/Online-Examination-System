
import "./AdminDashboard.css";
import AdminSidebar from "./AdminSidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const API_URL = "http://localhost:5000";
const CHART_COLORS = ["#36c5a0", "#f08b67", "#6485d8", "#9b7bd5"];

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    students: [],
    faculty: [],
    subjects: [],
    exams: [],
    results: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Dashboard Data
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          studentRes,
          facultyRes,
          subjectRes,
          examRes,
          resultRes,
        ] = await Promise.all([
          axios.get(`${API_URL}/tbl_student`),
          axios.get(`${API_URL}/tbl_faculty`),
          axios.get(`${API_URL}/tbl_subject`),
          axios.get(`${API_URL}/tbl_exam`),
          axios.get(`${API_URL}/tbl_result`),
        ]);

        if (mounted) {
          setDashboardData({
            students: studentRes.data,
            faculty: facultyRes.data,
            subjects: subjectRes.data,
            exams: examRes.data,
            results: resultRes.data,
          });
        }
      } catch (fetchError) {
        console.error("Error fetching dashboard data:", fetchError);

        if (mounted) {
          setError(
            "Unable to load dashboard data. Check whether JSON Server is running."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  const { students, faculty, subjects, exams, results } = dashboardData;

  // Student Account Status
  const studentStatusData = useMemo(
    () =>
      [
        {
          name: "Active",
          value: students.filter((item) => item.is_active === true).length,
        },
        {
          name: "Inactive",
          value: students.filter((item) => item.is_active === false).length,
        },
      ].filter((item) => item.value > 0),
    [students]
  );

  // Faculty Account Status
  const facultyStatusData = useMemo(
    () =>
      [
        {
          name: "Active",
          value: faculty.filter((item) => item.is_active === true).length,
        },
        {
          name: "Inactive",
          value: faculty.filter((item) => item.is_active === false).length,
        },
      ].filter((item) => item.value > 0),
    [faculty]
  );

  // Exams by Subject
  const examSubjectData = useMemo(() => {
    const counts = new Map();

    exams.forEach((exam) => {
      const subject = subjects.find(
        (item) => String(item.id) === String(exam.subject_id)
      );

      const label =
        subject?.subject_name ||
        subject?.subject ||
        (exam.subject_id ? `Subject ${exam.subject_id}` : "Unassigned");

      counts.set(label, (counts.get(label) || 0) + 1);
    });

    return Array.from(counts, ([subject, totalExams]) => ({
      subject,
      totalExams,
    }));
  }, [exams, subjects]);

  // Result Distribution
  const resultPerformanceData = useMemo(() => {
    const passed = results.filter(
      (item) => String(item.status || "").toLowerCase() === "pass"
    ).length;

    const failed = results.filter(
      (item) => String(item.status || "").toLowerCase() === "fail"
    ).length;

    const other = results.length - passed - failed;

    return [
      { status: "Pass", total: passed },
      { status: "Fail", total: failed },
      { status: "Other", total: other },
    ].filter((item) => item.total > 0);
  }, [results]);

  // Empty Chart Message
  const renderEmpty = (message) => (
    <div className="admin-chart-empty">{message}</div>
  );

  return (
    <>
      <AdminSidebar />
      <Header />

      <main className="manage-student">
        {/* Top Heading */}
        <div className="page-top">
          <div>
            <h1>Admin Dashboard</h1>
            <p>
              Manage students, faculty, subjects, feedback, and examination
              reports.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="student-stats">
          {/* Total Students */}
          <div className="stat-card purple">
            <div className="stat-icon">👨‍🎓</div>
            <div>
              <span>Total Students</span>
              <strong>{loading ? "—" : students.length}</strong>
            </div>
          </div>

          {/* Total Faculty */}
          <div className="stat-card green">
            <div className="stat-icon">👨‍🏫</div>
            <div>
              <span>Total Faculty</span>
              <strong>{loading ? "—" : faculty.length}</strong>
            </div>
          </div>

          {/* Total Subjects */}
          <div className="stat-card orange">
            <div className="stat-icon">📚</div>
            <div>
              <span>Total Subjects</span>
              <strong>{loading ? "—" : subjects.length}</strong>
            </div>
          </div>

          {/* Online Exams */}
          <div className="stat-card blue">
            <div className="stat-icon">📝</div>
            <div>
              <span>Online Exams</span>
              <strong>{loading ? "—" : exams.length}</strong>
            </div>
          </div>
        </div>

        {/* ANALYTICS CHARTS */}
        <section className="admin-charts-section">
          <div className="admin-charts-heading">
            <div>
              <h2>Analytics Overview</h2>
              <p>Charts are calculated from your JSON Server records.</p>
            </div>

            <span className="admin-live-label">
              <span />
              Live database data
            </span>
          </div>

          <div className="admin-charts-grid">
            {/* STUDENT STATUS CHART */}
            <article className="admin-chart-card">
              <div className="admin-chart-title">
                <h3>Student Account Status</h3>
                <p>Active and inactive student accounts</p>
              </div>

              {loading ? (
                renderEmpty("Loading chart...")
              ) : studentStatusData.length > 0 ? (
                <div className="admin-chart-area">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={studentStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="48%"
                        innerRadius={62}
                        outerRadius={94}
                        paddingAngle={4}
                      >
                        {studentStatusData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={index === 0 ? "#36c5a0" : "#f08b67"}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                renderEmpty("No student accounts available yet.")
              )}
            </article>

            {/* FACULTY STATUS CHART */}
            <article className="admin-chart-card">
              <div className="admin-chart-title">
                <h3>Faculty Account Status</h3>
                <p>Active and inactive faculty accounts</p>
              </div>

              {loading ? (
                renderEmpty("Loading chart...")
              ) : facultyStatusData.length > 0 ? (
                <div className="admin-chart-area">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={facultyStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="48%"
                        innerRadius={62}
                        outerRadius={94}
                        paddingAngle={4}
                      >
                        {facultyStatusData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={index === 0 ? "#36c5a0" : "#f08b67"}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                renderEmpty("No faculty accounts available yet.")
              )}
            </article>

            {/* EXAMS BY SUBJECT */}
            <article className="admin-chart-card admin-chart-wide">
              <div className="admin-chart-title">
                <h3>Exams by Subject</h3>
                <p>Number of exams associated with each subject</p>
              </div>

              {loading ? (
                renderEmpty("Loading chart...")
              ) : examSubjectData.length > 0 ? (
                <div className="admin-chart-area admin-bar-area">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={examSubjectData}
                      margin={{
                        top: 12,
                        right: 18,
                        left: 0,
                        bottom: 8,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="subject"
                        tick={{ fontSize: 12 }}
                        interval={0}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="totalExams"
                        name="Exams"
                        fill="#6485d8"
                        radius={[7, 7, 0, 0]}
                        maxBarSize={54}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                renderEmpty("No exams have been created yet.")
              )}
            </article>

            {/* RESULT DISTRIBUTION */}
            <article className="admin-chart-card admin-chart-wide">
              <div className="admin-chart-title">
                <h3>Result Distribution</h3>
                <p>Submitted results grouped by status</p>
              </div>

              {loading ? (
                renderEmpty("Loading chart...")
              ) : resultPerformanceData.length > 0 ? (
                <div className="admin-chart-area admin-bar-area">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={resultPerformanceData}
                      margin={{
                        top: 12,
                        right: 18,
                        left: 0,
                        bottom: 8,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis dataKey="status" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="total"
                        name="Students"
                        radius={[7, 7, 0, 0]}
                        maxBarSize={64}
                      >
                        {resultPerformanceData.map((entry, index) => (
                          <Cell
                            key={entry.status}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                renderEmpty("No result records available yet.")
              )}
            </article>
          </div>
        </section>

        {/* Management Modules Section */}
        <section className="student-card">
          <div className="table-toolbar">
            <div>
              <h2>Management Modules</h2>
              <p>Quick access to all administration modules.</p>
            </div>
          </div>

          <div className="dashboard-cards" style={{ padding: "20px" }}>
            {/* Manage Student */}
            <Link
              to="/ManageStudent"
              className="dashboard-card dashboard-student"
            >
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">👨‍🎓</div>
                <div className="dashboard-card-arrow">→</div>
              </div>
              <h3>Manage Student</h3>
              <p>
                Add, edit, view and delete student accounts and manage student
                information.
              </p>
            </Link>

            {/* Manage Faculty */}
            <Link
              to="/ManageFaculty"
              className="dashboard-card dashboard-faculty"
            >
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">👨‍🏫</div>
                <div className="dashboard-card-arrow">→</div>
              </div>
              <h3>Manage Faculty</h3>
              <p>
                Manage faculty profiles, information and teaching activities.
              </p>
            </Link>

            {/* Manage Subject */}
            <Link
              to="/ManageSubject"
              className="dashboard-card dashboard-subject"
            >
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">📚</div>
                <div className="dashboard-card-arrow">→</div>
              </div>
              <h3>Manage Subject</h3>
              <p>
                Add, edit, view and delete subjects and manage subject
                information.
              </p>
            </Link>

            {/* Feedback */}
            <Link
              to="/admin/ViewFeedback"
              className="dashboard-card dashboard-feedback"
            >
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">💬</div>
                <div className="dashboard-card-arrow">→</div>
              </div>
              <h3>Feedback</h3>
              <p>
                Review feedback and suggestions submitted by students and
                faculty.
              </p>
            </Link>

            {/* Reports */}
            <Link to="/ViewReport" className="dashboard-card dashboard-report">
              <div className="dashboard-card-header">
                <div className="dashboard-card-icon">📊</div>
                <div className="dashboard-card-arrow">→</div>
              </div>
              <h3>Reports</h3>
              <p>
                View examination results, student performance and system
                reports.
              </p>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
