import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function ManageInstructorCourses() {

  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const navigate = useNavigate();
  const thStyle = {
  border: "1px solid #ccc",
  padding: "12px",
  textAlign: "center"
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "12px",
  textAlign: "center"
};

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  const fetchCourses = async () => {
    const res = await api.get("admin-courses/");
    setCourses(res.data);
  };

  const fetchInstructors = async () => {
    const res = await api.get("get-instructors/");
    setInstructors(res.data);
  };

  const assignInstructor = async (courseId, instructorId) => {
    try {
      await api.post("assign-instructor/", {
        course_id: courseId,
        instructor_id: instructorId
      });

      alert("Instructor assigned ✅");
      fetchCourses();

    } catch (err) {
      alert("Error assigning instructor");
    }
  };

  return (
    <div style={{ padding: "40px" }}>


      <h2>🎓 Manage Instructor Courses</h2>

      <table
  style={{
    width: "100%",
    textAlign: "center",
    borderCollapse: "collapse",   // 🔥 IMPORTANT
    border: "1px solid #ccc",
    background: "#fff",
    marginTop: "20px"
  }}
>
  <thead style={{ background: "#2b4a8b", color: "white" }}>
    <tr>
      <th style={thStyle}>Course</th>
      <th style={thStyle}>Current Instructor</th>
      <th style={thStyle}>Assign / Change</th>
    </tr>
  </thead>

  <tbody>
    {courses.map((c) => (
      <tr key={c.id}>
        
        <td style={tdStyle}>{c.title}</td>

        <td style={tdStyle}>
          {c.instructor || "Not Assigned"}
        </td>

        <td style={tdStyle}>
          <select
            onChange={(e) => assignInstructor(c.id, e.target.value)}
            defaultValue=""
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          >
            <option value="">Select Instructor</option>

            {instructors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </td>

      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}

export default ManageInstructorCourses;