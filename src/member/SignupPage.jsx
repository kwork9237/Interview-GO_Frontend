import React, { useState, useRef } from 'react'; // useRef 추가
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  
  // ★ 포커스 이동을 위한 Ref 설정
  const lastPhoneRef = useRef(null);

  // 입력값 상태 관리
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    phoneMiddle: '', // 중간 번호
    phoneLast: '',   // 마지막 번호
  });

  const { email, password, nickname, phoneMiddle, phoneLast } = formData;

  // 일반 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ★ 중간 번호 핸들러 (최대 4자리, 다 차면 뒤로 이동)
  const handlePhoneMiddle = (e) => {
    const value = e.target.value;
    const onlyNumber = value.replace(/[^0-9]/g, ''); // 숫자만

    if (onlyNumber.length <= 4) {
      setFormData((prev) => ({
        ...prev,
        phoneMiddle: onlyNumber,
      }));

      // 4자리가 되면 자동으로 뒷자리 칸으로 포커스 이동
      if (onlyNumber.length === 4 && lastPhoneRef.current) {
        lastPhoneRef.current.focus();
      }
    }
  };

  // ★ 마지막 번호 핸들러 (최대 4자리)
  const handlePhoneLast = (e) => {
    const value = e.target.value;
    const onlyNumber = value.replace(/[^0-9]/g, ''); // 숫자만

    if (onlyNumber.length <= 4) {
      setFormData((prev) => ({
        ...prev,
        phoneLast: onlyNumber,
      }));
    }
  };

  // 중복확인 (가상 로직)
  const handleCheckDuplicate = (e) => {
    e.preventDefault();
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    alert('사용 가능한 아이디입니다.'); 
  };

  // 회원가입 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (phoneMiddle.length < 3 || phoneLast.length < 4) {
      alert('전화번호를 정확히 입력해주세요.');
      return;
    }

    // ★ 전송 시 합치기: 010-1234-5678 형식
    const fullPhone = `010-${phoneMiddle}-${phoneLast}`;
    
    const submitData = {
      email,
      password,
      nickname,
      phone: fullPhone
    };

    console.log('--- 전송 데이터 확인 ---');
    console.log(submitData);
    
    alert(`${nickname}님 환영합니다!\n(번호: ${fullPhone})`);
    navigate('/login');
  };

  return (
    <div style={styles.fullBackground}>
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
            <div style={styles.inputWithBtnContainer}>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                style={styles.inputShort}
                placeholder="이메일"
                required
              />
              <button type="button" style={styles.checkBtn} onClick={handleCheckDuplicate}>
                중복확인
              </button>
            </div>
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

          {/* 4. 연락처 (3분할 적용) */}
          <div style={styles.inputRow}>
            <label style={styles.label}>TEL</label>
            <div style={styles.phoneContainer}>
              
              {/* [고정] 010 */}
              <input
                type="text"
                value="010"
                readOnly
                tabIndex={-1}
                style={styles.phonePartFixed}
              />
              
              {/* [입력] 중간 번호 */}
              <input
                type="tel"
                name="phoneMiddle"
                value={phoneMiddle}
                onChange={handlePhoneMiddle}
                style={styles.phonePart}
                placeholder=""
                required
              />

              {/* [입력] 마지막 번호 */}
              <input
                type="tel"
                name="phoneLast"
                value={phoneLast}
                onChange={handlePhoneLast}
                style={styles.phonePart}
                placeholder=""
                ref={lastPhoneRef} // 포커스 이동용 Ref 연결
                required
              />
            </div>
          </div>

          {/* 가입 버튼 */}
          <div style={styles.buttonWrapper}>
            <button type="submit" style={styles.signupBtn}>
              가입하기
            </button>
          </div>

          <div style={styles.footer}>
            이미 계정이 있으신가요? 
            <span style={styles.link} onClick={() => navigate('/login')}>로그인</span>
          </div>
        </form>
      </div>
    </div>
  );
};

// 스타일 정의
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
    overflow: 'hidden',
  },
  logoWrapper: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007bff',
    cursor: 'pointer',
    userSelect: 'none',
  },
  signupCard: {
    width: '100%',
    maxWidth: '550px',
    textAlign: 'center',
  },
  header: { marginBottom: '40px' },
  title: { fontSize: '32px', fontWeight: 'bold', color: '#000' },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  label: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginRight: '20px',
    width: '70px',
    textAlign: 'left',
  },
  input: {
    width: '320px',
    height: '50px',
    borderRadius: '25px',
    border: 'none',
    padding: '0 20px',
    fontSize: '16px',
    backgroundColor: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputWithBtnContainer: {
    display: 'flex',
    width: '320px',
    justifyContent: 'space-between',
    gap: '10px',
  },
  inputShort: {
    flex: 1,
    height: '50px',
    borderRadius: '25px',
    border: 'none',
    padding: '0 20px',
    fontSize: '16px',
    backgroundColor: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  },
  checkBtn: {
    width: '100px',
    height: '50px',
    borderRadius: '25px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  // ★ [스타일 추가] 3분할 전화번호 컨테이너
  phoneContainer: {
    display: 'flex',
    width: '320px',
    justifyContent: 'space-between',
    gap: '10px', // 칸 사이 간격
  },
  // 010 고정창 스타일 (작은 사이즈)
  phonePartFixed: {
    width: '80px', // 010 영역 너비
    height: '50px',
    borderRadius: '25px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#ced4da',
    color: '#555',
    textAlign: 'center',
    outline: 'none',
    boxSizing: 'border-box',
    pointerEvents: 'none',
    userSelect: 'none',
  },
  // 중간, 끝 번호 입력창 스타일 (동일 비율)
  phonePart: {
    flex: 1, // 남은 공간을 균등하게 나눔
    height: '50px',
    borderRadius: '25px',
    border: 'none',
    fontSize: '16px',
    textAlign: 'center',
    backgroundColor: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    padding: '0 10px',
  },

  buttonWrapper: { marginTop: '10px' },
  signupBtn: {
    width: '320px',
    height: '55px',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  footer: { marginTop: '20px', fontSize: '16px', color: '#333' },
  link: {
    fontWeight: 'bold',
    color: '#007bff',
    textDecoration: 'none',
    cursor: 'pointer',
    marginLeft: '5px',
  },
};

export default Signup;