import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CodingTestPage.css";

const CodingTestPage = () => {
  const [exams, setExams] = useState([]); 
  const [selectedLang, setSelectedLang] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(0); 
  const [totalElements, setTotalElements] = useState(0); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 추가
  const navigate = useNavigate();

  const languages = ["전체", "Java", "C언어", "Python"];
  const size = 10; 

  // 로그인 상태 체크
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const fetchExams = () => {
    const pageParam = currentPage - 1;
    const langParam = encodeURIComponent(selectedLang);
    
    fetch(`http://localhost:8080/api/exams?page=${pageParam}&size=${size}&lang=${langParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.content) {
          setExams(data.content);
          setTotalPages(data.totalPages);
          setTotalElements(data.totalElements);
        } 
        else if (Array.isArray(data)) {
          setExams(data);
          setTotalElements(data.length);
          setTotalPages(1);
        }
      })
      .catch((err) => console.error("데이터 로딩 에러:", err));
  };

  useEffect(() => {
    fetchExams();
  }, [currentPage, selectedLang]);

  const handleLangChange = (lang) => {
    setSelectedLang(lang);
    setCurrentPage(1); 
  };

  const goToDetail = (exam) => {
    const id = exam.exUid || exam.ex_uid;
    if (id) {
        navigate(`/codingtest/detail/${id}`);
    } else {
        alert("문제 정보를 찾을 수 없습니다.");
    }
  };

  return (
    <div className="coding-test-container">
      {/* 로그인 안내 메시지 (선택 사항) */}
      {!isLoggedIn && (
        <div className="login-notice-banner">
          💡 로그인을 하시면 문제 풀이 결과를 기록할 수 있습니다.
        </div>
      )}

      <div className="language-tabs">
        {languages.map((lang) => (
          <button
            key={lang}
            className={`tab-item ${selectedLang === lang ? "active" : ""}`}
            onClick={() => handleLangChange(lang)}
          >
            {lang}
          </button>
        ))}
      </div>

      <div className="list-title-area">
        <h2 className="total-count-text">총 {totalElements}건의 문제가 있습니다.</h2>
      </div>

      <div className="exam-list-header">
        <span className="col-status">난이도</span> {/* '상태' 대신 '난이도' 표시 권장 */}
        <span className="col-title">제목</span>
        <span className="col-date">게시날짜</span>
        <span className="col-count">완료인원</span>
      </div>

      <div className="exam-list">
        {exams && exams.length > 0 ? (
          exams.map((exam, index) => {
            if (!exam) return null;
            
            const title = exam.exTitle || exam.ex_title || "제목 없음";
            const uid = exam.exUid || exam.ex_uid || index;
            const viewCount = exam.viewCount ?? exam.view_count ?? 0;
            const regDate = exam.regDate || exam.reg_date || "2026-01-06";
            const level = exam.exLevel || exam.ex_level || 0;

            return (
              <div 
                key={uid} 
                className="exam-list-item" 
                onClick={() => goToDetail(exam)}
              >
                {/* 난이도에 따른 뱃지 표시 */}
                <span className="col-status">
                  <span className={`level-badge lv${level}`}>Lv.{level}</span>
                </span>
                <span className="col-title">{title}</span>
                <span className="col-date">{regDate}</span>
                <span className="col-count"><b>{viewCount.toLocaleString()}</b>명</span>
              </div>
            );
          })
        ) : (
          <div className="no-data">표시할 문제가 없습니다.</div>
        )}
      </div>

      {totalPages > 0 && (
        <div className="pagination">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            &lt;
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default CodingTestPage;