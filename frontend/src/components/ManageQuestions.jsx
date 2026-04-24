import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "./ManageQuestions.css"
function ManageQuestions() {

  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [editId, setEditId] = useState(null);

  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
  try {
    const res = await api.get(`get-questions/${id}/`);
    setQuestions(res.data);
  } catch (err) {
    console.log(err.response?.data);
    alert("Error loading questions");
  }
};

  const handleSubmit = async () => {
    try {
      if (editId) {
        await api.post(`update-question/${editId}/`, {
          question, option1, option2, option3, option4,
          correct_answer: correctAnswer
        });
        alert("Updated ✅");
      } else {
        await api.post("add-question/", {
          course_id: id,
          question, option1, option2, option3, option4,
          correct_answer: correctAnswer
        });
        alert("Added ✅");
      }

      // 🔥 CLEAR FORM
      setQuestion("");
      setOption1("");
      setOption2("");
      setOption3("");
      setOption4("");
      setCorrectAnswer("");
      setEditId(null);

      fetchQuestions();

    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (q) => {
    setEditId(q.id);
    setQuestion(q.question);
    setOption1(q.option1);
    setOption2(q.option2);
    setOption3(q.option3);
    setOption4(q.option4);
    setCorrectAnswer(q.correct_answer);
  };

  const handleDelete = async (qid) => {
    await api.delete(`delete-question/${qid}/`);
    fetchQuestions();
  };

 return (
  <div className="mq-container">

    <h2 className="mq-title">📚 Manage Questions</h2>

    {/* FORM CARD */}
    <div className="mq-form-card">

      <input
        className="mq-input full"
        value={question}
        onChange={(e)=>setQuestion(e.target.value)}
        placeholder="Enter Question"
      />

      <div className="mq-options">
        <input className="mq-input" value={option1} onChange={(e)=>setOption1(e.target.value)} placeholder="Option A" />
        <input className="mq-input" value={option2} onChange={(e)=>setOption2(e.target.value)} placeholder="Option B" />
        <input className="mq-input" value={option3} onChange={(e)=>setOption3(e.target.value)} placeholder="Option C" />
        <input className="mq-input" value={option4} onChange={(e)=>setOption4(e.target.value)} placeholder="Option D" />
      </div>

      <input
        className="mq-input full"
        value={correctAnswer}
        onChange={(e)=>setCorrectAnswer(e.target.value)}
        placeholder="Correct Answer"
      />

      <button className="primary-btn" onClick={handleSubmit}>
        {editId ? "Update Question" : "Add Question"}
      </button>

    </div>

    {/* LIST */}
    <h3 className="mq-subtitle">All Questions</h3>

    <div className="mq-list">
     {questions.map((q, index) => (
  <div key={q.id} className="question-card">

    <p className="question-title">
      Q{index + 1}. {q.question}
    </p>

    <p>A. {q.option1}</p>
    <p>B. {q.option2}</p>
    <p>C. {q.option3}</p>
    <p>D. {q.option4}</p>

    <p className="correct-answer">✔ {q.correct_answer}</p>

    <div className="question-actions">
      <button onClick={() => handleEdit(q)}>✏ Edit</button>

      <button
        onClick={() => handleDelete(q.id)}
        className="delete-btn"
      >
        🗑 Delete
      </button>
    </div>

  </div>
))}
    </div>

  </div>
);
}

export default ManageQuestions;