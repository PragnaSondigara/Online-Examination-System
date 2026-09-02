import React, { useEffect, useState } from "react";
import "./ManageQuestion.css";

import FacultySider from "./FacultySider";
import Header from "./Header";
import Footer from "./Footer";

import AddQuestion from "./AddQuestion";

const API_URL = "http://localhost:5000";

export default function ManageQuestion() {
  // =========================================================
  // STATES
  // =========================================================

  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [facultyId, setFacultyId] = useState(null);
  const [assignedSubject, setAssignedSubject] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState("all");

  // Modal
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  // Edit
  const [editingQuestion, setEditingQuestion] = useState(null);

  // =========================================================
  // GET LOGGED-IN FACULTY
  // =========================================================

  useEffect(() => {
    const storedFacultyId = localStorage.getItem("facultyId");

    if (!storedFacultyId) {
      setError("Faculty login session not found. Please login again.");
      return;
    }

    const loggedInFacultyId = Number(storedFacultyId);

    if (isNaN(loggedInFacultyId)) {
      setError("Invalid faculty login session.");
      return;
    }

    setFacultyId(loggedInFacultyId);

    fetchData(loggedInFacultyId);
  }, []);

  // =========================================================
  // FETCH DATA
  // =========================================================

  const fetchData = async (loggedInFacultyId = facultyId) => {
    try {
      setLoading(true);
      setError("");

      if (!loggedInFacultyId) {
        throw new Error("Faculty ID not found.");
      }

      const [
        questionsResponse,
        examsResponse,
        subjectsResponse,
        facultiesResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/tbl_question`),
        fetch(`${API_URL}/tbl_exam`),
        fetch(`${API_URL}/tbl_subject`),
        fetch(`${API_URL}/tbl_faculty`),
      ]);

      if (
        !questionsResponse.ok ||
        !examsResponse.ok ||
        !subjectsResponse.ok ||
        !facultiesResponse.ok
      ) {
        throw new Error("Failed to fetch data.");
      }

      const questionsData = await questionsResponse.json();
      const examsData = await examsResponse.json();
      const subjectsData = await subjectsResponse.json();
      const facultiesData = await facultiesResponse.json();

      // =====================================================
      // FIND FACULTY
      // =====================================================

      const loggedInFaculty = facultiesData.find(
        (faculty) => Number(faculty.faculty_id) === Number(loggedInFacultyId),
      );

      if (!loggedInFaculty) {
        throw new Error("Faculty account not found.");
      }

      if (loggedInFaculty.is_active !== true) {
        setQuestions([]);
        setExams([]);
        setSubjects([]);
        setFaculties([]);
        setAssignedSubject(null);

        throw new Error(
          "Your faculty account is inactive. Please contact administrator.",
        );
      }

      setFaculties([loggedInFaculty]);

      // =====================================================
      // FIND ASSIGNED SUBJECT
      // =====================================================

      const subject = subjectsData.find(
        (item) =>
          Number(item.faculty_id) === Number(loggedInFacultyId) &&
          item.is_active === true,
      );

      if (!subject) {
        setQuestions([]);
        setExams([]);
        setSubjects([]);
        setAssignedSubject(null);

        throw new Error("No active subject is assigned to this faculty.");
      }

      setAssignedSubject(subject);
      setSubjects([subject]);

      // =====================================================
      // FACULTY EXAMS
      // =====================================================

      const facultyExams = examsData.filter(
        (exam) =>
          Number(exam.faculty_id) === Number(loggedInFacultyId) &&
          Number(exam.subject_id) === Number(subject.subject_id),
      );

      setExams(facultyExams);

      // =====================================================
      // FACULTY QUESTIONS
      // =====================================================

      const facultyExamIds = facultyExams.map((exam) => String(exam.id));

      const facultyQuestions = questionsData.filter((question) =>
        facultyExamIds.includes(String(question.exam_id)),
      );

      setQuestions(facultyQuestions);

      setSelectedExam("all");
    } catch (err) {
      console.error(err);

      setError(err.message || "Unable to load data. Please check JSON Server.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // GET EXAM
  // =========================================================

  const getExam = (examId) => {
    return exams.find((exam) => String(exam.id) === String(examId));
  };

  // =========================================================
  // GET SUBJECT
  // =========================================================

  const getSubject = (subjectId) => {
    return subjects.find(
      (subject) => String(subject.subject_id) === String(subjectId),
    );
  };

  // =========================================================
  // GET FACULTY
  // =========================================================

  const getFaculty = (facultyId) => {
    return faculties.find(
      (faculty) => String(faculty.faculty_id) === String(facultyId),
    );
  };

  // =========================================================
  // CHECK EXAM OWNERSHIP
  // =========================================================

  const isExamAllowed = (examId) => {
    const exam = getExam(examId);

    if (!exam || !assignedSubject || !facultyId) {
      return false;
    }

    return (
      Number(exam.faculty_id) === Number(facultyId) &&
      Number(exam.subject_id) === Number(assignedSubject.subject_id)
    );
  };

  // =========================================================
  // OPEN ADD MODAL
  // =========================================================

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setError("");
    setMessage("");
    setShowAddQuestion(true);
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const handleEdit = (question) => {
    setError("");
    setMessage("");

    if (!isExamAllowed(question.exam_id)) {
      setError("You can only edit questions from your assigned subject.");
      return;
    }

    setEditingQuestion(question);
    setShowAddQuestion(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeQuestionModal = () => {
    setShowAddQuestion(false);
    setEditingQuestion(null);
  };

  // =========================================================
  // SAVE QUESTION
  // =========================================================

  const handleSaveQuestion = async (formData) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      // =====================================================
      // UPDATE
      // =====================================================

      if (editingQuestion) {
        if (!isExamAllowed(editingQuestion.exam_id)) {
          throw new Error("You are not allowed to edit this question.");
        }

        if (!isExamAllowed(formData.exam_id)) {
          throw new Error(
            "You cannot move this question to another faculty's exam.",
          );
        }

        const updatedQuestion = {
          ...editingQuestion,

          exam_id: Number(formData.exam_id),

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

        const response = await fetch(
          `${API_URL}/tbl_question/${editingQuestion.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedQuestion),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to update question.");
        }

        setMessage("Question updated successfully.");
      }

      // =====================================================
      // ADD
      // =====================================================
      else {
        const maxQuestionId =
          questions.length > 0
            ? Math.max(...questions.map((q) => Number(q.question_id) || 0))
            : 0;

        const newQuestion = {
          question_id: maxQuestionId + 1,

          exam_id: Number(formData.exam_id),

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

        const response = await fetch(`${API_URL}/tbl_question`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newQuestion),
        });

        if (!response.ok) {
          throw new Error("Failed to add question.");
        }

        setMessage("Question added successfully.");
      }

      closeQuestionModal();

      await fetchData(facultyId);
    } catch (err) {
      console.error(err);

      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    setError("");
    setMessage("");

    const question = questions.find((item) => String(item.id) === String(id));

    if (!question) {
      setError("Question not found.");
      return;
    }

    if (!isExamAllowed(question.exam_id)) {
      setError("You can only delete questions from your assigned subject.");
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

      const response = await fetch(`${API_URL}/tbl_question/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete question.");
      }

      setMessage("Question deleted successfully.");

      await fetchData(facultyId);
    } catch (err) {
      console.error(err);

      setError(err.message || "Unable to delete question.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FILTER
  // =========================================================

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

  // =========================================================
  // JSX
  // =========================================================

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

            <p>View, add, edit and manage exam questions.</p>

            {assignedSubject && (
              <div className="assigned-subject">
                Assigned Subject:{" "}
                <strong>{assignedSubject.subject_name}</strong>
              </div>
            )}

            {facultyId && faculties.length > 0 && (
              <div className="faculty-name">
                Faculty: <strong>{faculties[0]?.faculty_name}</strong>
              </div>
            )}
          </div>

          {/* ADD BUTTON */}

          <button
            type="button"
            className="add-question-btn"
            onClick={handleAddQuestion}
            disabled={loading || !assignedSubject || exams.length === 0}
          >
            <span className="plus-icon">+</span>
            Add Question
          </button>
        </div>

        {/* =================================================
            MESSAGES
        ================================================= */}

        {message && (
          <div className="success-message">
            <span>{message}</span>

            <button type="button" onClick={() => setMessage("")}>
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span>{error}</span>

            <button type="button" onClick={() => setError("")}>
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

          {/* =================================================
              TABLE
          ================================================= */}

          {loading && questions.length === 0 ? (
            <div className="loading">Loading questions...</div>
          ) : filteredQuestions.length === 0 ? (
            <div className="no-data">
              {questions.length === 0
                ? "No questions available for your assigned subject."
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

                    const faculty = exam ? getFaculty(exam.faculty_id) : null;

                    const isTrueFalse = question.question_type === "True/False";

                    return (
                      <tr key={question.id}>
                        <td>{question.question_id || index + 1}</td>

                        <td>
                          <div className="question-text">
                            {question.question}
                          </div>

                          <span className="type-badge">
                            {question.question_type || "MCQ"}
                          </span>
                        </td>

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

                        <td>
                          <span className="correct-badge">
                            {question.correct_answer}
                          </span>
                        </td>

                        <td>
                          <span className="marks-badge">{question.marks}</span>
                        </td>

                        <td>
                          {exam ? (
                            <div className="exam-info">
                              <strong>
                                {subject?.subject_name || "Unknown Subject"}
                              </strong>

                              <span>{exam.date}</span>

                              <span>
                                {exam.start_time} - {exam.end_time}
                              </span>

                              {faculty && (
                                <small>Faculty: {faculty.faculty_name}</small>
                              )}
                            </div>
                          ) : (
                            <span>Exam not found</span>
                          )}
                        </td>

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

          <div className="result-summary">
            Showing <strong>{filteredQuestions.length}</strong> of{" "}
            <strong>{questions.length}</strong> questions
          </div>
        </div>
      </div>

      {/* =====================================================
          ADD / EDIT QUESTION MODAL
      ===================================================== */}

      {showAddQuestion && (
        <AddQuestion
          exams={exams}
          subjects={subjects}
          assignedSubject={assignedSubject}
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
