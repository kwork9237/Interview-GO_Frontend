import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FindPw = () => {
  const navigate = useNavigate();

  // 1. 입력 폼 상태
  const [formData, setFormData] = useState({
    username: '',      // 아이디
    mb_pnumber: ''     // 전화번호
  });
  
  // 2. 임시 비밀번호 상태
  const [tempPassword, setTempPassword] = useState('');

  const { username, mb_pnumber } = formData;

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 전화번호 자동 하이픈
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

  // ★ 핵심 수정: 전송 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || mb_pnumber.length < 12) {
      alert('아이디와 전화번호를 정확히 입력해주세요.');
      return;
    }

    try {
      // 서버 요청
      // 백엔드에서는 이 요청을 받으면:
      // 1. 유저 확인
      // 2. 4자리 숫자 생성 및 DB 업데이트
      // 3. JSON 응답으로 { "tempPassword": "1234" } 형태를 반환해야 함
      const response = await axios.post('http://localhost:8080/find-password', {
        username,
        mb_pnumber
      });

      // 성공(200 OK) 시 서버가 준 데이터 활용
      if (response.status === 200) {
        
        // ★ [수정됨] 백엔드에서 보내준 값(response.data)을 사용
        // 백엔드 컨트롤러가 반환하는 키값(예: tempPassword)과 정확히 일치해야 합니다.
        const serverGeneratedPw = response.data.tempPassword || response.data.password; 

        if (serverGeneratedPw) {
            setTempPassword(serverGeneratedPw); 
            alert(`인증 성공! 임시 비밀번호가 발급되었습니다.`);
        } else {
            // 200 OK지만 데이터가 없을 경우
            alert("서버 응답에 비밀번호 데이터가 없습니다. 관리자에게 문의하세요.");
        }
      }

    } catch (error) {
      console.error('에러:', error);
      setTempPassword('');
      const errorMessage = error.response?.data?.message || '일치하는 정보를 찾을 수 없습니다.';
      alert(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-[#D9D9D9] relative overflow-hidden">
      
      {/* 왼쪽 상단 로고 */}
      <div 
        className="absolute top-5 left-5 text-2xl font-bold text-[#007bff] cursor-pointer select-none hover:opacity-80 transition-opacity"
        onClick={() => navigate('/')}
      >
        TEAM LOGO
      </div>

      <div className="w-full max-w-[550px] text-center bg-white/50 p-10 rounded-2xl shadow-lg backdrop-blur-sm">
        <div className="mb-6">
          <h1 className="text-[32px] font-bold text-black">비밀번호 찾기</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
          
          {/* 1. 아이디 입력 */}
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

          {/* 2. 전화번호 입력 */}
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

          {/* 3. 발급 버튼 */}
          <div className="w-full mt-2">
            <button 
              type="submit" 
              className="w-full h-[55px] rounded-[30px] border-none bg-[#007bff] text-white text-xl font-bold cursor-pointer hover:bg-blue-600 transition-colors"
            >
              임시 비밀번호 발급
            </button>
          </div>

          {/* 4. 임시 비밀번호 결과 표시란 */}
          <div className="w-full flex flex-col items-start gap-2 mt-2">
            <span className="text-sm font-bold text-gray-600 ml-2">발급된 임시 비밀번호</span>
            <div 
              className={`w-full h-[60px] rounded-[15px] border-2 flex items-center justify-center text-3xl font-black tracking-[0.5em] transition-all duration-300 select-all
                ${tempPassword 
                  ? 'bg-blue-50 border-[#007bff] text-[#007bff]' 
                  : 'bg-gray-200 border-gray-300 text-gray-400'
                }`}
            >
              {tempPassword ? tempPassword : "----"}
            </div>
          </div>

          {/* 5. 하단 링크 */}
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