import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './CodingTestPage.css';

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
    <div className="coding-test-container">
  <div className="header-center">
    <h1>시험 문제 리스트</h1>
    <div className="exam-list-header">
      <span>상태</span>
      <span>제목</span>
      <span>게시날짜</span>
      <span>완료인원</span>
    </div>
  </div>

  <div className="exam-list">
    {exams.map((exam) => (
      <div
        key={exam.ex_uid}
        className="exam-list-item"
        onClick={() => goToDetail(exam)}
      >
        <span>{exam.status || "진행중"}</span>
        <span>{exam.ex_title}</span>
        <span>{exam.date || "2025-12-29"}</span>
        <span>{exam.completed || 0}명</span>
      </div>
    ))}
  </div>
</div>

  );
};

export default CodingTestPage;
