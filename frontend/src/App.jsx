import { useState, useEffect } from "react";
import axios from "axios";

import Login from "./Login.jsx";
import Instructors from "./Instructor.jsx";
import Courses from "./Courses.jsx";
import LectureSchedule from "./LectureSchedule.jsx";
import InstructorDashboard from "./InstructorDashboard.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [activePage, setActivePage] = useState("Dashboard");

  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [lectures, setLectures] = useState([]);

  const [dashboardLoading, setDashboardLoading] = useState(true);

  const handleLogin = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
    setActivePage("Dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setActivePage("Dashboard");
  };

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      return;
    }

    let isMounted = true;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const loadDashboardData = async () => {
      setDashboardLoading(true);

      try {
        const response = await axios.get(`${API_URL}/api/courses`, config);

        if (isMounted) {
          setCourses(response.data);
        }
      } catch (error) {
        console.log("Courses Error:", error.response?.data || error.message);
      }

      try {
        const response = await axios.get(`${API_URL}/api/instructors`, config);

        if (isMounted) {
          setInstructors(response.data);
        }
      } catch (error) {
        console.log(
          "Instructors Error:",
          error.response?.data || error.message,
        );
      }

      try {
        const response = await axios.get(`${API_URL}/api/lectures`, config);

        if (isMounted) {
          setLectures(response.data);
        }
      } catch (error) {
        console.log("Lectures Error:", error.response?.data || error.message);
      }

      if (isMounted) {
        setDashboardLoading(false);
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [token, user?.role]);

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  if (user?.role === "instructor") {
    return (
      <InstructorDashboard token={token} user={user} onLogout={handleLogout} />
    );
  }

  const menuItems = [
    { name: "Dashboard", icon: "bi-grid-1x2" },
    { name: "Courses", icon: "bi-book" },
    { name: "Instructors", icon: "bi-people" },
    { name: "Lecture Schedule", icon: "bi-calendar3" },
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingLectures = lectures
    .filter((lecture) => {
      const date = new Date(lecture.lectureDate);
      date.setHours(0, 0, 0, 0);
      return date >= today;
    })
    .sort((a, b) => new Date(a.lectureDate) - new Date(b.lectureDate));

  const stats = [
    {
      title: "Total Courses",
      number: courses.length,
      icon: "bi-book",
      color: "blue",
    },
    {
      title: "Instructors",
      number: instructors.length,
      icon: "bi-people",
      color: "green",
    },
    {
      title: "Total Lectures",
      number: lectures.length,
      icon: "bi-camera-video",
      color: "orange",
    },
    {
      title: "Upcoming Lectures",
      number: upcomingLectures.length,
      icon: "bi-calendar-check",
      color: "purple",
    },
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          <span>CourseDesk</span>
        </div>

        <p className="menu-heading">MAIN MENU</p>

        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={
                activePage === item.name ? "menu-item active" : "menu-item"
              }
              onClick={() => setActivePage(item.name)}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="profile-avatar">{initials}</div>

          <div>
            <h6>{user?.name || "Admin"}</h6>
            <small>Administrator</small>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <p className="breadcrumb-text">Workspace / {activePage}</p>
            <h5>{activePage}</h5>
          </div>

          <div className="topbar-right">
            <span className="admin-label">Admin Panel</span>

            <div className="profile-avatar">{initials}</div>

            <button className="logout-btn" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>
              Logout
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {activePage === "Dashboard" && (
            <>
              <div className="welcome-section">
                <div>
                  <h3>Welcome back, {user?.name || "Admin"}!</h3>

                  <p>Here's what's happening with your courses today.</p>
                </div>

                <button
                  className="primary-btn"
                  onClick={() => setActivePage("Lecture Schedule")}
                >
                  <i className="bi bi-plus-lg me-2"></i>
                  Schedule a Lecture
                </button>
              </div>

              <div className="row g-3 mb-4">
                {stats.map((item) => (
                  <div className="col-xl-3 col-md-6" key={item.title}>
                    <div className="stat-card">
                      <div className={`stat-icon ${item.color}`}>
                        <i className={`bi ${item.icon}`}></i>
                      </div>

                      <p>{item.title}</p>

                      <h3>{dashboardLoading ? "..." : item.number}</h3>
                    </div>
                  </div>
                ))}
              </div>

              <div className="custom-card schedule-card">
                <div className="section-header">
                  <div>
                    <h5>Upcoming Lectures</h5>
                    <p>Keep track of your scheduled classes.</p>
                  </div>

                  <button
                    className="view-btn"
                    onClick={() => setActivePage("Lecture Schedule")}
                  >
                    View all
                    <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>COURSE</th>
                        <th>BATCH</th>
                        <th>INSTRUCTOR</th>
                        <th>DATE</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {dashboardLoading ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            Loading dashboard...
                          </td>
                        </tr>
                      ) : upcomingLectures.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            No upcoming lectures scheduled.
                          </td>
                        </tr>
                      ) : (
                        upcomingLectures.slice(0, 5).map((lecture) => (
                          <tr key={lecture._id}>
                            <td className="course-name">
                              {lecture.course?.name || "Course"}
                            </td>

                            <td>{lecture.batchName}</td>

                            <td>{lecture.instructor?.name || "Instructor"}</td>

                            <td>{formatDate(lecture.lectureDate)}</td>

                            <td>
                              <span className="status-badge">Upcoming</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activePage === "Courses" && <Courses token={token} />}

          {activePage === "Instructors" && <Instructors token={token} />}

          {activePage === "Lecture Schedule" && (
            <LectureSchedule token={token} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
