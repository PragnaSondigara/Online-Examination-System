import { Route, Routes } from "react-router-dom";
import LoginPage from "./component/LoginPage";
import Home from "./component/Home";
import ManageStudent from "./component/ManageStudent";
import ManageFaculty from "./component/ManageFaculty";
import { AddStudent } from "./component/AddStudent";
import { AddFaculty } from "./component/AddFaculty";
import { AddSchedule } from "./component/AddSchedule";
import AdminDashboard from "./component/AdminDashboard";
import { ViewFeedback } from "./component/ViewFeedback";
import FacultyDashboard from "./component/FacultyDashboard";
import StudentSider from "./component/StudentSider";
import ChangePassword from "./component/ChangePassword";
import ForgotPassword from "./component/ForgotPassword";
import ScheduleManagement from "./component/SchedulManagment";
import ManageQuestion from "./component/ManageQuestion";
import ManageSubject from "./component/ManageSubject";
import AddSubject from "./component/AddSubject";
import ViewStudentResult from "./component/ViewStudentResult";
import StudentDashboard from "./component/StudentDashboard";
import ViewExamSchedule from "./component/ViewExamSchedule";
import ViewResult from "./component/ViewResult";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/ManageStudent" element={<ManageStudent />} />
        <Route path="/AddStudent" element={<AddStudent />} />
        <Route path="/AddFaculty" element={<AddFaculty />} />
        <Route path="/AddSchedule" element={<AddSchedule />} />
        <Route path="/ManageSubject" element={<ManageSubject />} />
        <Route path="/AddSubject" element={<AddSubject />} />
        <Route path="/admin/ViewFeedback" element={<ViewFeedback />} />

        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />

        <Route path="/FacultyDashboard" element={<FacultyDashboard />} />
        <Route path="/ManageFaculty" element={<ManageFaculty />} />
        <Route path="/ScheduleManagement" element={<ScheduleManagement />} />
        <Route path="/ManageQuestion" element={<ManageQuestion />} />
        <Route path="/faculty/ViewFeedback" element={<ViewFeedback />} />
        <Route path="/ViewStudentResult" element={<ViewStudentResult />} />

        <Route path="/StudentDashboard" element={<StudentDashboard />} />
        <Route path="/ViewExamSchedule" element={<ViewExamSchedule />} />
        <Route path="/ViewResult" element={<ViewResult />} />

      </Routes>
    </div>
  );
}

export default App;
