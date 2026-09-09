import { Route, Routes } from "react-router-dom";

import LoginPage from "./component/LoginPage";
import Home from "./component/Home";

import ManageStudent from "./component/ManageStudent";
import ManageFaculty from "./component/ManageFaculty";

import { AddStudent } from "./component/AddStudent";
import { AddFaculty } from "./component/AddFaculty";
import { AddSchedule } from "./component/AddSchedule";

import AdminDashboard from "./component/AdminDashboard";
import FacultyDashboard from "./component/FacultyDashboard";
import StudentDashboard from "./component/StudentDashboard";

import { ViewFeedback } from "./component/ViewFeedback";

import ChangePassword from "./component/ChangePassword";
import ForgotPassword from "./component/ForgotPassword";

import ScheduleManagement from "./component/SchedulManagment";

import ManageQuestion from "./component/ManageQuestion";

import ManageSubject from "./component/ManageSubject";
import AddSubject from "./component/AddSubject";

import Profile from "./component/Profile";
import Settings from "./component/Settings";

import ViewStudentResult from "./component/ViewStudentResult";

import ViewExamSchedule from "./component/ViewExamSchedule";
import ViewResult from "./component/ViewResult";

import Reports from "./component/Reports";
import ViewReport from "./component/ViewReport";

import StartExam from "./component/StartExam";
import Feedback from "./component/Feedback";


function App() {
  return (
    <div>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* LOGIN */}
        <Route path="/LoginPage" element={<LoginPage />} />

        {/* PASSWORD */}
        <Route
          path="/ForgotPassword"
          element={<ForgotPassword />}
        />

        <Route
          path="/ChangePassword"
          element={<ChangePassword />}
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/AdminDashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/ManageStudent"
          element={<ManageStudent />}
        />

        <Route
          path="/AddStudent"
          element={<AddStudent />}
        />

        <Route
          path="/ManageFaculty"
          element={<ManageFaculty />}
        />

        <Route
          path="/AddFaculty"
          element={<AddFaculty />}
        />

        <Route
          path="/AddSchedule"
          element={<AddSchedule />}
        />

        <Route
          path="/ManageSubject"
          element={<ManageSubject />}
        />

        <Route
          path="/AddSubject"
          element={<AddSubject />}
        />

        <Route
          path="/admin/ViewFeedback"
          element={<ViewFeedback />}
        />

        <Route
          path="/ViewReport"
          element={<ViewReport />}
        />

        <Route
          path="/Report"
          element={<Reports />}
        />


        {/* ================= FACULTY ================= */}

        <Route
          path="/FacultyDashboard"
          element={<FacultyDashboard />}
        />

        <Route
          path="/ScheduleManagement"
          element={<ScheduleManagement />}
        />

        <Route
          path="/ManageQuestion"
          element={<ManageQuestion />}
        />

        <Route
          path="/faculty/ViewFeedback"
          element={<ViewFeedback />}
        />

        <Route
          path="/ViewStudentResult"
          element={<ViewStudentResult />}
        />


        {/* ================= STUDENT ================= */}

        <Route
          path="/StudentDashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/ViewExamSchedule"
          element={<ViewExamSchedule />}
        />

        <Route
          path="/ViewResult"
          element={<ViewResult />}
        />

        <Route
          path="/StartExam"
          element={<StartExam />}
        />

        <Route
          path="/Feedback"
          element={<Feedback />}
        />


        {/* ================= COMMON ================= */}

        <Route
          path="/Profile"
          element={<Profile />}
        />

        <Route
          path="/Settings"
          element={<Settings />}
        />

      </Routes>
    </div>
  );
}

export default App;