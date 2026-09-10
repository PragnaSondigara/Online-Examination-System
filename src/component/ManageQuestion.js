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

  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

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
        const correctFaculty = String(exam.faculty_id) === String(faculty.id);

        const correctSubject = facultySubjectIds.includes(
          String(exam.subject_id),
        );

        return correctFaculty && correctSubject;
      });

      setExams(facultyExams);

      // -------------------------------------------------
      // 4. GET QUESTIONS
      // -------------------------------------------------

      const questionResponse = await axios.get(`${API_URL}/tbl_question`);

      const allQuestions = questionResponse.data;

      const facultyExamIds = facultyExams.map((exam) => String(exam.id));

      const facultyQuestions = allQuestions.filter((question) =>
        facultyExamIds.includes(String(question.exam_id)),
      );

      setQuestions(facultyQuestions);

      setSelectedExam("all");
    } catch (err) {
      console.error(err);

      // Axios error handling
      if (err.response) {
        setError(
          err.response.data?.message || "Server error. Unable to load data.",
        );
      } else if (err.request) {
        setError("JSON Server is not running. Please start JSON Server.");
      } else {
        setError(err.message || "Unable to load data. Check JSON Server.");
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

    // Check faculty
    if (String(exam.faculty_id) !== String(facultyId)) {
      return false;
    }

    // Check subject
    const subjectExists = subjects.some(
      (subject) => String(subject.id) === String(exam.subject_id),
    );

    return subjectExists;
  };

  // =====================================================
  // ADD QUESTION
  // =====================================================

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setMessage("");
    setError("");

    setShowAddQuestion(true);
  };

  // =====================================================
  // EDIT QUESTION
  // =====================================================

  const handleEdit = (question) => {
    setMessage("");
    setError("");

    if (!isExamAllowed(question.exam_id)) {
      setError("You can only edit questions from your assigned subjects.");

      return;
    }

    setEditingQuestion(question);
    setShowAddQuestion(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeQuestionModal = () => {
    setShowAddQuestion(false);
    setEditingQuestion(null);
  };

  // =====================================================
  // SAVE QUESTION
  // =====================================================

  const handleSaveQuestion = async (formData) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      // Check exam
      if (!formData.exam_id) {
        throw new Error("Please select an exam.");
      }

      // Security check
      if (!isExamAllowed(formData.exam_id)) {
        throw new Error(
          "You can only add questions to your assigned subjects.",
        );
      }

      // =================================================
      // UPDATE
      // =================================================

      if (editingQuestion) {
        if (!isExamAllowed(editingQuestion.exam_id)) {
          throw new Error("You are not allowed to edit this question.");
        }

        const updatedQuestion = {
          ...editingQuestion,

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
            formData.question_type === "MCQ" ? formData.option_c.trim() : "",

          option_d:
            formData.question_type === "MCQ" ? formData.option_d.trim() : "",

          correct_answer: formData.correct_answer,

          marks: Number(formData.marks),

          question_type: formData.question_type,
        };

        // Axios PUT
        const response = await axios.put(
          `${API_URL}/tbl_question/${editingQuestion.id}`,
          updatedQuestion,
        );

        if (response.status !== 200) {
          throw new Error("Failed to update question.");
        }

        setMessage("Question updated successfully.");
      }

      // =================================================
      // ADD
      // =================================================
      else {
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
            formData.question_type === "MCQ" ? formData.option_c.trim() : "",

          option_d:
            formData.question_type === "MCQ" ? formData.option_d.trim() : "",

          correct_answer: formData.correct_answer,

          marks: Number(formData.marks),

          question_type: formData.question_type,
        };

        // Axios POST
        const response = await axios.post(
          `${API_URL}/tbl_question`,
          newQuestion,
        );

        if (response.status !== 201) {
          throw new Error("Failed to add question.");
        }

        setMessage("Question added successfully.");
      }

      closeQuestionModal();

      // Refresh data
      await fetchData(facultyId);
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(err.response.data?.message || "Server error.");
      } else if (err.request) {
        setError("JSON Server is not running.");
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE QUESTION
  // =====================================================

  const handleDelete = async (id) => {
    setMessage("");
    setError("");

    const question = questions.find((item) => String(item.id) === String(id));

    if (!question) {
      setError("Question not found.");
      return;
    }

    // Security check
    if (!isExamAllowed(question.exam_id)) {
      setError("You can only delete questions from your assigned subjects.");

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

      // Axios DELETE
      const response = await axios.delete(`${API_URL}/tbl_question/${id}`);

      if (response.status !== 200) {
        throw new Error("Failed to delete question.");
      }

      setMessage("Question deleted successfully.");

      // Refresh data
      await fetchData(facultyId);
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(err.response.data?.message || "Server error.");
      } else if (err.request) {
        setError("JSON Server is not running.");
      } else {
        setError(err.message || "Unable to delete question.");
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
  // JSX
  // =====================================================

  return (
    <>
      <FacultySider />

      <Header />

      <div className="manage-question">
        {/* PAGE HEADER */}

        <div className="page-header">
          <div>
            <h1>Manage Questions</h1>

            <p>View, add, edit and manage your exam questions.</p>

            {/* ASSIGNED SUBJECTS */}

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

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="success-message">
            <span>{message}</span>

            <button type="button" onClick={() => setMessage("")}>
              ×
            </button>
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="error-message">
            <span>{error}</span>

            <button type="button" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        {/* QUESTION LIST */}

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
                onChange={(e) => setSearchTerm(e.target.value)}
              />

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

          {/* LOADING */}

          {loading && questions.length === 0 ? (
            <div className="loading">Loading questions...</div>
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
                  {filteredQuestions.map((question, index) => {
                    const exam = getExam(question.exam_id);

                    const subject = exam ? getSubject(exam.subject_id) : null;

                    const isTrueFalse = question.question_type === "True/False";

                    return (
                      <tr key={question.id}>
                        {/* NUMBER */}

                        <td>{index + 1}</td>

                        {/* QUESTION */}

                        <td>
                          <div className="question-text">
                            {question.question}
                          </div>

                          <span className="type-badge">
                            {question.question_type || "MCQ"}
                          </span>
                        </td>

                        {/* OPTIONS */}

                        <td>
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
                        </td>

                        {/* CORRECT */}

                        <td>
                          <span className="correct-badge">
                            {question.correct_answer}
                          </span>
                        </td>

                        {/* MARKS */}

                        <td>
                          <span className="marks-badge">{question.marks}</span>
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
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* SUMMARY */}

          <div className="result-summary">
            Showing <strong>{filteredQuestions.length}</strong> of{" "}
            <strong>{questions.length}</strong> questions
          </div>
        </div>
      </div>

      {/* ADD / EDIT QUESTION MODAL */}

      {showAddQuestion && (
        <AddQuestion
          exams={exams}
          subjects={subjects}
          editingQuestion={editingQuestion}
          onClose={closeQuestionModal}
          onSubmit={handleSaveQuestion}
          loading={loading}
        />
      )}

      <Footer />
    </>
  );
}
