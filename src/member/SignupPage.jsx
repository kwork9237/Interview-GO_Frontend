import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();

  // 상태 관리 변수
  const [formData, setFormData] = useState({
    username: '',      
    mb_password: '',   
    mb_nickname: '',   
    mb_pnumber: '',    
  });

  // 중복 검사 통과 여부 상태 (false면 가입 불가)
  const [isIdChecked, setIsIdChecked] = useState(false);

  const { username, mb_password, mb_nickname, mb_pnumber } = formData;

  // 일반 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // ID(username)가 변경되면 중복 검사 상태를 초기화 (다시 검사받아야 함)
    if (name === 'username') {
      setIsIdChecked(false);
    }
  };

  // 전화번호 입력 핸들러
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    let formattedPhone = '';

    if (value.length <= 3) {
      formattedPhone = value;
    } else if (value.length <= 7) {
      formattedPhone = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else {
      formattedPhone = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }

    if (formattedPhone.length <= 13) {
      setFormData((prev) => ({ ...prev, mb_pnumber: formattedPhone }));
    }
  };

  // *** 중복 검사 핸들러 추가 ***
  const handleCheckDuplicate = async () => {
    if (!username) {
      alert('ID(이메일)를 입력해주세요.');
      return;
    }

    try {
      // 백엔드 중복 검사 API 호출 (주소는 실제 백엔드에 맞춰 수정 필요)
      // 예: GET /check-id?username=test@test.com
      const response = await axios.get(`http://localhost:8080/check-id`, {
        params: { username: username }
      });

      // 백엔드 응답 로직에 따라 조건 수정 (예: result가 true면 사용 가능)
      // 여기서는 status 200이고 data가 true라고 가정
      if (response.status === 200 && response.data === true) { 
        alert('사용 가능한 ID입니다.');
        setIsIdChecked(true); // 검사 통과 상태로 변경
      } else {
        alert('이미 사용 중인 ID입니다.');
        setIsIdChecked(false);
      }
    } catch (error) {
      console.error('중복 검사 에러:', error);
      // 에러 상황(이미 존재하는 ID 등)에 맞춰 메시지 처리
      const msg = error.response?.data?.message || '이미 사용 중인 ID입니다.';
      alert(msg);
      setIsIdChecked(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. 중복 검사 확인
    if (!isIdChecked) {
      alert('ID 중복 검사를 진행해주세요.');
      return;
    }

    // 2. 전화번호 유효성 검사
    const phoneNumeric = mb_pnumber.replace(/-/g, '');
    if (phoneNumeric.length < 10) {
      alert('전화번호를 정확히 입력해주세요.');
      return;
    }

    const submitData = {
      username,
      mb_password,
      mb_nickname,
      mb_pnumber
    };
    
    try {
      const response = await axios.post('http://localhost:8080/join', submitData);

      if (response.status === 200 || response.status === 201) {
        alert(`${mb_nickname}님 회원가입이 완료되었습니다!`);
        navigate('/login'); 
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
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
          
          {/* 1. 이메일 (ID) + 중복검사 버튼 */}
          <div className="flex items-center w-full justify-center">
            <label className="text-2xl font-bold mr-5 w-[70px] text-left">ID</label>
            
            {/* 입력창과 버튼을 감싸는 div (너비 350px 유지) */}
            <div className="flex w-[350px] justify-between">
              <input
                type="email"
                name="username"
                value={username}
                onChange={handleChange}
                // 너비를 줄여서(240px) 버튼 공간 확보
                className="w-[240px] h-[50px] rounded-[25px] border-none px-5 text-base bg-white outline-none box-border"
                placeholder="이메일"
                required
              />
              <button
                type="button" // form submit 방지
                onClick={handleCheckDuplicate}
                className="w-[100px] h-[50px] rounded-[25px] border-none bg-[#6c757d] text-white text-sm font-bold cursor-pointer hover:bg-[#5a6268] transition-colors"
              >
                중복확인
              </button>
            </div>
          </div>

          {/* 2. 비밀번호 */}
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

          {/* 3. 닉네임 */}
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

          {/* 4. 연락처 */}
          <div className="flex items-center w-full justify-center">
            <label className="text-2xl font-bold mr-5 w-[70px] text-left">TEL</label>
            <input
              type="tel"
              name="mb_pnumber"
              value={mb_pnumber}
              onChange={handlePhoneChange}
              className="w-[350px] h-[50px] rounded-[25px] border-none px-5 text-base bg-white outline-none box-border"
              placeholder="010-0000-0000"
              required
            />
          </div>

          {/* 가입 버튼 */}
          <div className="mt-2.5">
            <button 
              type="submit" 
              // 중복체크 안했으면 버튼 색상을 회색으로 보이게 하거나 스타일 조정 가능 (선택사항)
              className={`w-[350px] h-[55px] rounded-[30px] border-none text-white text-xl font-bold cursor-pointer transition-colors ${
                isIdChecked ? 'bg-[#007bff] hover:bg-blue-600' : 'bg-[#007bff] opacity-80'
              }`}
            >
              가입하기
            </button>
          </div>

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