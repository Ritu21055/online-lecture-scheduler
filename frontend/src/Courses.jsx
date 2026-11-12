import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Courses({ token }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    description: "",
    image: null,
  });

  // Get courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCourses(response.data);
      } catch (err) {
        console.log(err);
        setError("Unable to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: name === "image" ? files[0] : value,
    });
  };

  // Add course
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const courseData = new FormData();

      courseData.append("name", formData.name);
      courseData.append("level", formData.level);
      courseData.append("description", formData.description);

      if (formData.image) {
        courseData.append("image", formData.image);
      }

      await axios.post(`${API_URL}/api/courses/add`, courseData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Course added successfully!");

      // Reset form
      setFormData({
        name: "",
        level: "",
        description: "",
        image: null,
      });

      setShowForm(false);

      // Refresh courses list
      const response = await axios.get(`${API_URL}/api/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCourses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add course.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="section-title">Courses</h4>
          <p className="muted-text mb-0">
            Create and manage your learning programs.
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
          Add Course
        </button>
      </div>

      {/* Messages */}
      {message && <div className="alert alert-success">{message}</div>}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Add Course Form */}
      {showForm && (
        <div className="custom-card mb-4">
          <h5 className="mb-1">Add New Course</h5>
          <p className="muted-text mb-4">Enter the course details below.</p>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Course Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. MERN Stack Development"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Course Level</label>
                <select
                  name="level"
                  className="form-select"
                  value={formData.level}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  placeholder="Write a short course description..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="col-12">
                <label className="form-label">Course Image</label>
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  accept="image/*"
                  onChange={handleChange}
                  required
                />
                <small className="text-muted">
                  Select an image for this course.
                </small>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button
                type="submit"
                className="primary-btn"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Course"}
              </button>

              <button
                type="button"
                className="btn btn-light"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Course List Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="course-list-title">All Courses</h5>

        <span className="badge text-bg-light">{courses.length} Courses</span>
      </div>

      {/* Course Cards */}
      {loading ? (
        <div className="custom-card text-center py-5">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="custom-card text-center py-5">
          <i className="bi bi-journal-bookmark empty-course-icon"></i>
          <h5 className="mt-3">No courses yet</h5>
          <p className="muted-text">Add your first course to get started.</p>
        </div>
      ) : (
        <div className="row g-3">
          {courses.map((course) => (
            <div className="col-xl-4 col-md-6" key={course._id}>
              <div className="course-card">
                {course.image ? (
                  <img
                    src={`${API_URL}${course.image}`}
                    alt={course.name}
                    className="course-card-image"
                  />
                ) : (
                  <div className="course-card-placeholder">
                    <i className="bi bi-book"></i>
                  </div>
                )}

                <div className="course-card-body">
                  <span className="course-level">{course.level}</span>

                  <h5>{course.name}</h5>

                  <p>{course.description}</p>

                  <div className="course-card-footer">
                    <span>
                      <i className="bi bi-calendar3 me-1"></i>
                      Course
                    </span>
                    <span>CourseDesk</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
