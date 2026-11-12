import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      onLogin(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand-panel">
          <div className="login-brand">
            <i className="bi bi-mortarboard-fill"></i>
            <span>CourseDesk</span>
          </div>

          <div className="login-intro">
            <p className="login-small-title">LEARNING MANAGEMENT</p>
            <h1>Everything in place. Every class on track.</h1>
            <p>
              Manage courses, coordinate instructors and keep your lecture
              schedules organized.
            </p>
          </div>

          <div className="login-footer">A simpler way to manage learning.</div>
        </div>

        <div className="login-form-panel">
          <div className="login-form-content">
            <p className="login-welcome">WELCOME BACK</p>
            <h2>Sign in to CourseDesk</h2>
            <p className="login-subtitle">
              Enter your account details to continue.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="login-error">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="primary-btn login-submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <i className="bi bi-arrow-right ms-2"></i>}
              </button>
            </form>

            <p className="login-note">
              Use the login credentials provided by your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
