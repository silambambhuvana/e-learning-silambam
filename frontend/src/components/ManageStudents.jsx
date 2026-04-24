import { useEffect, useState } from "react";
import api from "../api";

function ManageStudents() {

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
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

const editBtn = {
  background: "#2b4a8b",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "5px",
  marginRight: "10px",
  cursor: "pointer",
  width: "80px",
  height: "35px"
};

const deleteBtn = {
  background: "red",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "5px",
  cursor: "pointer",
  width: "80px",
  height: "35px"
};
const saveBtn = {
  background: "green",
  color: "#fff",
  border: "none",
  padding: "8px 15px",
  borderRadius: "5px",
  marginRight: "10px",
  cursor: "pointer"
};

const cancelBtn = {
  background: "gray",
  color: "#fff",
  border: "none",
  padding: "8px 15px",
  borderRadius: "5px",
  cursor: "pointer"
};
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await api.get("students/");
    setStudents(res.data);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    await api.delete(`delete-user/${id}/`);
    fetchStudents();
  };

  const updateUser = async () => {
    await api.post(`update-user/${editUser.id}/`, editUser);
    setEditUser(null);
    fetchStudents();
  };

  // 🔍 FILTER LOGIC
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "40px" }}>
      <h2>👨‍🎓 Manage Students</h2>

      {/* 🔍 SEARCH BAR */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "15px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      {/* TABLE */}
      <table
  style={{
    width: "100%",
    borderCollapse: "collapse",   // 🔥 MUST
    marginTop: "20px",
    background: "#fff",
    border: "1px solid #ccc"
  }}
>
  <thead style={{ background: "#2b4a8b", color: "white" }}>
    <tr>
      <th style={thStyle}>Name</th>
      <th style={thStyle}>Email</th>
      <th style={thStyle}>Actions</th>
    </tr>
  </thead>

  <tbody> 
    {filteredStudents.length === 0 ? ( 
      <tr> 
        <td colSpan="3" style={tdStyle}> No results found </td> 
        </tr> 
      ) : ( filteredStudents.map((s) => ( 
      <tr key={s.id}> 
      <td style={tdStyle}>{s.name}</td> 
      <td style={tdStyle}>{s.email}</td> 
      <td style={tdStyle}> 
        <button onClick={() => setEditUser(s)} style={editBtn} > Edit </button> 
        <button onClick={() => deleteUser(s.id)} style={deleteBtn} > Delete </button> 
        </td> 
        </tr> 
      )) 
      )} 
  </tbody>
</table>

      {/* EDIT SECTION */}
      {editUser && (
        <div style={{
          marginTop: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px"
        }}>
          <h3>Edit Student</h3>

          <input
            value={editUser.name}
            onChange={(e) =>
              setEditUser({ ...editUser, name: e.target.value })
            }
            placeholder="Name"
          /><br /><br />

          <input
            value={editUser.email}
            onChange={(e) =>
              setEditUser({ ...editUser, email: e.target.value })
            }
            placeholder="Email"
          /><br /><br />

          <button onClick={updateUser} style={saveBtn}>
            Save
          </button>

          <button onClick={() => setEditUser(null)} style={cancelBtn}>
            Cancel
          </button>
        </div>
      )}

    </div>
  );
}


export default ManageStudents;