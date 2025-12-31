import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();

  // 1. 상태 관리 변수명 변경 (mb_pnum -> mb_pnumber)
  const [formData, setFormData] = useState({
    username: '',      
    mb_password: '',   
    mb_nickname: '',   
    mb_pnumber: '',    // 수정됨: mb_pnum -> mb_pnumber
  });

  // 구조 분해 할당 변경
  const { username, mb_password, mb_nickname, mb_pnumber } = formData;

  // 일반 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 전화번호 입력 핸들러 (자동 하이픈 적용)
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 추출
    let formattedPhone = '';

    if (value.length <= 3) {
      formattedPhone = value;
    } else if (value.length <= 7) {
      formattedPhone = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else {
      formattedPhone = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }

    // 최대 13자리(하이픈 포함)까지만 입력 가능하도록 제한
    if (formattedPhone.length <= 13) {
      // 2. 여기서도 mb_pnumber로 업데이트
      setFormData((prev) => ({ ...prev, mb_pnumber: formattedPhone }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사: (mb_pnumber 사용)
    const phoneNumeric = mb_pnumber.replace(/-/g, '');
    if (phoneNumeric.length < 10) {
      alert('전화번호를 정확히 입력해주세요.');
      return;
    }

    // 전송 데이터 구성
    const submitData = {
      username,
      mb_password,
      mb_nickname,
      mb_pnumber // 수정됨
    };
    
    try {
      // 실제 백엔드 API 주소 (예: 'http://localhost:8080/join')
      const response = await axios.post('http://localhost:8080/join', submitData);

      // 요청 성공 시
      if (response.status === 200 || response.status === 201) {
        alert(`${mb_nickname}님 회원가입이 완료되었습니다!`);
        navigate('/login'); 
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.';
      alert(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-[#D9D9D9] relative overflow-hidden m-0 p-0">
      {/* 로고 */}
      <div 
        className="absolute top-5 left-5 text-2xl font-bold text-[#007bff] cursor-pointer select-none"
        onClick={() => navigate('/')}
      >
        TEAM LOGO
      </div>

      <div className="w-full max-w-[550px] text-center">
        <div className="mb-10">
          <h1 className="text-[32px] font-bold text-black">회원가입</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
          
          {/* 1. 이메일 (username) */}
          <div className="flex items-center w-full justify-center">
            <label className="text-2xl font-bold mr-5 w-[70px] text-left">ID</label>
            <input
              type="email"
              name="username"
              value={username}
              onChange={handleChange}
              className="w-[350px] h-[50px] rounded-[25px] border-none px-5 text-base bg-white outline-none box-border"
              placeholder="이메일"
              required
            />
          </div>

          {/* 2. 비밀번호 (mb_password) */}
          <div className="flex items-center w-full justify-center">
            <label className="text-2xl font-bold mr-5 w-[70px] text-left">PW</label>
            <input
              type="password"
              name="mb_password"
              value={mb_password}
              onChange={handleChange}
              className="w-[350px] h-[50px] rounded-[25px] border-none px-5 text-base bg-white outline-none box-border"
              placeholder="비밀번호"
              required
            />
          </div>

          {/* 3. 닉네임 (mb_nickname) */}
          <div className="flex items-center w-full justify-center">
            <label className="text-2xl font-bold mr-5 w-[70px] text-left">NICK</label>
            <input
              type="text"
              name="mb_nickname"
              value={mb_nickname}
              onChange={handleChange}
              className="w-[350px] h-[50px] rounded-[25px] border-none px-5 text-base bg-white outline-none box-border"
              placeholder="닉네임"
              required
            />
          </div>

          {/* 4. 연락처 (mb_pnumber) */}
          <div className="flex items-center w-full justify-center">
            <label className="text-2xl font-bold mr-5 w-[70px] text-left">TEL</label>
            <input
              type="tel"
              name="mb_pnumber"     // 수정됨: name 변경
              value={mb_pnumber}    // 수정됨: value 변경
              onChange={handlePhoneChange}
              className="w-[350px] h-[50px] rounded-[25px] border-none px-5 text-base bg-white outline-none box-border"
              placeholder="010-0000-0000"
              required
            />
          </div>

          {/* 가입 버튼 영역 */}
          <div className="mt-2.5">
            <button 
              type="submit" 
              className="w-[350px] h-[55px] rounded-[30px] border-none bg-[#007bff] text-white text-xl font-bold cursor-pointer hover:bg-blue-600 transition-colors"
            >
              가입하기
            </button>
          </div>

          {/* 로그인 화면으로 돌아가기 버튼 */}
          <button 
            type="button" 
            className="mt-1.5 bg-transparent border-none text-[#555] text-sm font-bold cursor-pointer underline hover:text-black"
            onClick={() => navigate('/login')}
          >
            로그인 화면으로 돌아가기
          </button>

        </form>
      </div>
    </div>
  );
};

export default Signup;