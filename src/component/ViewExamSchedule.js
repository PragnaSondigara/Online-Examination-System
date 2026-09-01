import "./ViewExamSchedule.css";
import StudentSider from "./StudentSider";
import Header from "./Header";
import Footer from "./Footer";

export default function ViewExamSchedule() {

  const exams = [
    {
      id: "1",
      faculty_id: 1,
      subject_id: 1,
      duration: 2,
      date: "2026-09-04",
      start_time: "07:30",
      end_time: "09:30",
      passing_marks: 40,
      total_marks: 100,
      is_active: false,
    },
    {
      id: "2",
      faculty_id: 2,
      subject_id: 2,
      duration: 2,
      date: "2026-09-06",
      start_time: "10:00",
      end_time: "12:00",
      passing_marks: 40,
      total_marks: 100,
      is_active: true,
    },
    {
      id: "3",
      faculty_id: 3,
      subject_id: 3,
      duration: 2,
      date: "2026-09-08",
      start_time: "07:30",
      end_time: "09:30",
      passing_marks: 40,
      total_marks: 100,
      is_active: true,
    },
    {
      id: "4",
      faculty_id: 4,
      subject_id: 4,
      duration: 2,
      date: "2026-09-10",
      start_time: "10:00",
      end_time: "12:00",
      passing_marks: 40,
      total_marks: 100,
      is_active: true,
    },
    {
      id: "5",
      faculty_id: 5,
      subject_id: 5,
      duration: 2,
      date: "2026-09-12",
      start_time: "07:30",
      end_time: "09:30",
      passing_marks: 40,
      total_marks: 100,
      is_active: true,
    },
    {
      id: "6",
      faculty_id: 6,
      subject_id: 6,
      duration: 2,
      date: "2026-09-15",
      start_time: "10:00",
      end_time: "12:00",
      passing_marks: 40,
      total_marks: 100,
      is_active: false,
    },
    {
      id: "hvqYPDc4Q3c",
      faculty_id: 5,
      subject_id: 5,
      duration: 2,
      date: "2026-08-25",
      start_time: "11:00",
      end_time: "13:00",
      passing_marks: 40,
      total_marks: 100,
      is_active: true,
    },
    {
      id: "tuI8QKlRyKM",
      faculty_id: 5,
      subject_id: 3,
      duration: 2,
      date: "2026-07-13",
      start_time: "15:00",
      end_time: "17:00",
      passing_marks: 40,
      total_marks: 100,
      is_active: true,
    },
  ];

  return (
    <>
      <StudentSider />
      <Header />

      <main className="exam-schedule-page">

        {/* Page Heading */}
        <div className="page-top">
          <div>
            <h1>View Exam Schedule</h1>
            <p>
              View your scheduled examinations, subjects, dates and timings.
            </p>
          </div>
        </div>

        {/* Schedule Banner */}
        <div className="schedule-banner">

          <div className="banner-icon">
            📅
          </div>

          <div className="banner-content">
            <h2>Examination Schedule</h2>
            <p>
              Check examination details and prepare accordingly.
            </p>
          </div>

          <div className="exam-count">
            <strong>{exams.length}</strong>
            <span>Total Exams</span>
          </div>

        </div>

        {/* Exam Cards */}
        <div className="exam-grid">

          {exams.map((exam, index) => (

            <div className="exam-card" key={exam.id}>

              {/* Card Header */}
              <div className="exam-card-header">

                <div className={`exam-icon icon-${(index % 5) + 1}`}>
                  📋
                </div>

                <div className="exam-id">
                  <span>Exam ID</span>
                  <strong>#{exam.id}</strong>
                </div>

                <span
                  className={
                    exam.is_active
                      ? "status active"
                      : "status inactive"
                  }
                >
                  ● {exam.is_active ? "Active" : "Inactive"}
                </span>

              </div>

              {/* Exam Title */}
              <div className="exam-title">

                <h3>Online Examination</h3>

                <p>
                  Subject ID: {exam.subject_id}
                </p>

              </div>

              {/* Exam Information */}
              <div className="exam-info-grid">

                {/* Faculty */}
                <div className="exam-info-box">
                  <div className="info-icon">👨‍🏫</div>

                  <div>
                    <span>Faculty ID</span>
                    <strong>{exam.faculty_id}</strong>
                  </div>
                </div>

                {/* Subject */}
                <div className="exam-info-box">
                  <div className="info-icon">📚</div>

                  <div>
                    <span>Subject ID</span>
                    <strong>{exam.subject_id}</strong>
                  </div>
                </div>

                {/* Date */}
                <div className="exam-info-box">
                  <div className="info-icon">📅</div>

                  <div>
                    <span>Exam Date</span>
                    <strong>{exam.date}</strong>
                  </div>
                </div>

                {/* Time */}
                <div className="exam-info-box">
                  <div className="info-icon">🕐</div>

                  <div>
                    <span>Exam Time</span>
                    <strong>
                      {exam.start_time} - {exam.end_time}
                    </strong>
                  </div>
                </div>

                {/* Duration */}
                <div className="exam-info-box">
                  <div className="info-icon">⏱</div>

                  <div>
                    <span>Duration</span>
                    <strong>{exam.duration} Hours</strong>
                  </div>
                </div>

                {/* Marks */}
                <div className="exam-info-box">
                  <div className="info-icon">📝</div>

                  <div>
                    <span>Total Marks</span>
                    <strong>{exam.total_marks}</strong>
                  </div>
                </div>

              </div>

              {/* Marks Section */}
              <div className="marks-section">

                <div>
                  <span>Passing Marks</span>
                  <strong>{exam.passing_marks}</strong>
                </div>

                <div>
                  <span>Total Marks</span>
                  <strong>{exam.total_marks}</strong>
                </div>

              </div>

              {/* Bottom */}
              <div className="exam-card-footer">

                <span>
                  Online Examination
                </span>

                <span className="card-arrow">
                  →
                </span>

              </div>

            </div>

          ))}

        </div>

      </main>

      <Footer />
    </>
  );
}