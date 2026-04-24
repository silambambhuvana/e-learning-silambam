import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function StudentCourse() {

  const { id } = useParams();
  const [videos, setVideos] = useState([]);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  // ✅ IMPORTANT FIX (prevents reset)
  const restoredVideos = useRef({});

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    setName(storedName);
  }, []);

  useEffect(() => {
    if (id) {
      fetchVideos();
      fetchCompleted();
    }
  }, [id]);

  // pause when leaving
  useEffect(() => {
    return () => {
      document.querySelectorAll("video").forEach(v => v.pause());
    };
  }, []);

  // pause on tab switch
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        document.querySelectorAll("video").forEach(v => v.pause());
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await api.get(`student-videos/${id}/`);
      setVideos(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCompleted = async () => {
    try {
      const res = await api.get("completed-videos/");
      setCompletedVideos(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const markComplete = async (videoId) => {
    try {
      await api.post("mark-complete/", { video_id: videoId });

      localStorage.removeItem(`video-${videoId}`);
      setCompletedVideos(prev => [...prev, videoId]);

    } catch (err) {
      console.log(err);
    }
  };

  // ✅ PROGRESS
  const totalVideos = videos.length;

  const completedCount = videos.filter(v =>
    completedVideos.includes(v.id)
  ).length;

  const progressPercent =
    totalVideos === 0 ? 0 : Math.round((completedCount / totalVideos) * 100);

  const uploadVideo = async (videoId) => {
    if (!file) {
      alert("Please select file");
      return;
    }

    const formData = new FormData();
    formData.append("video_id", videoId);
    formData.append("file", file);

    try {
      await api.post("upload-submission/", formData);
      alert("Uploaded successfully");
    } catch (err) {
      alert(err.response?.data?.error);
    }
  };

  const freezeVideo = async (videoId) => {
    try {
      await api.post("freeze-submission/", { video_id: videoId });
      alert("Submission frozen ✅");
      fetchVideos();
    } catch (err) {
      alert("Error freezing");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>

      <h2>📺 Course Videos</h2>

      {/* PROGRESS */}
      <div style={{ marginBottom: "30px" }}>
        <p>
          {name}'s Progress: {completedCount} / {totalVideos} ({progressPercent}%)
        </p>

        <div style={{ width: "100%", height: "20px", background: "#ddd", borderRadius: "10px" }}>
          <div style={{
            width: `${progressPercent}%`,
            height: "100%",
            background: "green"
          }} />
        </div>
      </div>

      {/* FINAL TEST */}
      {completedCount === totalVideos && totalVideos > 0 && (
        <button onClick={() => window.location.href = `/test/${id}`}
        style={{
    marginBottom: "20px",
    background: "#2b4a8b",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer"
  }}>
          📝 Take Final Test
        </button>
      )}

      {/* NO VIDEOS */}
      {videos.length === 0 && (
        <p style={{ color: "gray" }}>No videos available</p>
      )}

      {/* VIDEO LIST */}
      {videos.map((video, index) => {

        const isLocked =
          index !== 0 &&
          !completedVideos.includes(videos[index - 1]?.id);

        return (
          <div
            key={video.id}
            style={{
              marginBottom: "40px",
              padding: "20px",
              borderRadius: "15px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              background: isLocked ? "#eee" : "#fff",
              opacity: isLocked ? 0.6 : 1
            }}
          >

            <h3>{video.title}</h3>

            {/* RESUME BUTTON */}
            {localStorage.getItem(`video-${video.id}`) && !completedVideos.includes(video.id) && (
              <div style={{ marginBottom: "10px" }}>

                <button
                  onClick={() => {
                    const saved = parseFloat(localStorage.getItem(`video-${video.id}`));
                    const vid = document.getElementById(`video-${video.id}`);
                    if (vid && !isNaN(saved)) {
                      vid.currentTime = saved;
                      vid.play();
                    }
                  }}
                >
                  ▶ Resume
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem(`video-${video.id}`);
                    const vid = document.getElementById(`video-${video.id}`);
                    if (vid) {
                      vid.currentTime = 0;
                      vid.pause();
                    }
                  }}
                  style={{ marginLeft: "10px" }}
                >
                  🔁 Start Over
                </button>

              </div>
            )}

            {/* VIDEO PLAYER */}
            <video
  id={`video-${video.id}`}
  width="100%"
  height="400"
  controls={!isLocked}
  preload="auto"
  style={{
    borderRadius: "10px",
    pointerEvents: isLocked ? "none" : "auto"
  }}

  onCanPlay={async (e) => {
  if (restoredVideos.current[video.id]) return;

  try {
    const res = await api.get(`get-video-time/${video.id}/`);
    let time = res.data.current_time;

    // 🔥 fallback to localStorage
    if (!time) {
      time = localStorage.getItem(`video-${video.id}`);
    }

    if (time) {
      setTimeout(() => {
        e.target.currentTime = parseFloat(time);
      }, 200);
    }

  } catch (err) {
    console.log(err);
  }

  restoredVideos.current[video.id] = true;
}}

  onTimeUpdate={(e) => {
  if (isLocked) return;

  const currentTime = e.target.currentTime;

  // ✅ backend save
  api.post("save-video-time/", {
    video_id: video.id,
    current_time: currentTime
  });

  // ✅ fallback (keep this)
  localStorage.setItem(`video-${video.id}`, currentTime);

  const progress = currentTime / e.target.duration;

  if (progress > 0.8 && !completedVideos.includes(video.id)) {
    markComplete(video.id);
  }
}}
>
              <source
                src={`http://127.0.0.1:8000${video.video_file}`}
                type="video/mp4"
              />
            </video>

            {/* ASSIGNMENT */}
            {video.is_assignment && completedVideos.includes(video.id) && (
              <div style={{ marginTop: "15px" }}>

                <p>📌 Upload your practice video</p>

                {video.is_frozen ? (
                  <p style={{ color: "red" }}>🔒 Submission Frozen</p>
                ) : (
                  <>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />

                    <button onClick={() => uploadVideo(video.id)}>
                      Upload
                    </button>

                    <button
                      onClick={() => freezeVideo(video.id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Freeze
                    </button>
                  </>
                )}

                {video.feedback && (
                  <p style={{ color: "blue" }}>
                    💬 Feedback: {video.feedback}
                  </p>
                )}

              </div>
            )}

            {isLocked && (
              <p style={{ color: "red" }}>
                🔒 Complete previous video to unlock
              </p>
            )}

            {completedVideos.includes(video.id) && (
              <p style={{ color: "green" }}>✅ Completed</p>
            )}

          </div>
        );
      })}

    </div>
  );
}

export default StudentCourse;