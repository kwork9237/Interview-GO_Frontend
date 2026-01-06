import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CodingTestPage.css";

const CodingTestPage = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  const fetchExams = () => {
    fetch("http://localhost:8080/api/exams")
      .then(res => res.json())
      .then(data => setExams(data.filter(e => e != null)))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const goToDetail = (exam) => {
    // ✅ 조회수 증가
    const key = `viewed-${exam.exUid}`;
    if (!sessionStorage.getItem(key)) {
      fetch(`http://localhost:8080/api/exams/${exam.exUid}/increase-view`, {
        method: "POST",
      }).catch(err => console.error(err));
      sessionStorage.setItem(key, "true");
    }

    // 상세 페이지 이동
    navigate(`/codingtest/detail/${exam.exUid}`);
  };

  return (
    <div className="coding-test-container">
      <h1 className="header-center">시험 문제 리스트</h1>

      <div className="exam-list-header">
        <span>상태</span>
        <span>제목</span>
        <span>게시날짜</span>
        <span>완료인원</span>
      </div>

      <div className="exam-list">
        {exams.map(exam => (
          <div
            key={exam.exUid}
            className="exam-list-item"
            onClick={() => goToDetail(exam)}
          >
            <span>{"진행중"}</span>
            <span>{exam.exTitle || "제목 없음"}</span>
            <span>{exam.date || "2025-12-29"}</span>
            <span>{exam.viewCount ?? 0}명</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodingTestPage;
