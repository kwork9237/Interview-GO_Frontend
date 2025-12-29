// 회원가입 페이지입니다.
// 회원가입 프론트는 이곳에 구현해주세요.

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 로그인 페이지로 돌아가기 위해 필요
/* import './SignupPage.css'; // 아래 작성할 CSS 파일 임포트 */

const SignupPage = () => {
    // 입력값들을 객체 하나로 관리 (개별 useState로 해도 무방합니다)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nickname: '',
        contact: ''
    });

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSignup = () => {
        console.log('입력된 회원가입 정보:', formData);
        alert('회원가입 요청이 전송되었습니다.');
        // 여기에 백엔드 API 호출 로직 추가
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                {/* 타이틀 */}
                <h1 className="signup-title">회원가입</h1>

                <div className="form-group">
                    {/* 1. 아이디 (이메일) */}
                    <div className="input-row">
                        <label className="input-label">아이디(이메일)</label>
                        <input 
                            type="email" 
                            name="email"
                            className="custom-input"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@email.com"
                        />
                    </div>

                    {/* 2. 비밀번호 */}
                    <div className="input-row">
                        <label className="input-label">비밀번호</label>
                        <input 
                            type="password" 
                            name="password"
                            className="custom-input"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    {/* 3. 닉네임 (추가된 부분) */}
                    <div className="input-row">
                        <label className="input-label">닉네임</label>
                        <input 
                            type="text" 
                            name="nickname"
                            className="custom-input"
                            value={formData.nickname}
                            onChange={handleChange}
                            placeholder="별명 입력"
                        />
                    </div>

                    {/* 4. 연락처 */}
                    <div className="input-row">
                        <label className="input-label">연락처</label>
                        <input 
                            type="tel" 
                            name="contact"
                            className="custom-input"
                            value={formData.contact}
                            onChange={handleChange}
                            placeholder="010-0000-0000"
                        />
                    </div>
                </div>

                {/* 가입 버튼 */}
                <div className="button-container">
                    <button className="signup-btn" onClick={handleSignup}>
                        가입완료
                    </button>
                </div>
                
                {/* 로그인으로 돌아가기 링크 (선택사항) */}
                <div className="link-container">
                    <Link to="loginpage" className="back-link">로그인으로 돌아가기</Link>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;