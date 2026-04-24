import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function EditCourse() {

  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // 🔥 Fetch course
  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const res = await api.get("all-courses/");  // ✅ FIXED
      const course = res.data.find(c => c.id == id);

      if (course) {
        setTitle(course.title);
        setDescription(course.description);
        setPreview(course.image); // ✅ show old image
      }

    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 Update
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (image) {
      formData.append("image", image); // ✅ only if new image
    }

    try {
      await api.post(`update-course/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Course Updated ✅");

      window.location.href = "/admin-create-course"; // ✅ back to admin

    } catch (err) {
      alert("Error updating");
    }
  };

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  setImage(file);

  if (file) {
    setPreview(URL.createObjectURL(file)); // ✅ LIVE PREVIEW
  }
};

  return (
    <div style={{ padding: "40px" }}>

      <h2>Edit Course</h2>

      <form onSubmit={handleUpdate}>

        {/* TITLE */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br/><br/>

        {/* DESCRIPTION */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        /><br/><br/>

        {/* CURRENT IMAGE */}
        {preview && (
  <div>
    <p>Image Preview:</p>
    <img
  src={
    preview?.startsWith("blob:")
      ? preview
      : preview?.startsWith("http")
      ? preview
      : `http://127.0.0.1:8000${preview}`
  }
  width="120"
  style={{ marginBottom: "10px", borderRadius: "8px" }}
/>
  </div>
)}

        {/* NEW IMAGE */}
        <input type="file" accept="image/*" onChange={handleImageChange} /><br/><br/>

        <button type="submit" style={{background: "#2b4a8b",
  color: "#fff"}}>Update</button>

      </form>

    </div>
  );
}

export default EditCourse;