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
import ChangePassword from "./component/ChangePassword";
import ForgotPassword from "./component/ForgotPassword";
import ScheduleManagement from "./component/SchedulManagment";
import ManageQuestion from "./component/ManageQuestion";
import ManageSubject from "./component/ManageSubject";
import AddSubject from "./component/AddSubject";
import Profile from "./component/Profile";
import Settings from "./component/Settings";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ManageStudent" element={<ManageStudent />} />
        <Route path="/AddStudent" element={<AddStudent />} />
        <Route path="/AddFaculty" element={<AddFaculty />} />
        <Route path="/AddSchedule" element={<AddSchedule />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/ManageSubject" element={<ManageSubject />} />
        <Route path="/AddSubject" element={<AddSubject />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="/Feedback" element={<ViewFeedback />} />
        <Route path="/admin/view-feedback" element={<ViewFeedback />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />
        <Route path="/ManageFaculty" element={<ManageFaculty />} />
        <Route path="/FacultyDashboard" element={<FacultyDashboard />} />
        <Route path="/ScheduleManagement" element={<ScheduleManagement />} />
        <Route path="/ManageQuestion" element={<ManageQuestion />} />
        <Route path="/faculty/view-feedback" element={<ViewFeedback />} />
      </Routes>
    </div>
  );
}

export default App;
