import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";
import "./AdminHomePage.css";

function AdminHome() {

  const navigate = useNavigate();

  return (
    <>
      <DashboardNavbar />
    {/* HEADER */}
      <div className="admins-welcome-box">
          <h2>👨‍💼 Admin Dashboard</h2>
          <p>Manage platform, users, and courses</p>
      </div>
      

      <div className="admin-main">

  
        {/* ACTION CARDS */}
        <div className="admin-grid">

          <div className="admin-card" onClick={() => navigate("/admin-create-course")}>
            <h4>➕ Create Course</h4>
            <p>Add new courses to platform</p>
          </div>

          <div className="admin-card" onClick={() => navigate("/manage-students")}>
            <h4>👨‍🎓 Manage Students</h4>
            <p>View and control student data</p>
          </div>

          <div className="admin-card" onClick={() => navigate("/admin-courses")}>
            <h4>📊 Student Courses</h4>
            <p>Track enrolled courses</p>
          </div>

          <div className="admin-card" onClick={() => navigate("/manage-instructors")}>
            <h4>👨‍🏫 Instructors</h4>
            <p>Manage instructor accounts</p>
          </div>

          <div className="admin-card" onClick={() => navigate("/manage-instructor-courses")}>
            <h4>📚 Instructor Courses</h4>
            <p>Control instructor content</p>
          </div>

        </div>

      </div>
    </>
  );
}

export default AdminHome;