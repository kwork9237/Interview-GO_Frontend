// ExamDetail.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import './ExamDetail.css';

const ExamDetail = () => {
  const location = useLocation();
  const { exam } = location.state || {};

  if (!exam) {
    return <div className="exam-detail-container">문제를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="exam-detail-container">
  <div className="exam-header">
    <span className="exam-status">{exam.status}</span>
    <h2 className="exam-title">{exam.ex_title}</h2>
  </div>
  
  <div className="exam-info">
    {exam.date} | 확인자: {exam.checkedBy}
  </div>
  
  <div className="exam-content">{exam.ex_content}</div>
  <div className="exam-answer">{exam.ex_answer_list}</div>
</div>

  );
};

export default ExamDetail;
