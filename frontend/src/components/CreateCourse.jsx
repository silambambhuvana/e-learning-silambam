import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
function AdminCreateCourse() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const thStyle = {
  border: "1px solid #ccc",   // 🔥 column lines
  padding: "12px",
  textAlign: "center"
};

const tdStyle = {
  border: "1px solid #ccc",   // 🔥 row + column lines
  verticalAlign: "middle",
  paddingTop: "12px",
  paddingBottom: "12px",
  textAlign: "center"
};

const editBtn = {
  background: "#2b4a8b",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "5px",
  cursor: "pointer",
  width : "80px",
  height: "40px"
};

const deleteBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "6px 12px",
  marginLeft: "28px",
  borderRadius: "5px",
  cursor: "pointer",
  width: "80px",height: "40px"
};
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await api.get("all-courses/");
    setCourses(res.data);
  };

  const handleDelete = async (id) => {
    await api.delete(`delete-course/${id}/`);
    alert("Deleted ✅");
    fetchCourses();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    await api.post("admin-create-course/", formData);

    alert("Course created ✅");

    setTitle("");
    setDescription("");
    setImage(null);

    fetchCourses(); // 🔥 refresh table
  };

  return (
    <div style={{ padding: "40px" }}>
      
      <button
  onClick={() => navigate("/admin")}
  style={{
    marginBottom: "20px",
    background: "#2b4a8b",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  ⬅ Back to Admin Home
</button>

      <h2>➕ Create Course</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br/><br/>

        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        /><br/><br/>

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        /><br/><br/>

        <button type="submit">Create Course</button>
      </form>

      {/* ✅ COURSE TABLE */}
      <h3 style={{ marginTop: "40px" }}>📚 All Courses</h3>

      <table
  style={{
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse",   // 🔥 IMPORTANT (fix double borders)
    background: "#fff",
    border: "1px solid #ccc"
  }}
>
  <thead style={{ background: "#2b4a8b", color: "white" }}>
    <tr>
      <th style={thStyle}>Image</th>
      <th style={thStyle}>Title</th>
      <th style={thStyle}>Description</th>
      <th style={thStyle}>Actions</th>
    </tr>
  </thead>

  <tbody>
    {courses.map((c) => (
      <tr key={c.id}>

        {/* IMAGE */}
        <td style={tdStyle}>
          {c.image && (
            <img
              src={c.image}
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                cursor: "pointer",
                borderRadius: "3px"
              }}
              onClick={() => setSelectedImage(c.image)}
            />
          )}
        </td>

        {/* TITLE */}
        <td style={tdStyle}>{c.title}</td>

        {/* DESCRIPTION */}
        <td style={tdStyle}>
          <div
            style={{
              maxWidth: "300px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {c.description}
          </div>
        </td>

        {/* ACTIONS */}
        <td style={tdStyle}>
          <button
            onClick={() =>
              (window.location.href = `/edit-course/${c.id}`)
            }
            style={editBtn}
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(c.id)}
            style={deleteBtn}
          >
            Delete
          </button>
        </td>

      </tr>
    ))}
  </tbody>
</table>
    {selectedImage && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999
    }}
    onClick={() => setSelectedImage(null)} // click outside to close
  >
    <img
      src={`http://127.0.0.1:8000${selectedImage}`}
      style={{
        maxWidth: "90%",
        maxHeight: "90%",
        borderRadius: "10px"
      }}
    />
  </div>
)}
    </div>
  );
}

export default AdminCreateCourse;