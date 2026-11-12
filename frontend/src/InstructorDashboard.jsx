import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function InstructorDashboard({ token, user, onLogout }) {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchMyLectures = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/lectures/my-lectures`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (isMounted) {
          setLectures(response.data);
        }
      } catch (err) {
        console.log("My Lectures Error:", err.response?.data || err.message);

        if (isMounted) {
          setError(
            err.response?.data?.message || "Unable to load your lectures.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMyLectures();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="instructor-page">
      <header className="instructor-topbar">
        <div className="brand">
          <div className="brand-icon">
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          <span>CourseDesk</span>
        </div>

        <div className="instructor-user">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase() || "I"}
          </div>

          <div className="instructor-user-details">
            <strong>{user?.name || "Instructor"}</strong>
            <small>Instructor</small>
          </div>

          <button className="logout-btn" onClick={onLogout}>
            <i className="bi bi-box-arrow-right me-1"></i>
            Logout
          </button>
        </div>
      </header>

      <main className="instructor-content">
        <div className="instructor-welcome">
          <div>
            <p className="instructor-date">{today}</p>
            <h2>Welcome, {user?.name || "Instructor"}!</h2>
            <p>Here is an overview of your assigned lectures.</p>
          </div>

          <div className="instructor-welcome-icon">
            <i className="bi bi-calendar2-week"></i>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="instructor-stat-card">
              <div className="stat-icon blue">
                <i className="bi bi-camera-video"></i>
              </div>
              <p>Assigned Lectures</p>
              <h3>{lectures.length}</h3>
            </div>
          </div>

          <div className="col-md-6">
            <div className="instructor-stat-card">
              <div className="stat-icon green">
                <i className="bi bi-calendar-check"></i>
              </div>
              <p>Scheduled Classes</p>
              <h3>{lectures.length}</h3>
            </div>
          </div>
        </div>

        <div className="custom-card">
          <div className="section-header">
            <div>
              <h5>My Lecture Schedule</h5>
              <p>All lectures assigned to your account.</p>
            </div>

            <span className="badge text-bg-light">
              {lectures.length} Lectures
            </span>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>COURSE</th>
                  <th>LEVEL</th>
                  <th>BATCH</th>
                  <th>LECTURE DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      Loading your lectures...
                    </td>
                  </tr>
                ) : lectures.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <i className="bi bi-calendar2-x empty-course-icon"></i>
                      <h6 className="mt-3">No lectures assigned yet</h6>
                      <p className="muted-text mb-0">
                        Your scheduled classes will appear here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  lectures.map((lecture) => (
                    <tr key={lecture._id}>
                      <td className="course-name">
                        {lecture.course?.name || "Course"}
                      </td>

                      <td>{lecture.course?.level || "-"}</td>

                      <td>{lecture.batchName}</td>

                      <td>
                        <i className="bi bi-calendar3 me-2"></i>
                        {formatDate(lecture.lectureDate)}
                      </td>

                      <td>
                        <span className="status-badge">Assigned</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboard;
