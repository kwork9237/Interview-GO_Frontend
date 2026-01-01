import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FindPw = () => {
  const navigate = useNavigate();

  // 1. 상태 관리
  const [formData, setFormData] = useState({
    username: '',      // 아이디
    mb_pnumber: ''     // 전화번호
  });
  
  // 임시 비밀번호 상태 (초기값은 비어있음)
  const [tempPassword, setTempPassword] = useState('');

  const { username, mb_pnumber } = formData;

  // 2. 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. 전화번호 핸들러
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

  // 4. 전송 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || mb_pnumber.length < 12) {
      alert('아이디와 전화번호를 정확히 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/find-password', {
        username,
        mb_pnumber
      });

      if (response.status === 200) {
        // 백엔드에서 받은 6자리 비밀번호 (키값 확인 필요: tempPassword 등)
        const receivedPw = response.data.tempPassword || response.data.password;
        
        if (receivedPw) {
          setTempPassword(receivedPw); // 여기에 값이 들어가면 화면 상단 박스가 바뀝니다.
          alert("임시 비밀번호가 발급되었습니다.");
        } else {
          alert("서버 응답 오류: 비밀번호를 찾을 수 없습니다.");
        }
      }
    } catch (error) {
      console.error('에러:', error);
      setTempPassword(''); // 실패 시 초기화
      const errorMessage = error.response?.data?.message || '일치하는 정보를 찾을 수 없습니다.';
      alert(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-[#D9D9D9] relative overflow-hidden">
      {/* 로고 */}
      <div 
        className="absolute top-5 left-5 text-2xl font-bold text-[#007bff] cursor-pointer select-none"
        onClick={() => navigate('/')}
      >
        TEAM LOGO
      </div>

      <div className="w-full max-w-[550px] text-center bg-white/50 p-10 rounded-2xl shadow-lg backdrop-blur-sm">
        <div className="mb-6">
          <h1 className="text-[32px] font-bold text-black">비밀번호 찾기</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
          
          {/* === [고정된 임시 비밀번호 표시란] === */}
          {/* 입력 불가능(read-only)한 div 박스입니다 */}
          <div className="w-full flex flex-col items-start gap-2">
            <span className="text-sm font-bold text-gray-600 ml-2">임시 비밀번호 (발급 결과)</span>
            <div 
              className={`w-full h-[60px] rounded-[15px] border-2 flex items-center justify-center text-2xl font-black tracking-[0.5em] transition-all duration-300
                ${tempPassword 
                  ? 'bg-blue-50 border-[#007bff] text-[#007bff]'  // 비밀번호가 있을 때 (활성)
                  : 'bg-gray-200 border-gray-300 text-gray-400'   // 비밀번호가 없을 때 (비활성)
                }`}
            >
              {/* 비밀번호가 없으면 6자리 대시(-), 있으면 비밀번호 표시 */}
              {tempPassword ? tempPassword : "------"}
            </div>
          </div>
          {/* =================================== */}

          {/* 아이디 입력 */}
          <div className="w-full">
            <input
              type="email"
              name="username"
              value={username}
              onChange={handleChange}
              className="w-full h-[50px] rounded-[25px] border border-gray-300 px-5 text-base bg-white outline-none focus:border-[#007bff]"
              placeholder="아이디 (이메일)"
              required
            />
          </div>

          {/* 전화번호 입력 */}
          <div className="w-full">
            <input
              type="tel"
              name="mb_pnumber"
              value={mb_pnumber}
              onChange={handlePhoneChange}
              className="w-full h-[50px] rounded-[25px] border border-gray-300 px-5 text-base bg-white outline-none focus:border-[#007bff]"
              placeholder="전화번호 (010-0000-0000)"
              required
            />
          </div>

          {/* 버튼 영역 */}
          <div className="mt-4 w-full">
            <button 
              type="submit" 
              className="w-full h-[55px] rounded-[30px] border-none bg-[#007bff] text-white text-xl font-bold cursor-pointer hover:bg-blue-600 transition-colors"
            >
              임시 비밀번호 발급
            </button>
          </div>

          {/* 하단 링크 */}
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
             <span className="cursor-pointer hover:text-black hover:underline" onClick={() => navigate('/login')}>로그인</span>
             <span>|</span>
             <span className="cursor-pointer hover:text-black hover:underline" onClick={() => navigate('/signup')}>회원가입</span>
          </div>

        </form>
      </div>
    </div>
  );
};

export default FindPw;