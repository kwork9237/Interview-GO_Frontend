import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

    // 전송 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || mb_pnumber.length < 12) {
            alert('아이디와 전화번호를 정확히 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/find-password', {
                username,
                mb_pnumber
            });

            if (response.status === 200) {
                const serverGeneratedPw = response.data.tempPassword || response.data.password; 

                if (serverGeneratedPw) {
                    setTempPassword(serverGeneratedPw); 
                    alert(`인증 성공! 임시 비밀번호가 발급되었습니다.`);
                } else {
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
        // 전체 배경: 연한 회색 (통일감 유지)
        <div className="min-h-screen flex flex-col bg-gray-50">
            
            {/* 상단 헤더 (로그인/회원가입과 동일) */}
            <header className="w-full h-20 bg-white border-b border-gray-200 flex items-center px-8 md:px-20 shrink-0">
                <div 
                    className="text-indigo-600 text-2xl font-bold cursor-pointer select-none"
                    onClick={() => navigate('/')}
                >
                    TEAM LOGO
                </div>
            </header>

            {/* 메인 컨텐츠 영역 */}
            <div className="flex-1 flex justify-center items-center p-4">
                
                {/* 폼 컨테이너: 배경 투명, max-w-sm으로 폭 조절 */}
                <div className="w-full max-w-sm flex flex-col gap-8 bg-transparent">
                    
                    {/* 타이틀 */}
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">비밀번호 찾기</h1>
                        <p className="text-gray-500">가입한 정보로 임시 비밀번호를 발급받으세요.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        
                        {/* 1. 아이디 입력 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">아이디 (Email)</label>
                            <input
                                type="email"
                                name="username"
                                value={username}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 text-base outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all bg-white placeholder-gray-400"
                                placeholder="아이디를 입력해주세요"
                                required
                            />
                        </div>

                        {/* 2. 전화번호 입력 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">전화번호</label>
                            <input
                                type="tel"
                                name="mb_pnumber"
                                value={mb_pnumber}
                                onChange={handlePhoneChange}
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 text-base outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all bg-white placeholder-gray-400"
                                placeholder="010-0000-0000"
                                maxLength={13}
                                required
                            />
                        </div>

                        {/* 3. 임시 비밀번호 결과 표시란 */}
                        {/* 비밀번호가 발급되었거나, 자리를 잡아두기 위해 항상 렌더링하되 스타일만 변경 */}
                        <div className="flex flex-col gap-2 mt-2">
                            <span className="text-sm font-bold text-gray-700 ml-1">임시 비밀번호</span>
                            <div 
                                className={`w-full h-16 rounded-xl border-2 flex items-center justify-center text-3xl font-black tracking-widest transition-all duration-300 select-all
                                    ${tempPassword 
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm' // 발급 성공 시 스타일
                                        : 'bg-gray-100 border-gray-200 text-gray-300' // 평소 상태
                                    }
                                `}
                            >
                                {tempPassword ? tempPassword : "----"}
                            </div>
                            {tempPassword && (
                                <p className="text-xs text-indigo-600 text-center animate-pulse">
                                    * 발급된 비밀번호를 복사하여 로그인하세요.
                                </p>
                            )}
                        </div>

                        {/* 4. 발급 버튼 */}
                        <button 
                            type="submit" 
                            className="w-full h-14 mt-2 bg-indigo-600 text-white rounded-xl text-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm active:scale-[0.98] transform duration-100"
                        >
                            임시 비밀번호 발급
                        </button>

                        {/* 5. 하단 링크 */}
                        <div className="flex justify-center gap-6 mt-2 text-sm font-medium text-gray-500">
                            <Link to="/login" className="hover:text-indigo-600 hover:underline transition-colors">
                                로그인
                            </Link>
                            <span className="text-gray-300">|</span>
                            <Link to="/signup" className="hover:text-indigo-600 hover:underline transition-colors">
                                회원가입
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default FindPw;