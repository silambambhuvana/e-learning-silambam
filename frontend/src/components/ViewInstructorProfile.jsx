import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "./ViewInstructorProfile.css";

function ViewInstructorProfile() {

  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get(`view-instructors-profile/${id}/`)
      .then(res => setProfile(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!profile) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <div className="profile-page">

      {/* 🔥 HERO BANNER */}
      <div className="profile-hero">
      </div>

      {/* 🔥 PROFILE CARD */}
      <div className="profile-card shadow">

        <img
          src={profile.profile_image || "https://via.placeholder.com/150"}
          alt="profile"
          className="profile-img"
        />

        <h2>{profile.name}</h2>

        <p className="text-muted">
          {profile.experience}+ Years Experience
        </p>

        <span className="badge bg-primary">
          {profile.specialization}
        </span>

      </div>

      {/* 🔥 ABOUT */}
      <div className="profile-section">
        <h4>About</h4>
        <p>{profile.bio || "No bio available"}</p>
      </div>

      {/* 🔥 DETAILS */}
      <div className="profile-section">
        <h4>Details</h4>

        <div className="details-grid">
          <div>
            <strong>Experience:</strong>
            <p>{profile.experience} Years</p>
          </div>

          <div>
            <strong>Specialization:</strong>
            <p>{profile.specialization}</p>
          </div>

          <div>
            <strong>Email:</strong>
            <p>{profile.email}</p>
          </div>
        </div>

      </div>

      {/* 🔥 ACHIEVEMENTS */}
      <div className="profile-section">
        <h4>Achievements</h4>
        <p>{profile.achievements || "No achievements added yet"}</p>
      </div>

    </div>
  );
}

export default ViewInstructorProfile;