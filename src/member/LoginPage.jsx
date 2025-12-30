import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    // 입력값 상태 관리
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    // --- 스타일 정의 (CSS 파일 대체) ---
    const styles = {
        // 1. 전체 페이지: 회색 배경, 중앙 정렬
        page: {
            backgroundColor: '#d9d9d9', // 진한 회색
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            margin: 0,
        },
        // 2. 좌측 상단 TEAM LOGO
        teamLogo: {
            position: 'absolute',
            top: '30px',
            left: '30px',
            color: '#800080',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
        },
        // 3. 로그인 폼 컨테이너
        container: {
            width: '600px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px', // 요소들 사이의 간격
            boxSizing: 'border-box',
        },
        // 타이틀
        title: {
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '10px', // 간격 약간 조정
            marginTop: 0,
        },
        // 입력 줄 (라벨 + 인풋)
        inputRow: {
            display: 'flex',
            alignItems: 'center',
            // justifyContent: 'center', // 삭제: 버튼이 없어져서 중앙 정렬 불필요
        },
        // 라벨
        label: {
            fontSize: '1.5rem',
            fontWeight: '500',
            width: '60px',
            marginRight: '20px',
            textAlign: 'left',
            color: '#000',
        },
        // 입력창 공통 스타일
        input: {
            flex: 1, // 남은 공간 꽉 채우기
            height: '50px',
            borderRadius: '25px',
            border: 'none',
            padding: '0 20px',
            fontSize: '1.2rem',
            outline: 'none',
            backgroundColor: 'white',
        },
        // ★ 새로 추가: 로그인 버튼 컨테이너 (중앙 정렬용) ★
        buttonContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px', // 위 요소와의 간격
        },
        // ★ 새로 추가: 로그인 버튼 스타일 (파란 배경, 흰 글씨) ★
        loginBtn: {
            width: '100%',         // 컨테이너 너비에 맞춤
            maxWidth: '300px',     // 너무 넓지 않게 최대 너비 설정
            height: '55px',        // 입력창보다 약간 크게
            backgroundColor: '#007bff', // 요청하신 파란색
            color: 'white',        // 흰색 글씨
            border: 'none',
            borderRadius: '27.5px', // 둥근 모서리
            fontSize: '1.3rem',
            fontWeight: 'bold',
            cursor: 'pointer',
        },
        // 하단 링크
        footer: {
            display: 'flex',
            justifyContent: 'space-between',
            // marginTop: '30px', // 삭제: 컨테이너의 gap으로 충분함
            padding: '0 10px',
        },
        link: {
            fontSize: '1.2rem',
            color: '#000',
            textDecoration: 'none',
            cursor: 'pointer',
        }
    };

    // 로그인 버튼 클릭 핸들러 (기능 구현용)
    const handleLogin = () => {
        console.log('로그인 시도:', { id, password });
        // 여기에 백엔드 로그인 API 호출 코드를 작성하면 됩니다.
    };

    return (
        <div style={styles.page}>
            {/* 팀 로고 */}
            <div style={styles.teamLogo}>TEAM LOGO</div>

            <div style={styles.container}>
                
                {/* 타이틀 */}
                <h1 style={styles.title}>로그인</h1>

                {/* ID 입력 섹션 */}
                <div style={styles.inputRow}>
                    <label style={styles.label}>ID</label>
                    <input 
                        type="text" 
                        style={styles.input}
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    {/* 임시 창 닫기 버튼 삭제됨 */}
                </div>

                {/* PW 입력 섹션 */}
                <div style={styles.inputRow}>
                    <label style={styles.label}>PW</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        // 버튼이 없어졌으므로 오른쪽 여백을 제거하고 기본 스타일만 적용
                        style={styles.input} 
                    />
                </div>

                {/* ★ 새로 추가된 로그인 버튼 ★ */}
                <div style={styles.buttonContainer}>
                    <button style={styles.loginBtn} onClick={handleLogin}>
                        로그인
                    </button>
                </div>

                {/* 하단 링크 섹션 */}
                <div style={styles.footer}>
                    <Link to="/signup" style={styles.link}>회원가입</Link>
                    <Link to="#" style={styles.link}>비밀번호 찾기</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;