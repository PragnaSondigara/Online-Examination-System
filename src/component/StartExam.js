import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./StartExam.css";

const API_URL = "http://localhost:5000";

export default function StartExam() {
  const [exam, setExam] = useState(null);
  const [subject, setSubject] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [answers, setAnswers] = useState({});
  const [studentExamId, setStudentExamId] = useState(null);
  const [startedAt, setStartedAt] = useState("");

  const [timeLeft, setTimeLeft] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const autoSubmitLock = useRef(false);

  const examId = localStorage.getItem("examId");
  const studentId = localStorage.getItem("studentId");

  // =====================================================
  // LOAD EXAM
  // =====================================================

  const loadExam = async () => {
    try {
      setLoading(true);

      if (!examId) {
        alert("No exam selected.");
        return;
      }

      if (!studentId) {
        alert("Student not logged in.");
        return;
      }

      // =========================================
      // CHECK IF STUDENT ALREADY GAVE EXAM
      // =========================================

      const resultRes = await axios.get(
        `${API_URL}/tbl_result?student_id=${studentId}&exam_id=${examId}`,
      );

      if (resultRes.data.length > 0) {
        alert("You have already given this exam. You cannot attempt it again.");
        window.location.href = "/ViewResult";
        return;
      }

      // =========================================
      // GET EXAM
      // =========================================

      const examRes = await axios.get(`${API_URL}/tbl_exam/${examId}`);

      const examData = examRes.data;

      if (examData.is_active !== true) {
        alert("This exam is currently inactive.");
        return;
      }

      setExam(examData);

      // =========================================
      // GET SUBJECT
      // =========================================

      const subjectRes = await axios.get(
        `${API_URL}/tbl_subject/${examData.subject_id}`,
      );

      setSubject(subjectRes.data);

      // =========================================
      // GET QUESTIONS
      // =========================================

      const questionRes = await axios.get(
        `${API_URL}/tbl_question?exam_id=${examId}`,
      );

      setQuestions(questionRes.data);

      // =========================================
      // CHECK STUDENT EXAM
      // =========================================

      const studentExamRes = await axios.get(
        `${API_URL}/tbl_student_exam?student_id=${studentId}&exam_id=${examId}`,
      );

      if (studentExamRes.data.length > 0) {
        const studentExam = studentExamRes.data[0];

        // Already completed
        if (studentExam.status === "Completed") {
          alert(
            "You have already given this exam. You cannot attempt it again.",
          );

          window.location.href = "/ViewResult";
          return;
        }

        // Existing started exam
        setStudentExamId(studentExam.id);
        setStartedAt(studentExam.started_at);
      } else {
        // =========================================
        // CREATE NEW EXAM ATTEMPT
        // =========================================

        const currentTime = new Date().toISOString();

        const studentExamData = {
          student_id: studentId,
          exam_id: examId,
          started_at: currentTime,
          submitted_at: null,
          status: "Started",
        };

        const newStudentExamRes = await axios.post(
          `${API_URL}/tbl_student_exam`,
          studentExamData,
        );

        setStudentExamId(newStudentExamRes.data.id);
        setStartedAt(currentTime);
      }
    } catch (err) {
      console.error(err);
      alert("Server Error. Please check JSON Server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExam();
  }, []);

  // =====================================================
  // TIMER
  // =====================================================

  useEffect(() => {
    if (!startedAt || !exam?.duration) return;

    /*
      Convert hours to milliseconds for timer calculation
    */

    const durationMilliseconds = Number(exam.duration) * 60 * 60 * 1000;

    const endTime = new Date(startedAt).getTime() + durationMilliseconds;

    const updateTimer = () => {
      const remaining = Math.max(0, endTime - Date.now());

      setTimeLeft(remaining);

      // Automatically submit when time reaches zero
      if (remaining <= 0 && !autoSubmitLock.current) {
        autoSubmitLock.current = true;
        handleSubmit(true);
      }
    };

    updateTimer();

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [startedAt, exam]);

  // =====================================================
  // FORMAT TIMER
  // =====================================================

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);

    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(2, "0")}`;
  };

  // =====================================================
  // ANSWER CHANGE
  // =====================================================

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  };

  // =====================================================
  // CALCULATE MARKS
  // =====================================================

  const calculateMarks = () => {
    let obtainedMarks = 0;

    questions.forEach((question) => {
      const studentAnswer = answers[question.id];

      if (
        studentAnswer &&
        String(studentAnswer).toLowerCase() ===
          String(question.correct_answer).toLowerCase()
      ) {
        obtainedMarks += Number(question.marks);
      }
    });

    return obtainedMarks;
  };

  // =====================================================
  // SUBMIT EXAM
  // =====================================================

  const handleSubmit = async (confirmed = false) => {
    if (!studentExamId) {
      alert("Student exam record not found.");
      return;
    }

    // Manual submit -> show confirmation
    if (!confirmed) {
      setShowSubmitModal(true);
      return;
    }

    if (submitting) return;

    try {
      setSubmitting(true);
      setShowSubmitModal(false);

      const obtainedMarks = calculateMarks();

      const totalMarks = Number(exam.total_marks);
      const passingMarks = Number(exam.passing_marks);

      const percentage =
        totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

      const resultStatus = obtainedMarks >= passingMarks ? "Pass" : "Fail";

      // =================================================
      // SAVE ANSWERS
      // =================================================

      for (const question of questions) {
        const studentAnswer = answers[question.id] || "";

        const isCorrect =
          String(studentAnswer).toLowerCase() ===
          String(question.correct_answer).toLowerCase();

        const marksObtained = isCorrect ? Number(question.marks) : 0;

        const answerData = {
          student_exam_id: studentExamId,
          question_id: question.id,
          student_answer: studentAnswer,
          is_correct: isCorrect,
          marks_obtained: marksObtained,
        };

        const existingAnswerRes = await axios.get(
          `${API_URL}/tbl_student_answer?student_exam_id=${studentExamId}&question_id=${question.id}`,
        );

        if (existingAnswerRes.data.length > 0) {
          const answerId = existingAnswerRes.data[0].id;

          await axios.put(
            `${API_URL}/tbl_student_answer/${answerId}`,
            answerData,
          );
        } else {
          await axios.post(`${API_URL}/tbl_student_answer`, answerData);
        }
      }

      // =================================================
      // UPDATE STUDENT EXAM
      // =================================================

      await axios.put(`${API_URL}/tbl_student_exam/${studentExamId}`, {
        student_id: studentId,
        exam_id: examId,
        started_at: startedAt,
        submitted_at: new Date().toISOString(),
        status: "Completed",
      });

      // =================================================
      // SAVE RESULT
      // =================================================

      const resultRes = await axios.get(
        `${API_URL}/tbl_result?student_id=${studentId}&exam_id=${examId}`,
      );

      const resultData = {
        student_id: studentId,
        exam_id: examId,
        total_marks: totalMarks,
        obtained_marks: obtainedMarks,
        passing_marks: passingMarks,
        percentage: Number(percentage.toFixed(2)),
        status: resultStatus,
      };

      if (resultRes.data.length > 0) {
        const resultId = resultRes.data[0].id;

        await axios.put(`${API_URL}/tbl_result/${resultId}`, resultData);
      } else {
        await axios.post(`${API_URL}/tbl_result`, resultData);
      }

      alert(
        timeLeft <= 0
          ? `Time is up! Your exam was submitted automatically.`
          : `Exam Submitted Successfully!`,
      );

      window.location.href = "/ViewResult";
    } catch (err) {
      console.error(err);
      autoSubmitLock.current = false;
      alert("Error while submitting exam.");
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="start-loading">
        <div className="loading-spinner"></div>

        <h2>Loading Exam...</h2>

        <p>Please wait while we prepare your examination.</p>
      </div>
    );
  }

  // =====================================================
  // NO EXAM
  // =====================================================

  if (!exam) {
    return (
      <div className="start-error">
        <div className="error-icon">!</div>

        <h2>Exam Not Found</h2>

        <p>The selected examination is not available.</p>

        <button onClick={() => (window.location.href = "/ViewExamSchedule")}>
          Back to Exam Schedule
        </button>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;

  const progress =
    questions.length > 0
      ? Math.round((answeredCount / questions.length) * 100)
      : 0;

  const timerDanger = timeLeft <= 5 * 60 * 1000;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="start-exam-page">
      {/* =========================================
          TOP HEADER
      ========================================== */}

      <header className="exam-topbar">
        <div className="exam-brand">
          <div className="exam-brand-icon">✓</div>

          <div>
            <span>ONLINE EXAM</span>

            <h2>{subject?.subject_name || "Examination"}</h2>
          </div>
        </div>

        <div className="exam-header-right">
          {/* TIMER */}

          <div className={`timer-box ${timerDanger ? "timer-danger" : ""}`}>
            <div className="timer-icon">⏱</div>

            <div>
              <span>TIME REMAINING</span>

              <strong>{formatTime(timeLeft)}</strong>
            </div>
          </div>

          {/* STATUS */}

          <div className="exam-status">
            <span className="status-dot"></span>
            In Progress
          </div>
        </div>
      </header>

      {/* =========================================
          MAIN CONTENT
      ========================================== */}

      <main className="exam-content">
        {/* =====================================
            EXAM INTRO
        ====================================== */}

        <section className="exam-hero-card">
          <div className="hero-main">
            <span className="eyebrow">EXAMINATION</span>

            <h1>{subject?.subject_name}</h1>

            <p>
              Answer all questions carefully before submitting your examination.
            </p>

            <div className="exam-meta">
              <div className="meta-item">
                <div className="meta-icon">📅</div>

                <div>
                  <span>Exam Date</span>
                  <strong>{exam.date}</strong>
                </div>
              </div>

              <div className="meta-item">
                <div className="meta-icon">🕐</div>

                <div>
                  <span>Exam Time</span>

                  <strong>
                    {exam.start_time} - {exam.end_time}
                  </strong>
                </div>
              </div>

              <div className="meta-item">
                <div className="meta-icon">⏱</div>

                <div>
                  <span>Duration</span>

                  <strong>{exam.duration} Hour</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="total-marks-box">
            <span>TOTAL MARKS</span>

            <strong>{exam.total_marks}</strong>

            <small>Passing: {exam.passing_marks}</small>
          </div>
        </section>

        {/* =====================================
            PROGRESS
        ====================================== */}

        <section className="progress-card">
          <div className="progress-header">
            <div>
              <span>YOUR PROGRESS</span>

              <h3>
                {answeredCount} of {questions.length} questions answered
              </h3>
            </div>

            <strong>{progress}%</strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>
        </section>

        {/* =====================================
            QUESTIONS
        ====================================== */}

        <section className="questions-section">
          <div className="section-heading">
            <div>
              <span>QUESTIONS</span>

              <h2>Answer the following questions</h2>
            </div>

            <div className="question-count">{questions.length} Questions</div>
          </div>

          {questions.map((question, index) => (
            <article className="new-question-card" key={question.id}>
              <div className="question-top">
                <div className="question-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="question-text">
                  <span>QUESTION {index + 1}</span>

                  <h3>{question.question}</h3>
                </div>

                <div className="question-marks">{question.marks} Marks</div>
              </div>

              {/* MCQ */}

              {question.question_type === "MCQ" && (
                <div className="answer-options">
                  {["A", "B", "C", "D"].map((option) => {
                    const optionKey = `option_${option.toLowerCase()}`;

                    return (
                      <label
                        key={option}
                        className={
                          answers[question.id] === option ? "selected" : ""
                        }
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) =>
                            handleAnswerChange(question.id, e.target.value)
                          }
                        />

                        <span className="option-letter">{option}</span>

                        <span className="option-text">
                          {question[optionKey]}
                        </span>

                        <span className="option-check">✓</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* TRUE / FALSE */}

              {question.question_type === "True/False" && (
                <div className="answer-options true-false">
                  {["True", "False"].map((option) => (
                    <label
                      key={option}
                      className={
                        answers[question.id] === option ? "selected" : ""
                      }
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                      />

                      <span className="option-letter">
                        {option === "True" ? "✓" : "×"}
                      </span>

                      <span className="option-text">{option}</span>

                      <span className="option-check">✓</span>
                    </label>
                  ))}
                </div>
              )}
            </article>
          ))}
        </section>

        {/* =====================================
            SUBMIT
        ====================================== */}

        <section className="submit-exam-card">
          <div className="submit-left">
            <div className="submit-icon">✓</div>

            <div>
              <strong>Ready to submit?</strong>

              <span>
                You have answered {answeredCount} of {questions.length}{" "}
                questions.
              </span>
            </div>
          </div>

          <button
            className="submit-exam-btn"
            onClick={() => handleSubmit(false)}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Exam"}

            <span>→</span>
          </button>
        </section>
      </main>

      {/* =====================================
          SUBMIT MODAL
      ====================================== */}

      {showSubmitModal && (
        <div
          className="modal-overlay"
          onClick={() => !submitting && setShowSubmitModal(false)}
        >
          <div className="submit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">✓</div>

            <h2>Submit your exam?</h2>

            <p>
              You have answered <strong>{answeredCount}</strong> of{" "}
              <strong>{questions.length}</strong> questions.
              <br />
              Once submitted, you cannot change your answers.
            </p>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowSubmitModal(false)}
              >
                Continue Exam
              </button>

              <button
                className="confirm-btn"
                onClick={() => handleSubmit(true)}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Yes, Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
