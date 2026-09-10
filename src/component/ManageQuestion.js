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
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState("all");

  // Add question modal only
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  // =====================================================
  // INLINE EDIT STATE
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
    marks: 2,
    question_type: "MCQ",
  });

  // =====================================================
  // GET LOGGED-IN FACULTY ID
  // =====================================================

  useEffect(() => {
    const storedFacultyId = localStorage.getItem("facultyId");

    if (!storedFacultyId) {
      setError("Faculty login session not found. Please login again.");
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
      setError("");

      // -------------------------------------------------
      // 1. GET FACULTY
      // -------------------------------------------------

      const facultyResponse = await axios.get(
        `${API_URL}/tbl_faculty/${loggedFacultyId}`,
      );

      const faculty = facultyResponse.data;

      if (faculty.is_active !== true) {
        throw new Error(
          "Your faculty account is inactive. Please contact administrator.",
        );
      }

      // -------------------------------------------------
      // 2. GET SUBJECTS
      // -------------------------------------------------

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

        throw new Error("No subject is assigned to this faculty.");
      }

      setSubjects(facultySubjects);

      // -------------------------------------------------
      // 3. GET EXAMS
      // -------------------------------------------------

      const examResponse = await axios.get(`${API_URL}/tbl_exam`);

      const allExams = examResponse.data;

      const facultySubjectIds = facultySubjects.map((subject) =>
        String(subject.id),
      );

      const facultyExams = allExams.filter((exam) => {
        const correctFaculty =
          String(exam.faculty_id) === String(faculty.id);

        const correctSubject = facultySubjectIds.includes(
          String(exam.subject_id),
        );

        return correctFaculty && correctSubject;
      });

      setExams(facultyExams);

      // -------------------------------------------------
      // 4. GET QUESTIONS
      // -------------------------------------------------

      const questionResponse = await axios.get(
        `${API_URL}/tbl_question`,
      );

      const allQuestions = questionResponse.data;

      const facultyExamIds = facultyExams.map((exam) =>
        String(exam.id),
      );

      const facultyQuestions = allQuestions.filter((question) =>
        facultyExamIds.includes(String(question.exam_id)),
      );

      setQuestions(facultyQuestions);

      setSelectedExam("all");
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(
          err.response.data?.message ||
            "Server error. Unable to load data.",
        );
      } else if (err.request) {
        setError(
          "JSON Server is not running. Please start JSON Server.",
        );
      } else {
        setError(
          err.message ||
            "Unable to load data. Check JSON Server.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET EXAM
  // =====================================================

  const getExam = (examId) => {
    return exams.find(
      (exam) => String(exam.id) === String(examId),
    );
  };

  // =====================================================
  // GET SUBJECT
  // =====================================================

  const getSubject = (subjectId) => {
    return subjects.find(
      (subject) => String(subject.id) === String(subjectId),
    );
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
      (subject) =>
        String(subject.id) === String(exam.subject_id),
    );

    return subjectExists;
  };

  // =====================================================
  // ADD QUESTION
  // =====================================================

  const handleAddQuestion = () => {
    setMessage("");
    setError("");

    setShowAddQuestion(true);
  };

  // =====================================================
  // START INLINE EDIT
  // =====================================================

  const handleEdit = (question) => {
    setMessage("");
    setError("");

    // Security check
    if (!isExamAllowed(question.exam_id)) {
      setError(
        "You can only edit questions from your assigned subjects.",
      );

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
      marks:
        question.marks !== undefined
          ? question.marks
          : 2,
      question_type:
        question.question_type || "MCQ",
    });
  };

  // =====================================================
  // HANDLE INLINE INPUT
  // =====================================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    // Question type changed
    if (name === "question_type") {
      setEditQuestion((prev) => ({
        ...prev,
        question_type: value,

        // Clear MCQ values when changing type
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",

        correct_answer: "",
      }));

      setError("");

      return;
    }

    setEditQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =====================================================
  // CANCEL INLINE EDIT
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
      marks: 2,
      question_type: "MCQ",
    });

    setError("");
  };

  // =====================================================
  // VALIDATE EDIT
  // =====================================================

  const validateEditQuestion = () => {
    if (!editQuestion.exam_id) {
      setError("Please select an exam.");
      return false;
    }

    if (!editQuestion.question.trim()) {
      setError("Please enter the question.");
      return false;
    }

    if (
      editQuestion.marks === "" ||
      Number(editQuestion.marks) <= 0
    ) {
      setError("Marks must be greater than 0.");
      return false;
    }

    // MCQ validation
    if (editQuestion.question_type === "MCQ") {
      if (!editQuestion.option_a.trim()) {
        setError("Please enter Option A.");
        return false;
      }

      if (!editQuestion.option_b.trim()) {
        setError("Please enter Option B.");
        return false;
      }

      if (!editQuestion.option_c.trim()) {
        setError("Please enter Option C.");
        return false;
      }

      if (!editQuestion.option_d.trim()) {
        setError("Please enter Option D.");
        return false;
      }

      if (
        !["A", "B", "C", "D"].includes(
          editQuestion.correct_answer,
        )
      ) {
        setError("Please select the correct answer.");
        return false;
      }
    }

    // True / False validation
    if (editQuestion.question_type === "True/False") {
      if (
        !["True", "False"].includes(
          editQuestion.correct_answer,
        )
      ) {
        setError("Please select True or False.");
        return false;
      }
    }

    return true;
  };

  // =====================================================
  // SAVE INLINE EDIT
  // =====================================================

  const handleSaveEdit = async (id) => {
    setMessage("");
    setError("");

    if (!validateEditQuestion()) {
      return;
    }

    // Security check
    if (!isExamAllowed(editQuestion.exam_id)) {
      setError(
        "You can only update questions from your assigned subjects.",
      );

      return;
    }

    try {
      setLoading(true);

      const oldQuestion = questions.find(
        (item) => String(item.id) === String(id),
      );

      if (!oldQuestion) {
        throw new Error("Question not found.");
      }

      // -------------------------------------------------
      // CREATE UPDATED QUESTION
      // -------------------------------------------------

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

      // -------------------------------------------------
      // UPDATE JSON SERVER
      // -------------------------------------------------

      const response = await axios.put(
        `${API_URL}/tbl_question/${id}`,
        updatedQuestion,
      );

      if (response.status !== 200) {
        throw new Error("Failed to update question.");
      }

      // -------------------------------------------------
      // UPDATE TABLE DIRECTLY
      // -------------------------------------------------

      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          String(question.id) === String(id)
            ? updatedQuestion
            : question,
        ),
      );

      setMessage("Question updated successfully.");

      // Exit edit mode
      handleCancelEdit();
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(
          err.response.data?.message ||
            "Server error. Unable to update question.",
        );
      } else if (err.request) {
        setError("JSON Server is not running.");
      } else {
        setError(
          err.message ||
            "Unable to update question.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ADD QUESTION FROM MODAL
  // =====================================================

  const handleSaveQuestion = async (formData) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      if (!formData.exam_id) {
        throw new Error("Please select an exam.");
      }

      if (!isExamAllowed(formData.exam_id)) {
        throw new Error(
          "You can only add questions to your assigned subjects.",
        );
      }

      const newQuestion = {
        exam_id: formData.exam_id,

        question: formData.question.trim(),

        option_a:
          formData.question_type === "MCQ"
            ? formData.option_a.trim()
            : "True",

        option_b:
          formData.question_type === "MCQ"
            ? formData.option_b.trim()
            : "False",

        option_c:
          formData.question_type === "MCQ"
            ? formData.option_c.trim()
            : "",

        option_d:
          formData.question_type === "MCQ"
            ? formData.option_d.trim()
            : "",

        correct_answer: formData.correct_answer,

        marks: Number(formData.marks),

        question_type: formData.question_type,
      };

      const response = await axios.post(
        `${API_URL}/tbl_question`,
        newQuestion,
      );

      if (response.status !== 201) {
        throw new Error("Failed to add question.");
      }

      setMessage("Question added successfully.");

      setShowAddQuestion(false);

      await fetchData(facultyId);
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(
          err.response.data?.message ||
            "Server error.",
        );
      } else if (err.request) {
        setError("JSON Server is not running.");
      } else {
        setError(
          err.message ||
            "Something went wrong.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CLOSE ADD MODAL
  // =====================================================

  const closeQuestionModal = () => {
    setShowAddQuestion(false);
  };

  // =====================================================
  // DELETE QUESTION
  // =====================================================

  const handleDelete = async (id) => {
    setMessage("");
    setError("");

    const question = questions.find(
      (item) => String(item.id) === String(id),
    );

    if (!question) {
      setError("Question not found.");
      return;
    }

    if (!isExamAllowed(question.exam_id)) {
      setError(
        "You can only delete questions from your assigned subjects.",
      );

      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.delete(
        `${API_URL}/tbl_question/${id}`,
      );

      if (response.status !== 200) {
        throw new Error("Failed to delete question.");
      }

      setQuestions((prevQuestions) =>
        prevQuestions.filter(
          (item) => String(item.id) !== String(id),
        ),
      );

      setMessage("Question deleted successfully.");
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(
          err.response.data?.message ||
            "Server error.",
        );
      } else if (err.request) {
        setError("JSON Server is not running.");
      } else {
        setError(
          err.message ||
            "Unable to delete question.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredQuestions = questions.filter(
    (question) => {
      const search = searchTerm
        .toLowerCase()
        .trim();

      const matchesSearch =
        !search ||
        question.question
          ?.toLowerCase()
          .includes(search) ||
        question.option_a
          ?.toLowerCase()
          .includes(search) ||
        question.option_b
          ?.toLowerCase()
          .includes(search) ||
        question.option_c
          ?.toLowerCase()
          .includes(search) ||
        question.option_d
          ?.toLowerCase()
          .includes(search);

      const matchesExam =
        selectedExam === "all" ||
        String(question.exam_id) ===
          String(selectedExam);

      return matchesSearch && matchesExam;
    },
  );

  // =====================================================
  // JSX
  // =====================================================

  return (
    <>
      <FacultySider />

      <Header />

      <div className="manage-question">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="page-header">

          <div>

            <h1>Manage Questions</h1>

            <p>
              View, add, edit and manage your exam questions.
            </p>

            {subjects.length > 0 && (
              <div className="assigned-subject">

                Assigned Subjects:

                {subjects.map((subject) => (
                  <strong key={subject.id}>
                    {" "}
                    {subject.subject_name}
                  </strong>
                ))}

              </div>
            )}

          </div>

          <button
            type="button"
            className="add-question-btn"
            onClick={handleAddQuestion}
            disabled={
              loading ||
              subjects.length === 0 ||
              exams.length === 0
            }
          >
            <span className="plus-icon">+</span>
            Add Question
          </button>

        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (
          <div className="success-message">

            <span>{message}</span>

            <button
              type="button"
              onClick={() => setMessage("")}
            >
              ×
            </button>

          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="error-message">

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
            >
              ×
            </button>

          </div>
        )}

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

            <div className="filters">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

              <select
                value={selectedExam}
                onChange={(e) =>
                  setSelectedExam(e.target.value)
                }
              >

                <option value="all">
                  All Exams
                </option>

                {exams.map((exam) => {

                  const subject =
                    getSubject(exam.subject_id);

                  return (
                    <option
                      key={exam.id}
                      value={exam.id}
                    >
                      {subject?.subject_name ||
                        "Unknown Subject"}{" "}
                      - {exam.date}
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

            <div className="loading">
              Loading questions...
            </div>

          ) : filteredQuestions.length === 0 ? (

            <div className="no-data">

              {questions.length === 0
                ? "No questions available for your assigned subjects."
                : "No questions found."}

            </div>

          ) : (

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

                  {filteredQuestions.map(
                    (question, index) => {

                      const exam =
                        getExam(question.exam_id);

                      const subject = exam
                        ? getSubject(exam.subject_id)
                        : null;

                      const isTrueFalse =
                        question.question_type ===
                        "True/False";

                      const isEditing =
                        String(editingId) ===
                        String(question.id);

                      return (

                        <tr key={question.id}>

                          {/* NUMBER */}

                          <td>
                            {index + 1}
                          </td>

                          {/* =================================================
                              QUESTION
                          ================================================= */}

                          <td>

                            {isEditing ? (

                              <div className="inline-edit-question">

                                <textarea
                                  name="question"
                                  value={
                                    editQuestion.question
                                  }
                                  onChange={
                                    handleEditChange
                                  }
                                  rows="4"
                                  className="inline-edit-textarea"
                                />

                                <select
                                  name="question_type"
                                  value={
                                    editQuestion.question_type
                                  }
                                  onChange={
                                    handleEditChange
                                  }
                                  className="inline-edit-select"
                                >

                                  <option value="MCQ">
                                    MCQ
                                  </option>

                                  <option value="True/False">
                                    True / False
                                  </option>

                                </select>

                              </div>

                            ) : (

                              <>

                                <div className="question-text">
                                  {question.question}
                                </div>

                                <span className="type-badge">
                                  {question.question_type ||
                                    "MCQ"}
                                </span>

                              </>

                            )}

                          </td>

                          {/* =================================================
                              OPTIONS
                          ================================================= */}

                          <td>

                            {isEditing ? (

                              editQuestion.question_type ===
                              "MCQ" ? (

                                <div className="inline-options">

                                  <input
                                    type="text"
                                    name="option_a"
                                    value={
                                      editQuestion.option_a
                                    }
                                    onChange={
                                      handleEditChange
                                    }
                                    placeholder="Option A"
                                    className="inline-edit-input"
                                  />

                                  <input
                                    type="text"
                                    name="option_b"
                                    value={
                                      editQuestion.option_b
                                    }
                                    onChange={
                                      handleEditChange
                                    }
                                    placeholder="Option B"
                                    className="inline-edit-input"
                                  />

                                  <input
                                    type="text"
                                    name="option_c"
                                    value={
                                      editQuestion.option_c
                                    }
                                    onChange={
                                      handleEditChange
                                    }
                                    placeholder="Option C"
                                    className="inline-edit-input"
                                  />

                                  <input
                                    type="text"
                                    name="option_d"
                                    value={
                                      editQuestion.option_d
                                    }
                                    onChange={
                                      handleEditChange
                                    }
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
                                  <strong>A.</strong>{" "}
                                  {question.option_a}
                                </div>

                                <div>
                                  <strong>B.</strong>{" "}
                                  {question.option_b}
                                </div>

                                {!isTrueFalse && (
                                  <>

                                    <div>
                                      <strong>C.</strong>{" "}
                                      {question.option_c}
                                    </div>

                                    <div>
                                      <strong>D.</strong>{" "}
                                      {question.option_d}
                                    </div>

                                  </>
                                )}

                              </div>

                            )}

                          </td>

                          {/* =================================================
                              CORRECT ANSWER
                          ================================================= */}

                          <td>

                            {isEditing ? (

                              <select
                                name="correct_answer"
                                value={
                                  editQuestion.correct_answer
                                }
                                onChange={
                                  handleEditChange
                                }
                                className="inline-edit-select"
                              >

                                {editQuestion.question_type ===
                                "MCQ" ? (

                                  <>
                                    <option value="">
                                      Select
                                    </option>

                                    <option value="A">
                                      A
                                    </option>

                                    <option value="B">
                                      B
                                    </option>

                                    <option value="C">
                                      C
                                    </option>

                                    <option value="D">
                                      D
                                    </option>
                                  </>

                                ) : (

                                  <>
                                    <option value="">
                                      Select
                                    </option>

                                    <option value="True">
                                      True
                                    </option>

                                    <option value="False">
                                      False
                                    </option>
                                  </>

                                )}

                              </select>

                            ) : (

                              <span className="correct-badge">
                                {question.correct_answer}
                              </span>

                            )}

                          </td>

                          {/* =================================================
                              MARKS
                          ================================================= */}

                          <td>

                            {isEditing ? (

                              <input
                                type="number"
                                name="marks"
                                min="1"
                                value={
                                  editQuestion.marks
                                }
                                onChange={
                                  handleEditChange
                                }
                                className="inline-marks-input"
                              />

                            ) : (

                              <span className="marks-badge">
                                {question.marks}
                              </span>

                            )}

                          </td>

                          {/* =================================================
                              EXAM DETAILS
                          ================================================= */}

                          <td>

                            {exam ? (

                              <div className="exam-info">

                                <strong>
                                  {subject?.subject_name ||
                                    "Unknown Subject"}
                                </strong>

                                <span>
                                  Date: {exam.date}
                                </span>

                                <span>
                                  Time:{" "}
                                  {exam.start_time} -{" "}
                                  {exam.end_time}
                                </span>

                                <span>
                                  Total Marks:{" "}
                                  {exam.total_marks}
                                </span>

                              </div>

                            ) : (

                              <span>
                                Exam not found
                              </span>

                            )}

                          </td>

                          {/* =================================================
                              ACTIONS
                          ================================================= */}

                          <td>

                            <div className="action-buttons">

                              {isEditing ? (

                                <>

                                  <button
                                    type="button"
                                    className="save-btn"
                                    onClick={() =>
                                      handleSaveEdit(
                                        question.id,
                                      )
                                    }
                                    disabled={loading}
                                  >
                                    {loading
                                      ? "Saving..."
                                      : "Save"}
                                  </button>

                                  <button
                                    type="button"
                                    className="cancel-edit-btn"
                                    onClick={
                                      handleCancelEdit
                                    }
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
                                    onClick={() =>
                                      handleEdit(
                                        question,
                                      )
                                    }
                                    disabled={loading}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() =>
                                      handleDelete(
                                        question.id,
                                      )
                                    }
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
                    },
                  )}

                </tbody>

              </table>

            </div>

          )}

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="result-summary">

            Showing{" "}
            <strong>
              {filteredQuestions.length}
            </strong>{" "}
            of{" "}
            <strong>
              {questions.length}
            </strong>{" "}
            questions

          </div>

        </div>

      </div>

      {/* =================================================
          ADD QUESTION MODAL
          
          IMPORTANT:
          This is ONLY for ADD.
          EDIT NO LONGER OPENS THIS.
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