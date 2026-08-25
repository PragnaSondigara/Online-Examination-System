import { Route, Routes } from "react-router-dom";
import LoginPage from "./component/LoginPage";
import Home from "./component/Home";
import ManageStudent from "./component/ManageStudent";
import ManageFaculty from "./component/ManageFaculty";
import { AddStudent } from "./component/AddStudent";
import { AddFaculty } from "./component/AddFaculty";
import AdminDashboard from "./component/AdminDashboard";
import { ViewFeedback } from "./component/ViewFeedback";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ManageStudent" element={<ManageStudent />} />
        <Route path="/AddStudent" element={<AddStudent />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/Feedback" element={<ViewFeedback />} />

        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/ManageFaculty" element={<ManageFaculty />} />
        <Route path="/AddFaculty" element={<AddFaculty />} />
      </Routes>
    </div>
  );
}

export default App;