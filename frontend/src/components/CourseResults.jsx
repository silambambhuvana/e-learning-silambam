import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "./CourseResults.css"
import * as XLSX from "xlsx";

function CourseResults() {

  const { id } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await api.get(`instructor-test-results/${id}/`);
      setResults(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const allowRetake = async (resultId) => {
    try {
      await api.post("allow-retake/", {
        result_id: resultId
      });

      alert("Retake allowed ✅");

      fetchResults(); // 🔥 refresh

    } catch (err) {
      console.log(err);
    }
  };

const exportToExcel = () => {

  const formattedData = results.map((r, index) => ({
    "S.No": index + 1,
    "Student Name": r.student_name,
    "Score": `${r.score}/${r.total}`,
    "Status": r.score >= r.total * 0.5 ? "Pass" : "Fail"
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  XLSX.writeFile(workbook, "student_Test_Results.xlsx");
};

 return (
  <div className="cr-container">

    <h2 className="cr-title">📊 Student Test Results</h2>

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

    {results.length === 0 ? (
      <p className="cr-empty">No students attempted yet</p>
    ) : (

      <div className="cr-table-wrapper">

        <table className="cr-table">

          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {results.map((r, index) => (
              <tr key={r.id}>

                <td>{index + 1}</td>

                <td>👨‍🎓 {r.student_name}</td>

                <td>
                  <b>{r.score} / {r.total}</b>
                </td>

                <td>
                  <span className={
                    r.score >= r.total * 0.5 ? "status pass" : "status fail"
                  }>
                    {r.score >= r.total * 0.5 ? "Pass" : "Fail"}
                  </span>
                </td>

                <td>
                  {!r.can_retake ? (
                    <button
                      className="primary-btn"
                      onClick={() => allowRetake(r.id)}
                    >
                      Allow Retake
                    </button>
                  ) : (
                    <span className="retake-ok">
                      ✅ Allowed
                    </span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    )}

  </div>
);
}

export default CourseResults;