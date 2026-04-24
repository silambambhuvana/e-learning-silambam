import { useEffect, useState } from "react";
import api from "../api";
import "./InstructorProfile.css";

function InstructorProfile() {

  const [profile, setProfile] = useState({
    bio: "",
    experience: "",
    specialization: "",
    dob: "",
    phone: "",
    address: "",
    achievements: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // 🔥 Fetch profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
  try {
    const res = await api.get("instructor-profile/");

    setProfile(res.data);

    // ✅ FIX: Add backend URL
    if (res.data.profile_image) {
      setPreview(`http://127.0.0.1:8000${res.data.profile_image}`);
    }

  } catch (err) {
    console.log(err);
  }
};

  // 🔥 Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔥 Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(profile).forEach(key => {
      formData.append(key, profile[key]);
    });

    if (image) {
      formData.append("profile_image", image);
    }

    try {
      await api.post("update-instructor-profile/", formData);

      alert("Profile updated ✅");
      window.location.href = "/instructor";

    } catch (err) {
      alert("Error updating profile");
    }
  };

  return (
    <div className="ip-container">

      <h2 className="ip-title">👨‍🏫 Instructor Profile</h2>

      <form className="ip-form" onSubmit={handleUpdate}>

        {/* IMAGE */}
        <div className="ip-image-box">

  <img
    src={preview || "https://via.placeholder.com/120"}
    alt="profile"
    className="ip-avatar"
  />

  <label className="upload-btn">
    Change Photo
    <input type="file" onChange={handleImageChange} hidden />
  </label>

</div><br></br>

        {/* BASIC */}
        <textarea
          className="ip-input"
          placeholder="Bio"
          value={profile.bio}
          onChange={(e)=>setProfile({...profile, bio:e.target.value})}
        />

        <input
          className="ip-input"
          type="number"
          placeholder="Experience (years)"
          value={profile.experience}
          onChange={(e)=>setProfile({...profile, experience:e.target.value})}
        />

        <input
          className="ip-input"
          placeholder="Specialization"
          value={profile.specialization}
          onChange={(e)=>setProfile({...profile, specialization:e.target.value})}
        />

        {/* NEW FIELDS */}
        <input
          className="ip-input"
          type="date"
          value={profile.dob || ""}
          onChange={(e)=>setProfile({...profile, dob:e.target.value})}
        />

        <input
          className="ip-input"
          placeholder="Phone Number"
          value={profile.phone}
          onChange={(e)=>setProfile({...profile, phone:e.target.value})}
        />

        <textarea
          className="ip-input"
          placeholder="Address"
          value={profile.address}
          onChange={(e)=>setProfile({...profile, address:e.target.value})}
        />

        <textarea
          className="ip-input"
          placeholder="Achievements"
          value={profile.achievements}
          onChange={(e)=>setProfile({...profile, achievements:e.target.value})}
        />

        <button className="primary-btn" type="submit">
          Update Profile
        </button>

      </form>

    </div>
  );
}

export default InstructorProfile;