import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
function ManageInstructors() {

  const [Instructors, setInstructors] = useState([]);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
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
  marginRight: "10px"
};

const cancelBtn = {
  background: "gray",
  color: "#fff",
  border: "none",
  padding: "8px 15px",
  borderRadius: "5px"
};

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    const res = await api.get("instructors/");
    setInstructors(res.data);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    await api.delete(`delete-user/${id}/`);
    fetchInstructors();
  };

  const updateUser = async () => {
    await api.post(`update-user/${editUser.id}/`, editUser);
    setEditUser(null);
    fetchInstructors();
  };

     // 🔍 FILTER LOGIC
  const filteredInstructors = Instructors.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "40px" }}>
      <h2>👨‍🎓 Manage Instructors</h2>
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
       <button
  onClick={() => navigate("/create_instructor")}
  style={{
    marginBottom: "20px",
    marginLeft:"10px",
    background: "#2b4a8b",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  Create Instructor
</button>
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
      <table
  style={{
    width: "100%",
    borderCollapse: "collapse",   // 🔥 IMPORTANT
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
  {filteredInstructors.length === 0 ? (
    <tr>
      <td colSpan="3" style={tdStyle}>
        No results found
      </td>
    </tr>
  ) : (
    filteredInstructors.map((s) => (
      <tr key={s.id}>
        
        {/* NAME */}
        <td style={tdStyle}>
          {editUser?.id === s.id ? (
            <input
              value={editUser.name}
              onChange={(e) =>
                setEditUser({ ...editUser, name: e.target.value })
              }
            />
          ) : (
            s.name
          )}
        </td>

        {/* EMAIL */}
        <td style={tdStyle}>
          {editUser?.id === s.id ? (
            <input
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
            />
          ) : (
            s.email
          )}
        </td>

        {/* ACTIONS */}
        <td style={tdStyle}>
          {editUser?.id === s.id ? (
            <>
              <button onClick={updateUser} style={saveBtn}>
                Save
              </button>
              <button
                onClick={() => setEditUser(null)}
                style={cancelBtn}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditUser(s)}
                style={editBtn}
              >
                Edit
              </button>

              <button
                onClick={() => deleteUser(s.id)}
                style={deleteBtn}
              >
                Delete
              </button>
            </>
          )}
        </td>

      </tr>
    ))
  )}
</tbody>
</table>

    </div>
  );
}



export default ManageInstructors;