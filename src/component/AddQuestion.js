import React, { useEffect, useState } from "react";
import "./AddQuestion.css";

const initialForm = {
  exam_id: "",
  question: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_answer: "",
  marks: 2,
  question_type: "MCQ",
};

export default function AddQuestion({
  exams = [],
  subjects = [],
  assignedSubject,
  editingQuestion,
  onClose,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD DATA FOR ADD / EDIT
  // =========================================================

  useEffect(() => {
    if (editingQuestion) {
      // Edit mode
      // Existing question data automatically comes into input fields

      setFormData({
        exam_id: editingQuestion.exam_id || "",
        question: editingQuestion.question || "",
        option_a: editingQuestion.option_a || "",
        option_b: editingQuestion.option_b || "",
        option_c: editingQuestion.option_c || "",
        option_d: editingQuestion.option_d || "",
        correct_answer: editingQuestion.correct_answer || "",
        marks: editingQuestion.marks !== undefined ? editingQuestion.marks : 1,
        question_type: editingQuestion.question_type || "MCQ",
      });
    } else {
      // Add mode
      setFormData(initialForm);
    }

    setError("");
  }, [editingQuestion]);

  // =========================================================
  // GET SUBJECT
  // =========================================================
  // IMPORTANT:
  // Your database has subject.id
  // It does NOT have subject.subject_id

  const getSubject = (subjectId) => {
    return subjects.find((subject) => String(subject.id) === String(subjectId));
  };

  // =========================================================
  // GET EXAM
  // =========================================================

  const getExam = (examId) => {
    return exams.find((exam) => String(exam.id) === String(examId));
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If question type changes
    if (name === "question_type") {
      setFormData((prev) => ({
        ...prev,

        question_type: value,

        // Clear options when type changes
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",

        // Clear correct answer
        correct_answer: "",
      }));

      setError("");

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    // Exam
    if (!formData.exam_id) {
      setError("Please select an exam.");
      return false;
    }

    // Question
    if (!formData.question.trim()) {
      setError("Please enter the question.");
      return false;
    }

    // Marks
    if (formData.marks === "" || Number(formData.marks) <= 0) {
      setError("Marks must be greater than 0.");
      return false;
    }

    // =======================================================
    // MCQ
    // =======================================================

    if (formData.question_type === "MCQ") {
      if (!formData.option_a.trim()) {
        setError("Please enter Option A.");
        return false;
      }

      if (!formData.option_b.trim()) {
        setError("Please enter Option B.");
        return false;
      }

      if (!formData.option_c.trim()) {
        setError("Please enter Option C.");
        return false;
      }

      if (!formData.option_d.trim()) {
        setError("Please enter Option D.");
        return false;
      }

      if (!["A", "B", "C", "D"].includes(formData.correct_answer)) {
        setError("Please select the correct answer.");
        return false;
      }
    }

    // =======================================================
    // TRUE / FALSE
    // =======================================================

    if (formData.question_type === "True/False") {
      if (!["True", "False"].includes(formData.correct_answer)) {
        setError("Please select True or False.");
        return false;
      }
    }

    return true;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    // Send form data to parent component
    onSubmit({
      ...formData,

      // Convert marks to number
      marks: Number(formData.marks),
    });
  };

  // =========================================================
  // RESET
  // =========================================================

  const handleReset = () => {
    if (editingQuestion) {
      // Reset to original edit data

      setFormData({
        exam_id: editingQuestion.exam_id || "",
        question: editingQuestion.question || "",
        option_a: editingQuestion.option_a || "",
        option_b: editingQuestion.option_b || "",
        option_c: editingQuestion.option_c || "",
        option_d: editingQuestion.option_d || "",
        correct_answer: editingQuestion.correct_answer || "",
        marks: editingQuestion.marks !== undefined ? editingQuestion.marks : 1,
        question_type: editingQuestion.question_type || "MCQ",
      });
    } else {
      // Reset add form

      setFormData(initialForm);
    }

    setError("");
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div
      className="question-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="question-modal">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="question-modal-header">
          <div>
            <h2>{editingQuestion ? "Edit Question" : "Add Question"}</h2>

            <p>
              {editingQuestion
                ? "Update question details below"
                : "Enter question details below"}
            </p>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form className="question-modal-form" onSubmit={handleSubmit}>
          {/* =================================================
              ERROR
          ================================================= */}

          {error && <div className="modal-error">{error}</div>}

          {/* =================================================
              EXAM
          ================================================= */}

          <div className="form-group">
            <label>
              Exam <span>*</span>
            </label>

            <select
              name="exam_id"
              value={formData.exam_id}
              onChange={handleChange}
              disabled={loading || exams.length === 0}
            >
              <option value="">Select Exam</option>

              {exams.map((exam) => {
                // exam.subject_id points to subject.id
                const subject = getSubject(exam.subject_id);

                return (
                  <option key={exam.id} value={exam.id}>
                    {subject?.subject_name || "Unknown Subject"} - {exam.date} (
                    {exam.start_time} - {exam.end_time})
                  </option>
                );
              })}
            </select>

            {exams.length === 0 && (
              <small className="form-help">
                No exams available for your assigned subject.
              </small>
            )}
          </div>

          {/* =================================================
              QUESTION TYPE + MARKS
          ================================================= */}

          <div className="modal-form-row">
            {/* QUESTION TYPE */}

            <div className="form-group">
              <label>Question Type</label>

              <select
                name="question_type"
                value={formData.question_type}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="MCQ">MCQ</option>

                <option value="True/False">True / False</option>
              </select>
            </div>

            {/* MARKS */}

            <div className="form-group">
              <label>
                Marks <span>*</span>
              </label>

              <input
                type="number"
                name="marks"
                min="1"
                value={formData.marks}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter marks"
              />
            </div>
          </div>

          {/* =================================================
              QUESTION
          ================================================= */}

          <div className="form-group">
            <label>
              Question <span>*</span>
            </label>

            <textarea
              name="question"
              rows="3"
              placeholder="Enter question..."
              value={formData.question}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* =================================================
              MCQ
          ================================================= */}

          {formData.question_type === "MCQ" ? (
            <>
              <div className="modal-options-grid">
                {/* OPTION A */}

                <div className="form-group">
                  <label>
                    Option A <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="option_a"
                    value={formData.option_a}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter option A"
                  />
                </div>

                {/* OPTION B */}

                <div className="form-group">
                  <label>
                    Option B <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="option_b"
                    value={formData.option_b}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter option B"
                  />
                </div>

                {/* OPTION C */}

                <div className="form-group">
                  <label>
                    Option C <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="option_c"
                    value={formData.option_c}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter option C"
                  />
                </div>

                {/* OPTION D */}

                <div className="form-group">
                  <label>
                    Option D <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="option_d"
                    value={formData.option_d}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter option D"
                  />
                </div>
              </div>

              {/* =================================================
                  CORRECT ANSWER
              ================================================= */}

              <div className="form-group">
                <label>
                  Correct Answer <span>*</span>
                </label>

                <div className="modal-answer-options">
                  {["A", "B", "C", "D"].map((answer) => (
                    <label
                      key={answer}
                      className={`modal-answer-option ${
                        formData.correct_answer === answer ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="correct_answer"
                        value={answer}
                        checked={formData.correct_answer === answer}
                        onChange={handleChange}
                        disabled={loading}
                      />

                      <span>Option {answer}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* =================================================
               TRUE / FALSE
            ================================================= */

            <div className="modal-tf-box">
              <label>
                Correct Answer <span>*</span>
              </label>

              <div className="modal-tf-options">
                {/* TRUE */}

                <label
                  className={`modal-answer-option ${
                    formData.correct_answer === "True" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="correct_answer"
                    value="True"
                    checked={formData.correct_answer === "True"}
                    onChange={handleChange}
                    disabled={loading}
                  />

                  <span>✓ True</span>
                </label>

                {/* FALSE */}

                <label
                  className={`modal-answer-option ${
                    formData.correct_answer === "False" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="correct_answer"
                    value="False"
                    checked={formData.correct_answer === "False"}
                    onChange={handleChange}
                    disabled={loading}
                  />

                  <span>✕ False</span>
                </label>
              </div>
            </div>
          )}

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="question-modal-footer">
            {/* CANCEL */}

            <button
              type="button"
              className="modal-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            {/* RESET */}

            <button
              type="button"
              className="modal-reset-btn"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>

            {/* ADD / UPDATE */}

            <button
              type="submit"
              className="modal-submit-btn"
              disabled={loading || !assignedSubject || exams.length === 0}
            >
              {loading
                ? "Saving..."
                : editingQuestion
                  ? "Update Question"
                  : "Add Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
