import { Route, Routes } from "react-router-dom";
import LoginPage from "./component/LoginPage";
import Home from "./component/Home";
import ManageStudent from "./component/ManageStudent";
import ManageFaculty from "./component/ManageFaculty";
import { AddStudent } from "./component/AddStudent";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ManageStudent" element={<ManageStudent />} />
        <Route path="/AddStudent" element={<AddStudent />} />

        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/ManageFaculty" element={<ManageFaculty />} />
      </Routes>
    </div>
  );
}

export default App;
