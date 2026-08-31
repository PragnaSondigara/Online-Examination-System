// import React, { useEffect, useState } from "react";
// import "./ManageQuestion.css";
// import FacultySider from "./FacultySider";
// import Header from "./Header";
// import Footer from "./Footer";

// const API_URL = "http://localhost:5000";

// const initialForm = {
//   exam_id: "",
//   question: "",
//   option_a: "",
//   option_b: "",
//   option_c: "",
//   option_d: "",
//   correct_answer: "",
//   marks: 2,
//   question_type: "MCQ",
// };

// const ManageQues = () => {
//   const [questions, setQuestions] = useState([]);
//   const [exams, setExams] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [faculties, setFaculties] = useState([]);

//   const [formData, setFormData] = useState(initialForm);

//   const [editingId, setEditingId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedExam, setSelectedExam] = useState("all");

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // --------------------------------------------------
//   // Fetch all data
//   // --------------------------------------------------

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const [
//         questionsResponse,
//         examsResponse,
//         subjectsResponse,
//         facultiesResponse,
//       ] = await Promise.all([
//         fetch(`${API_URL}/tbl_question`),
//         fetch(`${API_URL}/tbl_exam`),
//         fetch(`${API_URL}/tbl_subject`),
//         fetch(`${API_URL}/tbl_faculty`),
//       ]);

//       if (
//         !questionsResponse.ok ||
//         !examsResponse.ok ||
//         !subjectsResponse.ok ||
//         !facultiesResponse.ok
//       ) {
//         throw new Error("Failed to fetch data");
//       }

//       const questionsData = await questionsResponse.json();
//       const examsData = await examsResponse.json();
//       const subjectsData = await subjectsResponse.json();
//       const facultiesData = await facultiesResponse.json();

//       setQuestions(questionsData);
//       setExams(examsData);
//       setSubjects(subjectsData);
//       setFaculties(facultiesData);
//     } catch (err) {
//       setError("Unable to load data. Please check JSON Server.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // --------------------------------------------------
//   // Input Change
//   // --------------------------------------------------

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // --------------------------------------------------
//   // Reset Form
//   // --------------------------------------------------

//   const resetForm = () => {
//     setFormData(initialForm);
//     setEditingId(null);
//     setError("");
//   };

//   // --------------------------------------------------
//   // Get exam details
//   // --------------------------------------------------

//   const getExam = (examId) => {
//     return exams.find((exam) => String(exam.id) === String(examId));
//   };

//   const getSubject = (subjectId) => {
//     return subjects.find(
//       (subject) => String(subject.subject_id) === String(subjectId),
//     );
//   };

//   const getFaculty = (facultyId) => {
//     return faculties.find(
//       (faculty) => String(faculty.faculty_id) === String(facultyId),
//     );
//   };

//   // --------------------------------------------------
//   // Submit Form
//   // --------------------------------------------------

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setMessage("");

//     // Validation
//     if (!formData.exam_id) {
//       setError("Please select an exam.");
//       return;
//     }

//     if (!formData.question.trim()) {
//       setError("Please enter the question.");
//       return;
//     }

//     if (
//       !formData.option_a.trim() ||
//       !formData.option_b.trim() ||
//       !formData.option_c.trim() ||
//       !formData.option_d.trim()
//     ) {
//       setError("Please enter all four options.");
//       return;
//     }

//     if (!formData.correct_answer) {
//       setError("Please select the correct answer.");
//       return;
//     }

//     if (!formData.marks || Number(formData.marks) <= 0) {
//       setError("Marks must be greater than 0.");
//       return;
//     }

//     try {
//       setLoading(true);

//       if (editingId !== null) {
//         // -------------------------------------------
//         // UPDATE QUESTION
//         // -------------------------------------------

//         const response = await fetch(`${API_URL}/tbl_question/${editingId}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             ...formData,
//             exam_id: Number(formData.exam_id),
//             marks: Number(formData.marks),
//           }),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to update question");
//         }

//         setMessage("Question updated successfully.");
//       } else {
//         // -------------------------------------------
//         // ADD QUESTION
//         // -------------------------------------------

//         const maxQuestionId =
//           questions.length > 0
//             ? Math.max(...questions.map((q) => Number(q.question_id) || 0))
//             : 0;

//         const newQuestion = {
//           question_id: maxQuestionId + 1,
//           exam_id: Number(formData.exam_id),
//           question: formData.question.trim(),
//           option_a: formData.option_a.trim(),
//           option_b: formData.option_b.trim(),
//           option_c: formData.option_c.trim(),
//           option_d: formData.option_d.trim(),
//           correct_answer: formData.correct_answer,
//           marks: Number(formData.marks),
//           question_type: formData.question_type,
//         };

//         const response = await fetch(`${API_URL}/tbl_question`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(newQuestion),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to add question");
//         }

//         setMessage("Question added successfully.");
//       }

//       resetForm();
//       await fetchData();
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // Edit Question
//   // --------------------------------------------------

//   const handleEdit = (question) => {
//     setEditingId(question.id);

//     setFormData({
//       exam_id: question.exam_id,
//       question: question.question,
//       option_a: question.option_a,
//       option_b: question.option_b,
//       option_c: question.option_c,
//       option_d: question.option_d,
//       correct_answer: question.correct_answer,
//       marks: question.marks,
//       question_type: question.question_type || "MCQ",
//     });

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   // --------------------------------------------------
//   // Delete Question
//   // --------------------------------------------------

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this question?",
//     );

//     if (!confirmDelete) {
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await fetch(`${API_URL}/tbl_question/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete question");
//       }

//       setMessage("Question deleted successfully.");

//       await fetchData();
//     } catch (err) {
//       console.error(err);
//       setError("Unable to delete question.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // Search + Filter
//   // --------------------------------------------------

//   const filteredQuestions = questions.filter((question) => {
//     const search = searchTerm.toLowerCase();

//     const matchesSearch =
//       question.question?.toLowerCase().includes(search) ||
//       question.option_a?.toLowerCase().includes(search) ||
//       question.option_b?.toLowerCase().includes(search) ||
//       question.option_c?.toLowerCase().includes(search) ||
//       question.option_d?.toLowerCase().includes(search);

//     const matchesExam =
//       selectedExam === "all" ||
//       String(question.exam_id) === String(selectedExam);

//     return matchesSearch && matchesExam;
//   });

//   // --------------------------------------------------
//   // JSX
//   // --------------------------------------------------

//   return (
//     <>
//       <FacultySider />
//       <Header />
//       <div className="manage-question">
//         <div className="page-header">
//           <div>
//             <h1>Manage Questions</h1>
//             <p>Add, edit, delete and manage exam questions.</p>
//           </div>

//           <div className="question-count">
//             Total Questions: <strong>{questions.length}</strong>
//           </div>
//         </div>

//         {/* Messages */}

//         {message && (
//           <div className="success-message">
//             {message}
//             <button onClick={() => setMessage("")}>×</button>
//           </div>
//         )}

//         {error && (
//           <div className="error-message">
//             {error}
//             <button onClick={() => setError("")}>×</button>
//           </div>
//         )}

//         {/* -----------------------------------------------
//           ADD / EDIT FORM
//       ------------------------------------------------ */}

//         <div className="question-form-card">
//           <div className="card-header">
//             <h2>{editingId !== null ? "Edit Question" : "Add New Question"}</h2>

//             {editingId !== null && (
//               <button type="button" className="cancel-btn" onClick={resetForm}>
//                 Cancel Edit
//               </button>
//             )}
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="form-row">
//               {/* Exam */}

//               <div className="form-group">
//                 <label>Exam *</label>

//                 <select
//                   name="exam_id"
//                   value={formData.exam_id}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Exam</option>

//                   {exams.map((exam) => {
//                     const subject = getSubject(exam.subject_id);

//                     return (
//                       <option key={exam.id} value={exam.id}>
//                         {subject?.subject_name || "Unknown Subject"} -{" "}
//                         {exam.date} ({exam.start_time} - {exam.end_time})
//                       </option>
//                     );
//                   })}
//                 </select>
//               </div>

//               {/* Question Type */}

//               <div className="form-group">
//                 <label>Question Type</label>

//                 <select
//                   name="question_type"
//                   value={formData.question_type}
//                   onChange={handleChange}
//                 >
//                   <option value="MCQ">MCQ</option>
//                   <option value="True/False">True / False</option>
//                 </select>
//               </div>

//               {/* Marks */}

//               <div className="form-group small-field">
//                 <label>Marks *</label>

//                 <input
//                   type="number"
//                   name="marks"
//                   min="1"
//                   value={formData.marks}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             {/* Question */}

//             <div className="form-group">
//               <label>Question *</label>

//               <textarea
//                 name="question"
//                 rows="3"
//                 placeholder="Enter question..."
//                 value={formData.question}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Options */}

//             <div className="options-grid">
//               <div className="form-group">
//                 <label>Option A *</label>

//                 <input
//                   type="text"
//                   name="option_a"
//                   placeholder="Enter option A"
//                   value={formData.option_a}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Option B *</label>

//                 <input
//                   type="text"
//                   name="option_b"
//                   placeholder="Enter option B"
//                   value={formData.option_b}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Option C *</label>

//                 <input
//                   type="text"
//                   name="option_c"
//                   placeholder="Enter option C"
//                   value={formData.option_c}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Option D *</label>

//                 <input
//                   type="text"
//                   name="option_d"
//                   placeholder="Enter option D"
//                   value={formData.option_d}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             {/* Correct Answer */}

//             <div className="form-group correct-answer">
//               <label>Correct Answer *</label>

//               <div className="answer-options">
//                 {["A", "B", "C", "D"].map((answer) => (
//                   <label
//                     key={answer}
//                     className={`answer-option ${
//                       formData.correct_answer === answer ? "selected" : ""
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name="correct_answer"
//                       value={answer}
//                       checked={formData.correct_answer === answer}
//                       onChange={handleChange}
//                     />

//                     <span>Option {answer}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Submit */}

//             <div className="form-actions">
//               <button type="submit" className="submit-btn" disabled={loading}>
//                 {loading
//                   ? "Saving..."
//                   : editingId !== null
//                     ? "Update Question"
//                     : "Add Question"}
//               </button>

//               <button type="button" className="reset-btn" onClick={resetForm}>
//                 Reset
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* -----------------------------------------------
//           QUESTION LIST
//       ------------------------------------------------ */}

//         <div className="question-list-card">
//           <div className="list-header">
//             <h2>Question List</h2>

//             <div className="filters">
//               {/* Search */}

//               <input
//                 type="text"
//                 placeholder="Search questions..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />

//               {/* Exam Filter */}

//               <select
//                 value={selectedExam}
//                 onChange={(e) => setSelectedExam(e.target.value)}
//               >
//                 <option value="all">All Exams</option>

//                 {exams.map((exam) => {
//                   const subject = getSubject(exam.subject_id);

//                   return (
//                     <option key={exam.id} value={exam.id}>
//                       {subject?.subject_name || "Unknown Subject"} - {exam.date}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>
//           </div>

//           {loading && questions.length === 0 ? (
//             <div className="loading">Loading questions...</div>
//           ) : filteredQuestions.length === 0 ? (
//             <div className="no-data">No questions found.</div>
//           ) : (
//             <div className="question-table-wrapper">
//               <table className="question-table">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Question</th>
//                     <th>Options</th>
//                     <th>Correct</th>
//                     <th>Marks</th>
//                     <th>Exam Details</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {filteredQuestions.map((question, index) => {
//                     const exam = getExam(question.exam_id);

//                     const subject = exam ? getSubject(exam.subject_id) : null;

//                     const faculty = exam ? getFaculty(exam.faculty_id) : null;

//                     return (
//                       <tr key={question.id}>
//                         <td>{question.question_id || index + 1}</td>

//                         <td>
//                           <div className="question-text">
//                             {question.question}
//                           </div>
//                         </td>

//                         <td>
//                           <div className="options-list">
//                             <div>
//                               <strong>A.</strong> {question.option_a}
//                             </div>

//                             <div>
//                               <strong>B.</strong> {question.option_b}
//                             </div>

//                             <div>
//                               <strong>C.</strong> {question.option_c}
//                             </div>

//                             <div>
//                               <strong>D.</strong> {question.option_d}
//                             </div>
//                           </div>
//                         </td>

//                         <td>
//                           <span className="correct-badge">
//                             {question.correct_answer}
//                           </span>
//                         </td>

//                         <td>{question.marks}</td>

//                         <td>
//                           {exam ? (
//                             <div className="exam-info">
//                               <strong>
//                                 {subject?.subject_name || "Unknown Subject"}
//                               </strong>

//                               <span>{exam.date}</span>

//                               <span>
//                                 {exam.start_time} - {exam.end_time}
//                               </span>

//                               {faculty && (
//                                 <small>Faculty: {faculty.faculty_name}</small>
//                               )}
//                             </div>
//                           ) : (
//                             <span>Exam not found</span>
//                           )}
//                         </td>

//                         <td>
//                           <div className="action-buttons">
//                             <button
//                               className="edit-btn"
//                               onClick={() => handleEdit(question)}
//                             >
//                               Edit
//                             </button>

//                             <button
//                               className="delete-btn"
//                               onClick={() => handleDelete(question.id)}
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           <div className="result-summary">
//             Showing <strong>{filteredQuestions.length}</strong> of{" "}
//             <strong>{questions.length}</strong> questions
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ManageQues;
