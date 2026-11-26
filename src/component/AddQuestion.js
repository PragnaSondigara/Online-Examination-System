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
  marks: 1,
  question_type: "MCQ",
};

export default function AddQuestion({
  exams = [],
  subjects = [],
  editingQuestion = null,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState(initialForm);

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    if (editingQuestion) {
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
      setFormData(initialForm);
    }
  }, [editingQuestion]);

  // =========================================================
  // GET SUBJECT
  // =========================================================

  const getSubject = (subjectId) => {
    return subjects.find((subject) => String(subject.id) === String(subjectId));
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "question_type") {
      setFormData((prev) => ({
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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    // Exam
    if (!formData.exam_id) {
      alert("Please select an exam.");
      return false;
    }

    // Question
    if (!formData.question.trim()) {
      alert("Please enter the question.");
      return false;
    }

    // Marks
    if (formData.marks === "" || Number(formData.marks) <= 0) {
      alert("Marks must be greater than 0.");
      return false;
    }

    // =======================================================
    // MCQ VALIDATION
    // =======================================================

    if (formData.question_type === "MCQ") {
      if (!formData.option_a.trim()) {
        alert("Please enter Option A.");
        return false;
      }

      if (!formData.option_b.trim()) {
        alert("Please enter Option B.");
        return false;
      }

      if (!formData.option_c.trim()) {
        alert("Please enter Option C.");
        return false;
      }

      if (!formData.option_d.trim()) {
        alert("Please enter Option D.");
        return false;
      }

      if (!["A", "B", "C", "D"].includes(formData.correct_answer)) {
        alert("Please select the correct answer.");
        return false;
      }
    }

    // =======================================================
    // TRUE / FALSE VALIDATION
    // =======================================================

    if (formData.question_type === "True/False") {
      if (!["True", "False"].includes(formData.correct_answer)) {
        alert("Please select True or False.");
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

    if (!validateForm()) {
      return;
    }

    const questionData = {
      ...formData,
      question: formData.question.trim(),
      option_a:
        formData.question_type === "MCQ" ? formData.option_a.trim() : "True",
      option_b:
        formData.question_type === "MCQ" ? formData.option_b.trim() : "False",
      option_c:
        formData.question_type === "MCQ" ? formData.option_c.trim() : "",
      option_d:
        formData.question_type === "MCQ" ? formData.option_d.trim() : "",
      marks: Number(formData.marks),
    };

    onSubmit(questionData);
  };

  // =========================================================
  // RESET
  // =========================================================

  const handleReset = () => {
    if (editingQuestion) {
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
      setFormData(initialForm);
    }
  };

  // =========================================================
  // CLOSE
  // =========================================================

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div
      className="question-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
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
            onClick={handleClose}
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
              <small className="form-help">No exams available.</small>
            )}
          </div>

          {/* =================================================
              QUESTION TYPE + MARKS
          ================================================= */}

          <div className="modal-form-row">
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
              rows="4"
              placeholder="Enter question..."
              value={formData.question}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* =================================================
              MCQ OPTIONS
          ================================================= */}

          {formData.question_type === "MCQ" && (
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
          )}

          {/* =================================================
              TRUE / FALSE
          ================================================= */}

          {formData.question_type === "True/False" && (
            <div className="modal-tf-box">
              <label>
                Correct Answer <span>*</span>
              </label>

              <div className="modal-tf-options">
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

                  <span>True</span>
                </label>

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

                  <span>False</span>
                </label>
              </div>
            </div>
          )}

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="question-modal-footer">
            <button
              type="button"
              className="modal-cancel-btn"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="button"
              className="modal-reset-btn"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>

            <button
              type="submit"
              className="modal-submit-btn"
              disabled={loading || exams.length === 0}
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
