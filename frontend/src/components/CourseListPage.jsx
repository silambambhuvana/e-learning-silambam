import { useEffect, useState } from "react";
import api from "../api";

function CourseListPage() {

  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [expanded, setExpanded] = useState({}); // 🔥 for read more

  useEffect(() => {
    fetchCourses();
    fetchMyCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await api.get("all-courses/");
    setCourses(res.data);
  };

  const fetchMyCourses = async () => {
    try {
      const res = await api.get("my-courses/");
      const ids = res.data.map(c => c.id);
      setEnrolled(ids);
    } catch (err) {
      console.log(err);
    }
  };

  const enroll = async (courseId) => {
    try {
      await api.post("enroll-course/", {
        course_id: courseId
      });

      alert("Enrolled successfully ✅");
      setEnrolled(prev => [...prev, courseId]);

    } catch (err) {
      alert(err.response?.data?.error);
    }
  };

  const toggleReadMore = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div style={{ padding: "40px", background: "#f4f7fb", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "30px", color: "#2b4a8b" }}>
        📚 All Courses
      </h2>

      {/* GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px"
      }}>

        {courses.map((c) => {

          const isLong = c.description.length > 100;
          const showFull = expanded[c.id];

          return (
            <div key={c.id} style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              padding: "15px",
              transition: "0.3s"
            }}>

              {/* IMAGE */}
              <img
                src={c.image || "https://via.placeholder.com/300x150"}
                alt="course"
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "10px"
                }}
              />

              {/* TITLE */}
              <h3 style={{
                marginTop: "10px",
                color: "#2b4a8b"
              }}>
                {c.title}
              </h3>

              {/* DESCRIPTION */}
              <p style={{
                fontSize: "14px",
                color: "#555",
                lineHeight: "1.5"
              }}>
                {isLong && !showFull
                  ? c.description.slice(0, 100) + "..."
                  : c.description}

                {isLong && (
                  <span
                    onClick={() => toggleReadMore(c.id)}
                    style={{
                      color: "#2b4a8b",
                      fontWeight: "bold",
                      cursor: "pointer",
                      marginLeft: "5px"
                    }}
                  >
                    {showFull ? " Show Less" : " Read More"}
                  </span>
                )}
              </p>

              {/* BUTTON */}
              {enrolled.includes(c.id) ? (
                <button
                  disabled
                  style={{
                    width: "100%",
                    background: "green",
                    color: "#fff",
                    border: "none",
                    padding: "10px",
                    borderRadius: "8px",
                    marginTop: "10px"
                  }}
                >
                  Enrolled ✅
                </button>
              ) : (
                <button
                  onClick={() => enroll(c.id)}
                  style={{
                    width: "100%",
                    background: "#2b4a8b",
                    color: "#fff",
                    border: "none",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginTop: "10px"
                  }}
                >
                  Enroll Now
                </button>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CourseListPage;