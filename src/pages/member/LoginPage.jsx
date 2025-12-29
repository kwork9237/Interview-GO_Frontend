// 로그인 페이지입니다.
// 로그인 프론트는 이곳에 구현해주세요.

import React, { useState } from 'react';
// import './Login.css';

const Login = () => {
    // 입력값을 관리하기 위한 상태 (필요 시 사용)
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="login-page">
            <div className="login-container">
                {/* 타이틀 */}
                <h1 className="login-title">로그인</h1>

                {/* ID 입력 섹션 */}
                <div className="input-row">
                    <label className="input-label">ID</label>
                    <input 
                        type="text" 
                        className="custom-input" 
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    {/* 디자인에 맞춰 ID 옆에 배치된 닫기 버튼 */}
                    <button className="close-btn" onClick={() => alert('닫기 버튼 클릭')}>
                        임시 창 닫기<br/>버튼
                    </button>
                </div>

                {/* PW 입력 섹션 */}
                <div className="input-row">
                    <label className="input-label">PW</label>
                    <input 
                        type="password" 
                        className="custom-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        // PW 쪽은 버튼이 없으므로 ID 입력창과 길이를 맞추거나 스타일 조정
                        style={{ marginRight: '100px' }} 
                    />
                </div>

                {/* 하단 링크 섹션 */}
                <div className="footer-links">
                    <span className="link-text">회원가입</span>
                    <span className="link-text">비밀번호 찾기</span>
                </div>
            </div>
        </div>
    );
}

export default Login;