import { useEffect, useState } from "react";
import api from "../api";
import * as XLSX from "xlsx";
function ManageStudentCourses() {

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courseList, setCourseList] = useState([]);
const [selectedCourse, setSelectedCourse] = useState("");
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
    fetchData();
    fetchCourses();
  }, []);

  const fetchData = async () => {
    const res = await api.get("admin-student-courses/");
    setData(res.data);
  };

  const fetchCourses = async () => {
  try {
    const res = await api.get("all-courses-list/");
    setCourseList(res.data);
  } catch (err) {
    console.log(err);
  }
};

  const remove = async (id) => {
    if (!window.confirm("Remove this student from course?")) return;

    await api.delete(`remove-enrollment/${id}/`);
    fetchData();
  };

  const filteredData = data.filter((item) => {

  const searchMatch =
    (item.student_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.student_email || "").toLowerCase().includes(search.toLowerCase());

  const courseMatch =
    selectedCourse === "" || item.course_title === selectedCourse;

  const statusMatch =
    statusFilter === "" || item.status === statusFilter;

  return searchMatch && courseMatch && statusMatch;
});


const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  XLSX.writeFile(workbook, "student_courses.xlsx");
};

  return (
    <div style={{ padding: "40px" }}>

      <h2>📊 Manage Student Courses</h2>

          <div style={{ marginBottom: "20px" }}>

  {/* SEARCH */}
  <input
    type="text"
    placeholder="Search..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{ padding: "9px", marginRight: "10px" }}
  />

  {/* COURSE FILTER */}
  <select
  value={selectedCourse}
  onChange={(e) => setSelectedCourse(e.target.value)}
  style={{
    padding: "10px",
    marginLeft: "10px",
    marginRight:"10px",
  }}
>
  <option value="">All Courses</option>

  {courseList.map((c) => (
    <option key={c.id} value={c.title}>   {/* ✅ FIXED */}
      {c.title}
    </option>
  ))}
</select>

  {/* STATUS FILTER */}
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    style={{ padding: "10px" }}
  >
    <option value="">All Status</option>
    <option value="Passed">Passed</option>
    <option value="Failed">Failed</option>
    <option value="Not Attempted">Not Attempted</option>
  </select>

</div>
<button
  onClick={exportToExcel}
  style={{
    padding: "10px 15px",
    background: "green",
    color: "white",
    border: "none",
    marginBottom: "20px"
  }}
>
  📥 Export Excel
</button>

      <table
  style={{
    width: "100%",
    textAlign: "center",
    borderCollapse: "collapse",
    border: "1px solid #ccc",
    background: "#fff"
  }}
>
  <thead style={{ background: "#2b4a8b", color: "white" }}>
    <tr>
      <th style={thStyle}>Name</th>
      <th style={thStyle}>Email</th>
      <th style={thStyle}>Course</th>
      <th style={thStyle}>Progress</th>
      <th style={thStyle}>Score</th>
      <th style={thStyle}>Status</th>
      <th style={thStyle}>Action</th>
    </tr>
  </thead>

  <tbody>
    {filteredData.map((d) => (
      <tr key={d.id}>
        <td style={tdStyle}>{d.student_name}</td>
        <td style={tdStyle}>{d.email}</td>
        <td style={tdStyle}>{d.course_title}</td>

        <td style={tdStyle}>
          <div style={{
            width: "100px",
            background: "#ddd",
            borderRadius: "5px",
            margin: "auto"
          }}>
            <div style={{
              width: `${d.progress}%`,
              background: "green",
              height: "10px",
              borderRadius: "5px"
            }} />
          </div>
          {d.progress}%
        </td>

        <td style={tdStyle}>{d.score}</td>

        <td style={{
          ...tdStyle,
          color:
            d.status === "Passed" ? "green" :
            d.status === "Failed" ? "red" : "gray"
        }}>
          {d.status}
        </td>

        <td style={tdStyle}>
          <button
            onClick={() => remove(d.id)}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
             Remove
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      {filteredData.length === 0 && (
  <p style={{ color: "gray" }}>No results found</p>
)}

    </div>
  );
}

export default ManageStudentCourses;