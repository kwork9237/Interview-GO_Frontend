import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const navigate = useNavigate();

    // 입력값 상태 관리
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nickname: '',
        contact2: '', // 전화번호 중간 자리
        contact3: ''  // 전화번호 끝 자리
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // 전화번호 입력 시 4자리 넘어가면 입력 방지
        if ((name === 'contact2' || name === 'contact3') && value.length > 4) {
            return;
        }
        
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSignup = () => {
        // 전화번호 합치기
        const fullContact = `010-${formData.contact2}-${formData.contact3}`;
        
        console.log('회원가입 요청 데이터:', { ...formData, contact: fullContact });
        alert('가입이 완료되었습니다.');
        
        // 가입 완료 후 로그인 페이지로 이동
        navigate('/loginpage');
    };

    // --- CSS-in-JS 스타일 정의 ---
    const styles = {
        page: {
            backgroundColor: '#f4f4f4', // 전체 배경 연한 회색
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        logo: {
            position: 'absolute',
            top: '20px',
            left: '20px',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: '#333',
            cursor: 'default'
        },
        container: {
            backgroundColor: '#ffffff', // 폼 배경 흰색
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // 부드러운 그림자
            width: '100%',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // 내부 요소 가운데 정렬
        },
        title: {
            margin: '0 0 30px 0',
            fontSize: '26px',
            fontWeight: 'bold',
            color: '#333'
        },
        formGroup: {
            width: '100%',
            marginBottom: '20px',
            textAlign: 'left'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#555'
        },
        input: {
            width: '100%',
            padding: '12px',
            boxSizing: 'border-box',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontSize: '15px',
            outline: 'none',
            transition: 'border-color 0.2s'
        },
        phoneWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '5px'
        },
        phoneInputFixed: {
            width: '25%',
            padding: '12px',
            textAlign: 'center',
            borderRadius: '6px',
            border: '1px solid #ddd',
            backgroundColor: '#f9f9f9', // 읽기 전용 느낌의 배경색
            color: '#666',
            fontSize: '15px'
        },
        phoneInput: {
            width: '30%',
            padding: '12px',
            textAlign: 'center',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontSize: '15px',
            outline: 'none'
        },
        dash: {
            color: '#999',
            fontWeight: 'bold'
        },
        signupBtn: {
            width: '100%',
            padding: '14px',
            backgroundColor: '#007bff', // 요청하신 파란색
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px',
            transition: 'background-color 0.2s'
        },
        loginLinkContainer: {
            marginTop: '20px',
            textAlign: 'center'
        },
        loginBtn: {
            background: 'none',
            border: 'none',
            color: '#666',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '5px'
        }
    };

    return (
        <div style={styles.page}>
            {/* 1. 화면 구석 TEAM LOGO */}
            <div style={styles.logo}>TEAM LOGO</div>

            <div style={styles.container}>
                {/* 타이틀 */}
                <h1 style={styles.title}>회원가입</h1>

                {/* 2. 아이디 (이메일) */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>아이디 (이메일)</label>
                    <input 
                        type="email" 
                        name="email"
                        style={styles.input}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                    />
                </div>

                {/* 3. 비밀번호 */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>비밀번호</label>
                    <input 
                        type="password" 
                        name="password"
                        style={styles.input}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="비밀번호 입력"
                    />
                </div>

                {/* 4. 닉네임 */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>닉네임</label>
                    <input 
                        type="text" 
                        name="nickname"
                        style={styles.input}
                        value={formData.nickname}
                        onChange={handleChange}
                        placeholder="별명 입력"
                    />
                </div>

                {/* 5. 연락처 (010 고정 + 3분할) */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>연락처</label>
                    <div style={styles.phoneWrapper}>
                        {/* 010 고정 (수정 불가) */}
                        <input 
                            type="text" 
                            value="010" 
                            readOnly 
                            style={styles.phoneInputFixed} 
                        />
                        <span style={styles.dash}>-</span>
                        {/* 가운데 번호 */}
                        <input 
                            type="number" // 숫자만 입력
                            name="contact2"
                            style={styles.phoneInput}
                            value={formData.contact2}
                            onChange={handleChange}
                            placeholder="1234"
                        />
                        <span style={styles.dash}>-</span>
                        {/* 마지막 번호 */}
                        <input 
                            type="number" // 숫자만 입력
                            name="contact3"
                            style={styles.phoneInput}
                            value={formData.contact3}
                            onChange={handleChange}
                            placeholder="5678"
                        />
                    </div>
                </div>

                {/* 6. 가입 완료 버튼 (파란색) */}
                <button 
                    style={styles.signupBtn} 
                    onClick={handleSignup}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'} // 호버 효과 (선택사항)
                    onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                >
                    가입하기
                </button>

                {/* 7. 로그인으로 돌아가기 (배경 없는 텍스트 버튼) */}
                <div style={styles.loginLinkContainer}>
                    <button 
                        onClick={() => navigate('/loginpage')} 
                        style={styles.loginBtn}
                    >
                        로그인으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;