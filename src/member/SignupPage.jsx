import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const lastPhoneRef = useRef(null);

  // 입력값 상태 관리
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    phoneMiddle: '',
    phoneLast: '',
  });

  const { email, password, nickname, phoneMiddle, phoneLast } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneMiddle = (e) => {
    const value = e.target.value;
    const onlyNumber = value.replace(/[^0-9]/g, '');
    if (onlyNumber.length <= 4) {
      setFormData((prev) => ({ ...prev, phoneMiddle: onlyNumber }));
      if (onlyNumber.length === 4 && lastPhoneRef.current) {
        lastPhoneRef.current.focus();
      }
    }
  };

  const handlePhoneLast = (e) => {
    const value = e.target.value;
    const onlyNumber = value.replace(/[^0-9]/g, '');
    if (onlyNumber.length <= 4) {
      setFormData((prev) => ({ ...prev, phoneLast: onlyNumber }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneMiddle.length < 3 || phoneLast.length < 4) {
      alert('전화번호를 정확히 입력해주세요.');
      return;
    }
    const fullPhone = `010-${phoneMiddle}-${phoneLast}`;
    const submitData = {
      email,
      password,
      nickname,
      phone: fullPhone
    };
    console.log(submitData);
    alert(`${nickname}님 환영합니다!\n(번호: ${fullPhone})`);
    navigate('/login');
  };

  return (
    <div style={styles.fullBackground}>
      {/* 로고 */}
      <div style={styles.logoWrapper} onClick={() => navigate('/')}>
        TEAM LOGO
      </div>

      <div style={styles.signupCard}>
        <div style={styles.header}>
          <h1 style={styles.title}>회원가입</h1>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* 1. 이메일 */}
          <div style={styles.inputRow}>
            <label style={styles.label}>ID</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              style={styles.input} 
              placeholder="이메일"
              required
            />
          </div>

          {/* 2. 비밀번호 */}
          <div style={styles.inputRow}>
            <label style={styles.label}>PW</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              style={styles.input}
              placeholder="비밀번호"
              required
            />
          </div>

          {/* 3. 닉네임 */}
          <div style={styles.inputRow}>
            <label style={styles.label}>NICK</label>
            <input
              type="text"
              name="nickname"
              value={nickname}
              onChange={handleChange}
              style={styles.input}
              placeholder="닉네임"
              required
            />
          </div>

          {/* 4. 연락처 */}
          <div style={styles.inputRow}>
            <label style={styles.label}>TEL</label>
            <div style={styles.phoneContainer}>
              <input
                type="text"
                value="010"
                readOnly
                tabIndex={-1}
                style={styles.phonePartFixed}
              />
              <input
                type="tel"
                name="phoneMiddle"
                value={phoneMiddle}
                onChange={handlePhoneMiddle}
                style={styles.phonePart}
                required
              />
              <input
                type="tel"
                name="phoneLast"
                value={phoneLast}
                onChange={handlePhoneLast}
                style={styles.phonePart}
                ref={lastPhoneRef}
                required
              />
            </div>
          </div>

          {/* 가입 버튼 영역 */}
          <div style={styles.buttonWrapper}>
            <button type="submit" style={styles.signupBtn}>
              가입하기
            </button>
          </div>

          {/* 로그인 화면으로 돌아가기 버튼 */}
          <button 
            type="button" 
            style={styles.backToLoginBtn} 
            onClick={() => navigate('/login')}
          >
            로그인 화면으로 돌아가기
          </button>

        </form>
      </div>
    </div>
  );
};

// 스타일 상수
const INPUT_WIDTH = '340px'; // 너비 약간 축소
const LABEL_WIDTH = '60px';
const INPUT_HEIGHT = '45px'; // 높이 50 -> 45로 축소
const BORDER_RADIUS = '22.5px'; // 높이의 절반

const styles = {
  fullBackground: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#D9D9D9',
    position: 'relative',
    margin: 0,
    padding: 0,
    overflowY: 'auto', // 화면이 너무 작을 경우 스크롤 허용
  },
  logoWrapper: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    fontSize: '20px', // 폰트 크기 조정
    fontWeight: 'bold',
    color: '#007bff',
    cursor: 'pointer',
    userSelect: 'none',
  },
  signupCard: {
    width: '100%',
    maxWidth: '500px', // 카드 최대 너비 약간 축소
    textAlign: 'center',
    padding: '20px', // 내부 여백 추가
  },
  header: { marginBottom: '20px' }, // 마진 40 -> 20 축소
  title: { fontSize: '28px', fontWeight: 'bold', color: '#000', margin: 0 }, // 폰트 32 -> 28, 기본 마진 제거
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px', // 간격 20 -> 15 축소
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  label: {
    fontSize: '18px', // 폰트 24 -> 18 축소 (밸런스 조정)
    fontWeight: 'bold',
    marginRight: '15px',
    width: LABEL_WIDTH,
    textAlign: 'left',
  },
  // [일반 입력창]
  input: {
    width: INPUT_WIDTH,
    height: INPUT_HEIGHT,
    borderRadius: BORDER_RADIUS,
    border: 'none',
    padding: '0 20px',
    fontSize: '15px',
    backgroundColor: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  },
  // [전화번호 컨테이너]
  phoneContainer: {
    display: 'flex',
    width: INPUT_WIDTH,
    justifyContent: 'space-between',
    gap: '8px',
  },
  phonePartFixed: {
    width: '80px',
    height: INPUT_HEIGHT,
    borderRadius: BORDER_RADIUS,
    border: 'none',
    fontSize: '15px',
    fontWeight: 'bold',
    backgroundColor: '#ced4da',
    color: '#555',
    textAlign: 'center',
    outline: 'none',
    boxSizing: 'border-box',
    pointerEvents: 'none',
    userSelect: 'none',
  },
  phonePart: {
    flex: 1,
    height: INPUT_HEIGHT,
    borderRadius: BORDER_RADIUS,
    border: 'none',
    fontSize: '15px',
    textAlign: 'center',
    backgroundColor: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    padding: '0 10px',
  },
  buttonWrapper: { marginTop: '10px' },
  signupBtn: {
    width: INPUT_WIDTH,
    height: '50px', // 버튼 높이 55 -> 50 축소
    borderRadius: '25px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '18px', // 폰트 20 -> 18
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  backToLoginBtn: {
    marginTop: '5px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#555',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Signup;