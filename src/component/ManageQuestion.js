import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageQuestion.css";

import FacultySider from "./FacultySider";
import Header from "./Header";
import Footer from "./Footer";
import AddQuestion from "./AddQuestion";

const API_URL = "http://localhost:5000";

export default function ManageQuestion() {
  // =====================================================
  // STATES
  // =====================================================

  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [facultyId, setFacultyId] = useState("");

  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState("all");

  const [showAddQuestion, setShowAddQuestion] = useState(false);

  // =====================================================
  // INLINE EDIT
  // =====================================================

  const [editingId, setEditingId] = useState(null);

  const [editQuestion, setEditQuestion] = useState({
    exam_id: "",
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "",
    marks: 1,
    question_type: "MCQ",
  });

  // =====================================================
  // GET FACULTY ID
  // =====================================================

  useEffect(() => {
    const storedFacultyId = localStorage.getItem("facultyId");

    if (!storedFacultyId) {
      alert("Faculty login session not found. Please login again.");

      return;
    }

    setFacultyId(storedFacultyId);

    fetchData(storedFacultyId);
  }, []);

  // =====================================================
  // FETCH DATA
  // =====================================================

  const fetchData = async (loggedFacultyId) => {
    try {
      setLoading(true);

      // =================================================
      // GET FACULTY
      // =================================================

      const facultyResponse = await axios.get(
        `${API_URL}/tbl_faculty/${loggedFacultyId}`,
      );

      const faculty = facultyResponse.data;

      if (faculty.is_active !== true) {
        alert(
          "Your faculty account is inactive. Please contact administrator.",
        );

        return;
      }

      // =================================================
      // GET SUBJECTS
      // =================================================

      const subjectResponse = await axios.get(`${API_URL}/tbl_subject`);

      const allSubjects = subjectResponse.data;

      const facultySubjects = allSubjects.filter(
        (subject) =>
          String(subject.faculty_id) === String(faculty.id) &&
          subject.is_active === true,
      );

      if (facultySubjects.length === 0) {
        setSubjects([]);
        setExams([]);
        setQuestions([]);

        alert("No subject is assigned to this faculty.");

        return;
      }

      setSubjects(facultySubjects);

      // =================================================
      // GET EXAMS
      // =================================================

      const examResponse = await axios.get(`${API_URL}/tbl_exam`);

      const allExams = examResponse.data;

      const facultySubjectIds = facultySubjects.map((subject) =>
        String(subject.id),
      );

      const facultyExams = allExams.filter((exam) => {
        const correctFaculty = String(exam.faculty_id) === String(faculty.id);

        const correctSubject = facultySubjectIds.includes(
          String(exam.subject_id),
        );

        return correctFaculty && correctSubject;
      });

      setExams(facultyExams);

      // =================================================
      // GET QUESTIONS
      // =================================================

      const questionResponse = await axios.get(`${API_URL}/tbl_question`);

      const allQuestions = questionResponse.data;

      const facultyExamIds = facultyExams.map((exam) => String(exam.id));

      const facultyQuestions = allQuestions.filter((question) =>
        facultyExamIds.includes(String(question.exam_id)),
      );

      setQuestions(facultyQuestions);
    } catch (err) {
      console.error("Fetch error:", err);

      if (err.response) {
        alert(
          err.response.data?.message || "Server error. Unable to load data.",
        );
      } else if (err.request) {
        alert(
          "JSON Server is not running. Please start JSON Server on port 5000.",
        );
      } else {
        alert(err.message || "Unable to load data.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET EXAM
  // =====================================================

  const getExam = (examId) => {
    return exams.find((exam) => String(exam.id) === String(examId));
  };

  // =====================================================
  // GET SUBJECT
  // =====================================================

  const getSubject = (subjectId) => {
    return subjects.find((subject) => String(subject.id) === String(subjectId));
  };

  // =====================================================
  // CHECK EXAM ACCESS
  // =====================================================

  const isExamAllowed = (examId) => {
    const exam = getExam(examId);

    if (!exam) {
      return false;
    }

    if (String(exam.faculty_id) !== String(facultyId)) {
      return false;
    }

    const subjectExists = subjects.some(
      (subject) => String(subject.id) === String(exam.subject_id),
    );

    return subjectExists;
  };

  // =====================================================
  // OPEN ADD QUESTION
  // =====================================================

  const handleAddQuestion = () => {
    if (subjects.length === 0) {
      alert("No subject is assigned to you.");

      return;
    }

    if (exams.length === 0) {
      alert("No exam is available for your assigned subject.");

      return;
    }

    setShowAddQuestion(true);
  };

  // =====================================================
  // ADD QUESTION
  // =====================================================

  const handleSaveQuestion = async (formData) => {
    try {
      setLoading(true);

      // ---------------------------------------------
      // CHECK EXAM
      // ---------------------------------------------

      if (!formData.exam_id) {
        alert("Please select an exam.");

        return;
      }

      // ---------------------------------------------
      // CHECK ACCESS
      // ---------------------------------------------

      if (!isExamAllowed(formData.exam_id)) {
        alert("You can only add questions to your assigned subjects.");

        return;
      }

      // ---------------------------------------------
      // PREPARE QUESTION
      // ---------------------------------------------

      const newQuestion = {
        exam_id: formData.exam_id,

        question: formData.question.trim(),

        option_a:
          formData.question_type === "MCQ" ? formData.option_a.trim() : "True",

        option_b:
          formData.question_type === "MCQ" ? formData.option_b.trim() : "False",

        option_c:
          formData.question_type === "MCQ" ? formData.option_c.trim() : "",

        option_d:
          formData.question_type === "MCQ" ? formData.option_d.trim() : "",

        correct_answer: formData.correct_answer,

        marks: Number(formData.marks),

        question_type: formData.question_type,
      };

      console.log("Adding question:", newQuestion);

      // ---------------------------------------------
      // POST
      // ---------------------------------------------

      const response = await axios.post(`${API_URL}/tbl_question`, newQuestion);

      console.log("Add response:", response.data);

      // ---------------------------------------------
      // SUCCESS
      // ---------------------------------------------

      alert("Question added successfully.");

      setShowAddQuestion(false);

      // Reload questions
      await fetchData(facultyId);
    } catch (err) {
      console.error("Add question error:", err);

      if (err.response) {
        alert(
          err.response.data?.message || "Server error while adding question.",
        );
      } else if (err.request) {
        alert(
          "JSON Server is not running. Please start JSON Server on port 5000.",
        );
      } else {
        alert(err.message || "Unable to add question.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EDIT QUESTION
  // =====================================================

  const handleEdit = (question) => {
    if (!isExamAllowed(question.exam_id)) {
      alert("You can only edit questions from your assigned subjects.");

      return;
    }

    setEditingId(question.id);

    setEditQuestion({
      exam_id: question.exam_id || "",

      question: question.question || "",

      option_a: question.option_a || "",

      option_b: question.option_b || "",

      option_c: question.option_c || "",

      option_d: question.option_d || "",

      correct_answer: question.correct_answer || "",

      marks: question.marks !== undefined ? question.marks : 1,

      question_type: question.question_type || "MCQ",
    });
  };

  // =====================================================
  // EDIT INPUT
  // =====================================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "question_type") {
      setEditQuestion((prev) => ({
        ...prev,

        question_type: value,

        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",

        correct_answer: "",
      }));

      return;
    }

    setEditQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {
    setEditingId(null);

    setEditQuestion({
      exam_id: "",
      question: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "",
      marks: 1,
      question_type: "MCQ",
    });
  };

  // =====================================================
  // VALIDATE EDIT
  // =====================================================

  const validateEditQuestion = () => {
    if (!editQuestion.exam_id) {
      alert("Please select an exam.");

      return false;
    }

    if (!editQuestion.question.trim()) {
      alert("Please enter the question.");

      return false;
    }

    if (editQuestion.marks === "" || Number(editQuestion.marks) <= 0) {
      alert("Marks must be greater than 0.");

      return false;
    }

    // =================================================
    // MCQ
    // =================================================

    if (editQuestion.question_type === "MCQ") {
      if (!editQuestion.option_a.trim()) {
        alert("Please enter Option A.");

        return false;
      }

      if (!editQuestion.option_b.trim()) {
        alert("Please enter Option B.");

        return false;
      }

      if (!editQuestion.option_c.trim()) {
        alert("Please enter Option C.");

        return false;
      }

      if (!editQuestion.option_d.trim()) {
        alert("Please enter Option D.");

        return false;
      }

      if (!["A", "B", "C", "D"].includes(editQuestion.correct_answer)) {
        alert("Please select the correct answer.");

        return false;
      }
    }

    // =================================================
    // TRUE / FALSE
    // =================================================

    if (editQuestion.question_type === "True/False") {
      if (!["True", "False"].includes(editQuestion.correct_answer)) {
        alert("Please select True or False.");

        return false;
      }
    }

    return true;
  };

  // =====================================================
  // SAVE EDIT
  // =====================================================

  const handleSaveEdit = async (id) => {
    if (!validateEditQuestion()) {
      return;
    }

    if (!isExamAllowed(editQuestion.exam_id)) {
      alert("You can only update questions from your assigned subjects.");

      return;
    }

    try {
      setLoading(true);

      // ---------------------------------------------
      // FIND OLD QUESTION
      // ---------------------------------------------

      const oldQuestion = questions.find(
        (item) => String(item.id) === String(id),
      );

      if (!oldQuestion) {
        alert("Question not found.");

        return;
      }

      // ---------------------------------------------
      // CREATE UPDATED QUESTION
      // ---------------------------------------------

      const updatedQuestion = {
        ...oldQuestion,

        exam_id: editQuestion.exam_id,

        question: editQuestion.question.trim(),

        option_a:
          editQuestion.question_type === "MCQ"
            ? editQuestion.option_a.trim()
            : "True",

        option_b:
          editQuestion.question_type === "MCQ"
            ? editQuestion.option_b.trim()
            : "False",

        option_c:
          editQuestion.question_type === "MCQ"
            ? editQuestion.option_c.trim()
            : "",

        option_d:
          editQuestion.question_type === "MCQ"
            ? editQuestion.option_d.trim()
            : "",

        correct_answer: editQuestion.correct_answer,

        marks: Number(editQuestion.marks),

        question_type: editQuestion.question_type,
      };

      // ---------------------------------------------
      // PUT REQUEST
      // ---------------------------------------------

      const response = await axios.put(
        `${API_URL}/tbl_question/${id}`,
        updatedQuestion,
      );

      console.log("Update response:", response.data);

      // ---------------------------------------------
      // UPDATE LOCAL STATE
      // ---------------------------------------------

      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          String(question.id) === String(id) ? response.data : question,
        ),
      );

      // ---------------------------------------------
      // SUCCESS ALERT
      // ---------------------------------------------

      alert("Question updated successfully.");

      handleCancelEdit();
    } catch (err) {
      console.error("Update error:", err);

      if (err.response) {
        alert(
          err.response.data?.message || "Server error while updating question.",
        );
      } else if (err.request) {
        alert("JSON Server is not running.");
      } else {
        alert(err.message || "Unable to update question.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const question = questions.find((item) => String(item.id) === String(id));

    if (!question) {
      alert("Question not found.");

      return;
    }

    if (!isExamAllowed(question.exam_id)) {
      alert("You can only delete questions from your assigned subjects.");

      return;
    }

    // ---------------------------------------------
    // CONFIRM
    // ---------------------------------------------

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      await axios.delete(`${API_URL}/tbl_question/${id}`);

      // ---------------------------------------------
      // REMOVE FROM STATE
      // ---------------------------------------------

      setQuestions((prevQuestions) =>
        prevQuestions.filter((item) => String(item.id) !== String(id)),
      );

      // ---------------------------------------------
      // SUCCESS ALERT
      // ---------------------------------------------

      alert("Question deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);

      if (err.response) {
        alert(
          err.response.data?.message || "Server error while deleting question.",
        );
      } else if (err.request) {
        alert("JSON Server is not running.");
      } else {
        alert(err.message || "Unable to delete question.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredQuestions = questions.filter((question) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      question.question?.toLowerCase().includes(search) ||
      question.option_a?.toLowerCase().includes(search) ||
      question.option_b?.toLowerCase().includes(search) ||
      question.option_c?.toLowerCase().includes(search) ||
      question.option_d?.toLowerCase().includes(search);

    const matchesExam =
      selectedExam === "all" ||
      String(question.exam_id) === String(selectedExam);

    return matchesSearch && matchesExam;
  });

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeQuestionModal = () => {
    if (!loading) {
      setShowAddQuestion(false);
    }
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <>
      <FacultySider />

      <Header />

      <div className="manage-question">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="page-header">
          <div>
            <h1>Manage Questions</h1>

            <p>View, add, edit and manage your exam questions.</p>

            {subjects.length > 0 && (
              <div className="assigned-subject">
                Assigned Subjects:
                {subjects.map((subject) => (
                  <strong key={subject.id}> {subject.subject_name}</strong>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="add-question-btn"
            onClick={handleAddQuestion}
            disabled={loading || subjects.length === 0 || exams.length === 0}
          >
            <span className="plus-icon">+</span>
            Add Question
          </button>
        </div>

        {/* =================================================
            QUESTION LIST
        ================================================= */}

        <div className="question-list-card">
          <div className="list-header">
            <div>
              <h2>Question List</h2>

              <span className="question-total">
                {questions.length} questions found
              </span>
            </div>

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="filters">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* =================================================
                  EXAM FILTER
              ================================================= */}

              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
              >
                <option value="all">All Exams</option>

                {exams.map((exam) => {
                  const subject = getSubject(exam.subject_id);

                  return (
                    <option key={exam.id} value={exam.id}>
                      {subject?.subject_name || "Unknown Subject"} - {exam.date}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && questions.length === 0 ? (
            <div className="loading">Loading questions...</div>
          ) : filteredQuestions.length === 0 ? (
            <div className="no-data">
              {questions.length === 0
                ? "No questions available for your assigned subjects."
                : "No questions found."}
            </div>
          ) : (
            /* =================================================
               TABLE
            ================================================= */

            <div className="question-table-wrapper">
              <table className="question-table">
                <thead>
                  <tr>
                    <th>#</th>

                    <th>Question</th>

                    <th>Options</th>

                    <th>Correct</th>

                    <th>Marks</th>

                    <th>Exam Details</th>

                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredQuestions.map((question, index) => {
                    const exam = getExam(question.exam_id);

                    const subject = exam ? getSubject(exam.subject_id) : null;

                    const isTrueFalse = question.question_type === "True/False";

                    const isEditing = String(editingId) === String(question.id);

                    return (
                      <tr key={question.id}>
                        {/* NUMBER */}

                        <td>{index + 1}</td>

                        {/* QUESTION */}

                        <td>
                          {isEditing ? (
                            <div className="inline-edit-question">
                              <textarea
                                name="question"
                                value={editQuestion.question}
                                onChange={handleEditChange}
                                rows="4"
                                className="inline-edit-textarea"
                              />

                              <select
                                name="question_type"
                                value={editQuestion.question_type}
                                onChange={handleEditChange}
                                className="inline-edit-select"
                              >
                                <option value="MCQ">MCQ</option>

                                <option value="True/False">True / False</option>
                              </select>
                            </div>
                          ) : (
                            <>
                              <div className="question-text">
                                {question.question}
                              </div>

                              <span className="type-badge">
                                {question.question_type || "MCQ"}
                              </span>
                            </>
                          )}
                        </td>

                        {/* OPTIONS */}

                        <td>
                          {isEditing ? (
                            editQuestion.question_type === "MCQ" ? (
                              <div className="inline-options">
                                <input
                                  type="text"
                                  name="option_a"
                                  value={editQuestion.option_a}
                                  onChange={handleEditChange}
                                  placeholder="Option A"
                                  className="inline-edit-input"
                                />

                                <input
                                  type="text"
                                  name="option_b"
                                  value={editQuestion.option_b}
                                  onChange={handleEditChange}
                                  placeholder="Option B"
                                  className="inline-edit-input"
                                />

                                <input
                                  type="text"
                                  name="option_c"
                                  value={editQuestion.option_c}
                                  onChange={handleEditChange}
                                  placeholder="Option C"
                                  className="inline-edit-input"
                                />

                                <input
                                  type="text"
                                  name="option_d"
                                  value={editQuestion.option_d}
                                  onChange={handleEditChange}
                                  placeholder="Option D"
                                  className="inline-edit-input"
                                />
                              </div>
                            ) : (
                              <div className="inline-tf-options">
                                <input
                                  type="text"
                                  value="True"
                                  disabled
                                  className="inline-edit-input"
                                />

                                <input
                                  type="text"
                                  value="False"
                                  disabled
                                  className="inline-edit-input"
                                />
                              </div>
                            )
                          ) : (
                            <div className="options-list">
                              <div>
                                <strong>A.</strong> {question.option_a}
                              </div>

                              <div>
                                <strong>B.</strong> {question.option_b}
                              </div>

                              {!isTrueFalse && (
                                <>
                                  <div>
                                    <strong>C.</strong> {question.option_c}
                                  </div>

                                  <div>
                                    <strong>D.</strong> {question.option_d}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </td>

                        {/* CORRECT ANSWER */}

                        <td>
                          {isEditing ? (
                            <select
                              name="correct_answer"
                              value={editQuestion.correct_answer}
                              onChange={handleEditChange}
                              className="inline-edit-select"
                            >
                              <option value="">Select</option>

                              {editQuestion.question_type === "MCQ" ? (
                                <>
                                  <option value="A">A</option>

                                  <option value="B">B</option>

                                  <option value="C">C</option>

                                  <option value="D">D</option>
                                </>
                              ) : (
                                <>
                                  <option value="True">True</option>

                                  <option value="False">False</option>
                                </>
                              )}
                            </select>
                          ) : (
                            <span className="correct-badge">
                              {question.correct_answer}
                            </span>
                          )}
                        </td>

                        {/* MARKS */}

                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              name="marks"
                              min="1"
                              value={editQuestion.marks}
                              onChange={handleEditChange}
                              className="inline-marks-input"
                            />
                          ) : (
                            <span className="marks-badge">
                              {question.marks}
                            </span>
                          )}
                        </td>

                        {/* EXAM */}

                        <td>
                          {exam ? (
                            <div className="exam-info">
                              <strong>
                                {subject?.subject_name || "Unknown Subject"}
                              </strong>

                              <span>Date: {exam.date}</span>

                              <span>
                                Time: {exam.start_time} - {exam.end_time}
                              </span>

                              <span>Total Marks: {exam.total_marks}</span>
                            </div>
                          ) : (
                            <span>Exam not found</span>
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="action-buttons">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  className="save-btn"
                                  onClick={() => handleSaveEdit(question.id)}
                                  disabled={loading}
                                >
                                  {loading ? "Saving..." : "Save"}
                                </button>

                                <button
                                  type="button"
                                  className="cancel-edit-btn"
                                  onClick={handleCancelEdit}
                                  disabled={loading}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="edit-btn"
                                  onClick={() => handleEdit(question)}
                                  disabled={loading}
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  className="delete-btn"
                                  onClick={() => handleDelete(question.id)}
                                  disabled={loading}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="result-summary">
            Showing <strong>{filteredQuestions.length}</strong> of{" "}
            <strong>{questions.length}</strong> questions
          </div>
        </div>
      </div>

      {/* =================================================
          ADD QUESTION MODAL
      ================================================= */}

      {showAddQuestion && (
        <AddQuestion
          exams={exams}
          subjects={subjects}
          editingQuestion={null}
          onClose={closeQuestionModal}
          onSubmit={handleSaveQuestion}
          loading={loading}
        />
      )}

      <Footer />
    </>
  );
}
