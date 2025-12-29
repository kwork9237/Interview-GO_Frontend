import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ExamDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const exam = location.state?.exam;

  if (!exam) {
    return <p>문제를 불러올 수 없습니다.</p>;
  }

  return (
    <div>
      <h1>{exam.ex_title}</h1>
      <p>{exam.ex_content}</p>
      <p>난이도: {exam.ex_level}</p>
      <p>정답: {exam.ex_answer_list}</p>

      <button onClick={() => navigate(-1)}>뒤로가기</button>
    </div>
  );
};

export default ExamDetail;
