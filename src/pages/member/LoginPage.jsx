import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();

    // 변수명: username, mb_password
    const [username, setUsername] = useState('');
    const [mb_password, setMb_password] = useState('');

    const handleLogin = async () => {
        if (!username || !mb_password) {
            alert('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        const loginData = {
            username: username,
            mb_password: mb_password
        };

        try {
            const response = await axios.post('http://localhost:8080/login', loginData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true 
            });

            if (response.status === 200) {
                console.log('로그인 성공:', response.data);
                const token = response.headers['authorization'] || response.data;
                
                if (token) {
                    localStorage.setItem('accessToken', token);
                }
                
                alert('로그인에 성공했습니다.');
                navigate('/'); 
            }

        } catch (error) {
            console.error('로그인 에러:', error);
            if (error.response && error.response.status === 403) {
                alert('아이디 비밀번호가 일치하지 않습니다 다시 확인해주시기 바랍니다.');
            } else if (error.response && error.response.status === 401) {
                alert('아이디 또는 비밀번호가 일치하지 않습니다.');
            } else {
                alert('로그인 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        // 전체 배경은 아주 연한 회색(bg-gray-50)으로 설정하여 헤더와 구분감 생성
        <div className="min-h-screen flex flex-col bg-gray-50">
            
            {/* [수정된 상단 헤더] 
                bg-white: 흰색 배경 추가
                border-b border-gray-200: 하단에 연한 회색 구분선 추가
            */}
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
                
                {/* 로그인 폼 컨테이너: 배경 없이 투명하게(bg-transparent) 유지 */}
                <div className="w-full max-w-sm flex flex-col gap-8 bg-transparent">
                    
                    {/* 타이틀 */}
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">로그인</h1>
                        <p className="text-gray-500">서비스 이용을 위해 로그인해주세요.</p>
                    </div>

                    {/* 입력 폼 영역 */}
                    <div className="flex flex-col gap-5">
                        {/* ID 입력 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">아이디 (Email)</label>
                            <input 
                                type="email" 
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                // 입력창은 배경을 흰색(bg-white)으로 유지
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 text-base outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all bg-white placeholder-gray-400"
                                placeholder="이메일을 입력해주세요"
                            />
                        </div>

                        {/* PW 입력 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">비밀번호</label>
                            <input 
                                type="password" 
                                name="mb_password"
                                value={mb_password}
                                onChange={(e) => setMb_password(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 text-base outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all bg-white placeholder-gray-400"
                                placeholder="비밀번호를 입력하세요"
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            />
                        </div>
                    </div>

                    {/* 로그인 버튼 */}
                    <button 
                        onClick={handleLogin}
                        className="w-full h-14 mt-2 bg-indigo-600 text-white rounded-xl text-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm active:scale-[0.98] transform duration-100"
                    >
                        로그인
                    </button>

                    {/* 하단 링크 */}
                    <div className="flex justify-center gap-6 mt-2 text-sm font-medium text-gray-500">
                        <Link to="/signup" className="hover:text-indigo-600 hover:underline transition-colors">
                            회원가입
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link to="/findpw" className="hover:text-indigo-600 hover:underline transition-colors">
                            비밀번호 찾기
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;