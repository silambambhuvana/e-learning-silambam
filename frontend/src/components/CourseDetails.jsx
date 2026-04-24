import { useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";
import api from "../api";
import './CourseDetails.css'
function CourseDetails() {

  const { id } = useParams();

  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [isAssignment, setIsAssignment] = useState(false); 
  const [submissions, setSubmissions] = useState([]);
  const [openVideoId, setOpenVideoId] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await api.get(`get-videos/${id}/`);
      setVideos(res.data);
    } catch (err) {
      console.log(err);
    }
  };


  // 🔥 Add Video
  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("course_id", id);
    formData.append("title", title);
    formData.append("video_file", file);
    formData.append("is_assignment", isAssignment ? "true" : "false");

    try {
      await api.post("add-video/", formData);

      alert("Video uploaded");

      // ✅ RESET
      setTitle("");
      setFile(null);
      setIsAssignment(false);

      fetchVideos();

    } catch (err) {
      alert("Error uploading video");
    }
  };

  // 🔥 Delete Video
  const handleDelete = async (videoId) => {
    try {
      await api.delete(`delete-video/${videoId}/`);
      fetchVideos();
    } catch (err) {
      alert("Error deleting");
    }
  };

  const viewSubmissions = async (videoId) => {
  const res = await api.get(`view-submissions/${videoId}/`);
  console.log(res.data);
};
//VIEW SUBMISSIONS 
const fetchSubmissions = async (videoId) => {
  try {
    const res = await api.get(`instructor-submissions/${videoId}/`);
    setSubmissions(res.data);
  } catch (err) {
    console.log(err);
  }
 
};


//ADD FEEDBACK
const submitFeedback = async (id, feedbackText) => {
  try {
    await api.post("add-feedback/", {
      submission_id: id,
      feedback: feedbackText
    });

    alert("Feedback added ✅");
    // ✅ CLEAR TEXTAREA
const updated = submissions.map((s) =>
  s.id === id
    ? { ...s, feedbackText: "" }   // clear input
    : s
);

setSubmissions(updated);

  } catch (err) {
    console.log(err);
  }
};

 return (
  <div className="course-container">

    {/* LEFT SIDE */}
    <div className="left-panel">

      <h2>Course Videos</h2>

      {/* 🔥 Upload */}
      <div className="upload-card">
        <form onSubmit={handleUpload}>
          <input
            className="input"
            placeholder="Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            className="input"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />

          <label className="checkbox">
            <input
              type="checkbox"
              checked={isAssignment}
              onChange={(e) => setIsAssignment(e.target.checked)}
            />
            Mark as Assignment
          </label> <br></br>

          <button className="primary-btn" type="submit">
            Upload Video
          </button>
        </form>
      </div>

      {/* 🔥 VIDEO LIST */}
      {videos.map((v) => (
        <div key={v.id} className="video-card">

          <h4>{v.title}</h4>

          <video controls>
            <source src={`http://127.0.0.1:8000${v.video}`} />
          </video>

          <button
            onClick={() => handleDelete(v.id)}
            className="delete-btn"
            style={{marginRight: "10px"}}
          >
            Delete Video
          </button>

          {v.is_assignment && (
            <button className= "primary-btn" onClick={() => {
  if (openVideoId === v.id) {
    setOpenVideoId(null);   // 🔴 CLOSE
  } else {
    fetchSubmissions(v.id); // 🟢 OPEN
    setOpenVideoId(v.id);
  }
}}>
              View Submissions
            </button>
          )}

          {openVideoId === v.id &&
  submissions
    .filter((s) => s.video_id === v.id)
    .map((s) => (
              <div key={s.id} className="submission-box">

                <p>👨‍🎓 {s.student_name}</p>

                <video controls>
                  <source src={`http://127.0.0.1:8000${s.file}`} />
                </video>

  

                <textarea
                  placeholder="Enter feedback"
                  value={s.feedbackText || ""}
                  onChange={(e) => {
                    const updated = submissions.map((sub) =>
                      sub.id === s.id
                        ? { ...sub, feedbackText: e.target.value }
                        : sub
                    );
                    setSubmissions(updated);
                  }}
                />
                <button
                  onClick={() => submitFeedback(s.id, s.feedbackText)}
                  className="primary-btn"
                  style={{marginRight: '10px'}}
                >
                  Submit Feedback
                </button>
                <button
                  onClick={async () => {
                    await api.delete(`delete-submission/${s.id}/`);
                    fetchSubmissions(v.id);
                  }}
                  className="delete-btn"
                >
                  Delete
                </button>

                {s.feedback && (
                  <p className="feedback">💬 {s.feedback}</p>
                )}

              </div>
            ))}


        </div>
      ))}

    </div>

    {/* RIGHT SIDE */}
    <div className="right-panel">

      <h3>📌 Quick Actions</h3>

      <button
        className="primary-btn"
        onClick={() => window.location.href = `/manage-questions/${id}`}
      >
        📚 Manage Questions
      </button>

      <button
        className="primary-btn"
        onClick={() => window.location.href = `/course-results/${id}`}
      >
        📊 View Results
      </button>

      <div className="info-box">
        <p>🎥 Total Videos: {videos.length}</p>
        <p>📂 Assignments: {videos.filter(v => v.is_assignment).length}</p>
      </div>

    </div>

  </div>
);
}

export default CourseDetails;