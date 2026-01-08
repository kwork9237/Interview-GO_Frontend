import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ExamDetail.css";

const ExamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); 
  const [isCorrect, setIsCorrect] = useState(null); 
  const [showModal, setShowModal] = useState(false); // ✅ 모달 표시 상태 추가

  useEffect(() => {
    fetch(`/api/exams/${id}`)
      .then(res => res.json())
      .then(data => {
        setExam(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("데이터 로딩 에러:", err);
        setLoading(false);
      });
  }, [id]);

  const handleCheck = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    if (selected === null) {
      alert("정답을 선택해주세요!");
      return;
    }
    
    const correctAnswer = exam.exAnswerCorrect;
    
    if (parseInt(selected) === parseInt(correctAnswer)) {
      if (isCorrect === true) return; 
      setIsCorrect(true);

      fetch(`/api/exams/${id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (res.ok) {
          // ✅ 성공 시 커스텀 모달 띄우기
          setTimeout(() => setShowModal(true), 500);
        }
      });
    } else {
      setIsCorrect(false);
    }
  };

  if (loading) return <div className="loading-state">로딩 중...</div>;
  if (!exam) return <div className="error-state">문제를 찾을 수 없습니다.</div>;

  const title = exam.exTitle || "제목 없음";
  const content = exam.exContent || "내용 없음";
  const level = exam.exLevel || 0;
  const viewCount = exam.viewCount || 0;
  const answerListStr = exam.exAnswerList || "";

  const answers = (answerListStr === "" || answerListStr.includes("[]")) 
                  ? [] 
                  : answerListStr.split(",").map(s => s.trim());

  return (
    <div className="exam-detail-wrapper">
      <div className="exam-detail-container">
        <header className="exam-header">
          <div className="header-tags">
            <span className={`level-badge lv${level}`}>Lv.{level}</span>
          </div>
          <h2 className="exam-title">{title}</h2>
          <div className="exam-meta">
             <span>완료 인원: <b>{viewCount.toLocaleString()}</b>명</span>
          </div>
        </header>

        <section className="exam-section">
          <h3 className="section-title">문제 설명</h3>
          <div className="exam-content-box">{content}</div>
        </section>

        <section className="exam-section">
          <h3 className="section-title">정답 선택</h3>
          {answers.length > 0 ? (
            <div className="answer-grid">
              {answers.map((answer, idx) => (
                <div 
                  key={idx} 
                  className={`answer-card ${selected === idx ? "selected" : ""}`}
                  onClick={() => { if (isCorrect !== true) { setSelected(idx); setIsCorrect(null); } }}
                >
                  <span className="answer-idx">{idx + 1}</span>
                  <span className="answer-text">{answer}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data-msg">⚠️ 선택지 데이터가 없습니다.</div>
          )}
        </section>

        <div className="action-area">
          {isCorrect === true && <div className="result-msg correct">✅ 정답입니다!</div>}
          {isCorrect === false && <div className="result-msg wrong">❌ 틀렸습니다! 다시 시도해보세요.</div>}
          
          <button className="submit-btn" onClick={handleCheck} disabled={isCorrect === true}>
            {isCorrect === true ? "풀이 완료" : "정답 확인하기"}
          </button>
        </div>
      </div>

      {/* ✅ 커스텀 디자인 모달 추가 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">🎉</div>
            <h3>정답입니다!</h3>
            <p>문제를 성공적으로 풀었습니다.<br/>마이페이지에서 기록을 확인하시겠습니까?</p>
            <div className="modal-btns">
              <button className="btn-later" onClick={() => setShowModal(false)}>나중에</button>
              <button className="btn-go" onClick={() => navigate("/mypage")}>이동하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamDetail;