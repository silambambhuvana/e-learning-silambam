import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function TestPage() {

  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
const [alreadyAttempted, setAlreadyAttempted] = useState(false);
const [review, setReview] = useState([]);

  useEffect(() => {
  fetchQuestions();
  checkResult();
}, []);

  const fetchQuestions = async () => {
    const res = await api.get(`course-questions/${id}/`);
    setQuestions(res.data);
  };

  const handleChange = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
  };

  const submitTest = async () => {
  try {
    const res = await api.post("submit-test/", {
      answers,
      course_id: id
    });

    setResult(res.data);
    setReview(res.data.review);   // ✅ ADD THIS
    setAlreadyAttempted(true);

  } catch (err) {
    alert(err.response.data.error);
  }
};

    const checkResult = async () => {
  try {
    const res = await api.get(`get-test-result/${id}/`);

    if (res.data.score !== undefined) {
      setResult(res.data);
      setAlreadyAttempted(true);
      setReview(res.data.review || []);
    }

  } catch (err) {
    console.log(err);
  }
};

  return (
  <div style={{ padding: "40px" }}>
    <h2 style={{textAlign: "center"}}>Final Test</h2>

    {alreadyAttempted ? (
      <div style={{ textAlign: "center", marginTop: "50px" }}>

        <h2>🎉 Test Completed</h2>

        <h3>
          Score: {result.score} / {result.total}
        </h3>

        {/* PROGRESS BAR */}
        <div style={{
          width: "300px",
          height: "20px",
          background: "#ddd",
          margin: "20px auto",
          borderRadius: "10px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${(result.score / result.total) * 100}%`,
            height: "100%",
            background: "green"
          }} />
        </div>

        <p>
          {result.score >= result.total * 0.5
            ? "✅ Passed"
            : "❌ Failed"}
        </p>

        {!result.can_retake && (
          <p style={{ color: "red" }}>
            You cannot retake this test
          </p>
        )}

        {result.can_retake && (
          <button
  onClick={() => {
    setAlreadyAttempted(false);
    setResult(null);
    setAnswers({});
  }}
>
  🔁 Retake Test
</button>
        )}
        <h2>📊 Answer Review</h2>

{review && review.length > 0 ? (
  review.map((r, index) => (
    <div
      key={index}
      style={{
        marginBottom: "20px",
        padding: "15px",
        borderRadius: "10px",
        background: r.is_correct ? "#d4edda" : "#f8d7da"
      }}
    >
      <p><b>{index + 1}. {r.question}</b></p>

      <p>Your Answer: <b>{r.your_answer}</b></p>

      <p>Correct Answer: <b>{r.correct_answer}</b></p>

      <p>
        {r.is_correct ? "✅ Correct" : "❌ Wrong"}
      </p>
    </div>
  ))
) : (
  <p>No review data available</p>
)}
      </div>
    ) : (
      <>
        {questions.map((q, index) => (
          <div key={q.id} style={{ marginBottom: "20px" }}>
            <p>{index + 1}. {q.question}</p>

            {q.options.map((opt, i) => (
              <div key={i}>
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  onChange={() => handleChange(q.id, opt)}
                />
                {opt}
              </div>
            ))}
          </div>
        ))}

        <button onClick={submitTest}>Submit Test</button>
      </>
    )}
  </div>
);
  
}

export default TestPage;