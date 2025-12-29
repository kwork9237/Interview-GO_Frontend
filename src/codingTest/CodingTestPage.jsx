import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CodingTestPage = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/exams")
      .then((res) => res.json())
      .then((data) => setExams(data))
      .catch((err) => console.error("API 호출 실패:", err));
  }, []);

  const goToDetail = (exam) => {
    navigate(`/codingtest/detail/${exam.ex_uid}`, { state: { exam } });
  };

  return (
    <div>
      <h1>시험 문제 리스트</h1>
      <ul>
        {exams.map((exam) => (
          <li key={exam.ex_uid} onClick={() => goToDetail(exam)} style={{cursor: "pointer"}}>
            {exam.ex_title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CodingTestPage;
