import "./AddStudent.css"
import AdminHeader from "./AdminHeader"
import AdminSidebar from "./AdminSidebar"
export function AddStudent() {
    return (
        <>

            <AdminSidebar />
            <AdminHeader />
            <div className="student-form-overlay">
                <div className="student-form-modal">

                    {/* Header */}
                    <div className="student-form-header">
                        <div>
                            <h2>Add Student</h2>
                            <p>Enter student details below</p>
                        </div>

                        <button className="student-form-close">×</button>
                    </div>

                    {/* Form */}
                    <form className="student-form">

                        {/* Student Name */}
                        <div className="form-group">
                            <label>Student Name</label>
                            <input
                                type="text"
                                placeholder="Enter student name"
                            />
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter email address"
                            />
                        </div>

                        {/* Mobile */}
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input
                                type="text"
                                placeholder="Enter mobile number"
                            />
                        </div>

                        {/* Semester */}
                        <div className="form-group">
                            <label>Semester</label>

                            <select>
                                <option value="">Select Semester</option>
                                <option value="1">Semester 1</option>
                                <option value="2">Semester 2</option>
                                <option value="3">Semester 3</option>
                                <option value="4">Semester 4</option>
                                <option value="5">Semester 5</option>
                                <option value="6">Semester 6</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div className="form-group">
                            <label>Status</label>

                            <select>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="student-form-buttons">
                            <button
                                type="button"
                                className="student-cancel-btn"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="student-submit-btn"
                            >
                                Add Student
                            </button>
                        </div>

                    </form>

                </div>
            </div>
        </>
    )
}