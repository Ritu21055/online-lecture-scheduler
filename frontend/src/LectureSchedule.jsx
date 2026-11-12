import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

function LectureSchedule({ token }) {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [lectures, setLectures] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");

  const [formData, setFormData] = useState({
    course: "",
    batchName: "",
    instructor: "",
    lectureDate: "",
  });

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const config = getConfig(token);

      try {
        const response = await axios.get(`${API_URL}/api/courses`, config);

        if (isMounted) {
          setCourses(response.data);
        }
      } catch (err) {
        console.log("Courses API Error:", err.response?.data || err.message);

        if (isMounted) {
          setLoadError("Unable to load courses.");
        }
      }

      try {
        const response = await axios.get(`${API_URL}/api/instructors`, config);

        if (isMounted) {
          setInstructors(response.data);
        }
      } catch (err) {
        console.log(
          "Instructors API Error:",
          err.response?.data || err.message,
        );

        if (isMounted) {
          setLoadError("Unable to load instructors.");
        }
      }

      try {
        const response = await axios.get(`${API_URL}/api/lectures`, config);

        if (isMounted) {
          setLectures(response.data);
        }
      } catch (err) {
        console.log("Lectures API Error:", err.response?.data || err.message);

        if (isMounted) {
          setLoadError("Unable to load scheduled lectures.");
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const refreshLectures = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/lectures`,
        getConfig(token),
      );

      setLectures(response.data);
    } catch (err) {
      console.log("Refresh Lectures Error:", err.response?.data || err.message);

      setError("Lecture saved, but unable to refresh the list.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      await axios.post(
        `${API_URL}/api/lectures/add`,
        formData,
        getConfig(token),
      );

      setMessage("Lecture scheduled successfully!");

      setFormData({
        course: "",
        batchName: "",
        instructor: "",
        lectureDate: "",
      });

      setShowForm(false);

      await refreshLectures();
    } catch (err) {
      console.log("Create Lecture Error:", err.response?.data || err.message);

      if (err.response?.status === 409) {
        setError(
          err.response.data.message ||
            "This instructor already has a lecture on this date.",
        );
      } else if (err.response?.status === 403) {
        setError("Access denied. Only administrators can schedule lectures.");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to schedule lecture. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="section-title">Lecture Schedule</h4>

          <p className="muted-text mb-0">
            Plan batches and assign instructors to lectures.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {
            setShowForm(!showForm);
            setError("");
            setMessage("");
          }}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Schedule Lecture
        </button>
      </div>

      {loadError && (
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-circle me-2"></i>
          {loadError}
        </div>
      )}

      {message && (
        <div className="alert alert-success">
          <i className="bi bi-check-circle me-2"></i>
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      {showForm && (
        <div className="custom-card mb-4">
          <div className="mb-4">
            <h5 className="mb-1">Schedule a New Lecture</h5>

            <p className="muted-text mb-0">
              Fill in the details to assign an instructor.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Course Dropdown */}
              <div className="col-md-6">
                <label className="form-label">Select Course</label>

                <select
                  name="course"
                  className="form-select"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  disabled={courses.length === 0}
                >
                  <option value="">
                    {courses.length === 0
                      ? "No courses available"
                      : "Choose a course"}
                  </option>

                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Batch Name</label>

                <input
                  type="text"
                  name="batchName"
                  className="form-control"
                  placeholder="e.g. Morning Batch A"
                  value={formData.batchName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Select Instructor</label>

                <select
                  name="instructor"
                  className="form-select"
                  value={formData.instructor}
                  onChange={handleChange}
                  required
                  disabled={instructors.length === 0}
                >
                  <option value="">
                    {instructors.length === 0
                      ? "No instructors available"
                      : "Choose an instructor"}
                  </option>

                  {instructors.map((instructor) => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Lecture Date</label>

                <input
                  type="date"
                  name="lectureDate"
                  className="form-control"
                  value={formData.lectureDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="schedule-info mt-3">
              <i className="bi bi-info-circle me-2"></i>
              An instructor can only be assigned one lecture per day.
            </div>

            <div className="d-flex gap-2 mt-4">
              <button
                type="submit"
                className="primary-btn"
                disabled={
                  submitting || courses.length === 0 || instructors.length === 0
                }
              >
                {submitting ? "Scheduling..." : "Create Lecture"}
              </button>

              <button
                type="button"
                className="btn btn-light"
                onClick={() => {
                  setShowForm(false);
                  setError("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="custom-card">
        <div className="section-header">
          <div>
            <h5>All Scheduled Lectures</h5>

            <p>View your course batches and assigned instructors.</p>
          </div>

          <span className="badge text-bg-light">
            {lectures.length} Lectures
          </span>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>COURSE</th>
                <th>BATCH</th>
                <th>INSTRUCTOR</th>
                <th>DATE</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading lectures...
                  </td>
                </tr>
              ) : lectures.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No lectures scheduled yet.
                  </td>
                </tr>
              ) : (
                lectures.map((lecture) => (
                  <tr key={lecture._id}>
                    <td className="course-name">
                      {lecture.course?.name || "Course"}
                    </td>

                    <td>{lecture.batchName}</td>

                    <td>{lecture.instructor?.name || "Instructor"}</td>

                    <td>
                      <span className="lecture-date">
                        <i className="bi bi-calendar3 me-2"></i>
                        {formatDate(lecture.lectureDate)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LectureSchedule;
