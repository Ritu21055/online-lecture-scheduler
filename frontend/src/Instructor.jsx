import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function Instructors({ token }) {
  const [instructors, setInstructors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/instructors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setInstructors(response.data);
      } catch (err) {
        console.log(err);
        setError("Unable to load instructors.");
      } finally {
        setLoading(false);
      }
    };

    loadInstructors();
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add new instructor
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      await axios.post(`${API_URL}/api/instructors/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Instructor added successfully!");

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setShowForm(false);
      const response = await axios.get(`${API_URL}/api/instructors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInstructors(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add instructor.");
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="section-title">Instructors</h4>
          <p className="muted-text mb-0">Manage your teaching team.</p>
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
          Add Instructor
        </button>
      </div>

      {/* Success and Error Messages */}
      {message && <div className="alert alert-success">{message}</div>}

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Add Instructor Form */}
      {showForm && (
        <div className="custom-card mb-4">
          <h5 className="mb-3">Add New Instructor</h5>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter instructor name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="primary-btn">
                Save Instructor
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

      {/* Instructor List */}
      <div className="custom-card">
        <div className="section-header">
          <div>
            <h5>All Instructors</h5>
            <p>Manage your registered instructors.</p>
          </div>

          <span className="badge text-bg-light">
            {instructors.length} Instructors
          </span>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    Loading instructors...
                  </td>
                </tr>
              ) : instructors.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No instructors found.
                  </td>
                </tr>
              ) : (
                instructors.map((instructor) => (
                  <tr key={instructor._id}>
                    <td className="course-name">
                      <div className="d-flex align-items-center gap-2">
                        <div className="profile-avatar">
                          {instructor.name.charAt(0).toUpperCase()}
                        </div>
                        {instructor.name}
                      </div>
                    </td>

                    <td>{instructor.email}</td>

                    <td>
                      <span className="status-badge">Instructor</span>
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

export default Instructors;
