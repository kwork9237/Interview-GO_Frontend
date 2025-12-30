import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ExamDetail.css";

const ExamDetail = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/exams/${id}`)
      .then(res => res.json())
      .then(data => {
        setExam(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="exam-detail-container">문제를 불러오는 중...</div>;
  if (!exam) return <div className="exam-detail-container">문제를 찾을 수 없습니다.</div>;

  return (
    <div className="exam-detail-container">
      <div className="exam-header">
        <span className="exam-status">{exam.status || "진행중"}</span>
        <h2 className="exam-title">{exam.exTitle}</h2>
      </div>

      <div className="exam-meta">
        <span>조회수: {exam.viewCount ?? 0}명</span>
        <span>난이도: {exam.exLevel}</span>
      </div>

      <div className="exam-content">{exam.exContent}</div>

      {exam.exAnswerList && (
        <div className="exam-answer-list">
          <h3>답안 목록</h3>
          <ul>
            {exam.exAnswerList.split(",").map((answer, idx) => (
              <li key={idx}>{answer}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExamDetail;
