import { useEffect, useState } from "react";
import api from "../api";
import DashboardNavbar from "./DashboardNavbar";
import "./InstructorHomePage.css";

function InstructorHome() {

  const [name, setName] = useState("");
  const [courses, setCourses] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  useEffect(() => {
    const storedName = localStorage.getItem("name");
    setName(storedName);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("get-courses/");
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <>
      <DashboardNavbar />
      
        {/* WELCOME */}
      <div className="inst-welcome-box">
          <h2>Welcome back, {name || "Instructor"} 👋</h2>
          <p>Manage your courses and students</p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-buttons">

          <button
            onClick={() => window.location.href = "/instructor/profile"}
            style={{
    marginTop: "20px",
    marginLeft:"23px",
    background: "#2b4a8b",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",}}
          >
            👤 Profile
          </button>

      </div>

      <div className="instructor-main">

        {/* TITLE */}
        <h3 className="section-title">Your Courses</h3>

        {/* EMPTY */}
        {courses.length === 0 && (
          <p className="empty-text">
            No courses assigned yet 🚀
          </p>
        )}

        {/* COURSE LIST */}
       {courses.map((course) => (
  <div className="inst-course-row" key={course.id}>

    {/* IMAGE */}
    <div className="inst-course-image">
      {course.image ? (
        <img
          src={`http://127.0.0.1:8000${course.image}`}
          alt="course"
        />
      ) : (
        <div className="no-image">No Image</div>
      )}
    </div>

    {/* CENTER CONTENT (TITLE + DESC TOGETHER) */}
    <div className="inst-course-content">

      <h4 className="inst-course-title">{course.title}</h4>

      <p className="inst-course-desc">
        {expandedId === course.id ? (
          <>
            {course.description}
            <span
              className="read-more"
              onClick={() => setExpandedId(null)}
            >
              Show less
            </span>
          </>
        ) : (
          <>
            {course.description && course.description.length > 120
              ? course.description.slice(0, 120) + "..."
              : course.description}

            {course.description && course.description.length > 120 && (
              <span
                className="read-more"
                onClick={() => setExpandedId(course.id)}
              >
                Read more
              </span>
            )}
          </>
        )}
      </p>

    </div>

    {/* ACTION */}
    <div className="inst-course-actions">
      <button
        className="view"
        onClick={() => window.location.href = `/course/${course.id}`}
      >
        View
      </button>
    </div>

  </div>
))}
      </div>
    </>
  );
}

export default InstructorHome;