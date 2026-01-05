import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    // 페이지 이동을 위한 훅
    const navigate = useNavigate();

    // 로그인 입력 폼 상태 관리 (아이디/이메일, 비밀번호)
    const [username, setUsername] = useState('');
    const [mb_password, setMb_password] = useState('');

    // 로그인 버튼 클릭 시 실행되는 핸들러
    const handleLogin = async () => {
        // 1. 유효성 검사: 입력값이 비어있는지 확인
        if (!username || !mb_password) {
            alert('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        // 서버로 보낼 데이터 객체 생성
        const loginData = {
            username: username,
            mb_password: mb_password
        };

        try {
            // 2. 서버 로그인 API 요청
            const response = await axios.post('http://localhost:8080/login', loginData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true // 쿠키/세션 정보 포함 요청
            });

            // 3. 요청 성공 시 처리 (HTTP Status 200)
            if (response.status === 200) {
                console.log('로그인 성공:', response.data);

                // 서버 응답에서 토큰(token)과 사용자 정보(user)를 구조 분해 할당으로 추출
                const { token, user } = response.data;
                
                if (token) {
                    // 4. 클라이언트 저장소(LocalStorage)에 인증 정보 저장
                    // 액세스 토큰 저장 (API 요청 시 인증 헤더로 사용)
                    localStorage.setItem('accessToken', token);
                    
                    // 사용자 정보 객체를 문자열로 변환하여 저장 (마이페이지 등에서 사용)
                    localStorage.setItem('userInfo', JSON.stringify(user));
                    
                    alert('로그인에 성공했습니다.');
                    
                    // 5. 메인 페이지로 이동
                    navigate('/'); 
                } else {
                    alert('로그인은 되었으나 토큰을 받지 못했습니다.');
                }
            }

        } catch (error) {
            // 6. 에러 처리
            console.error('로그인 에러:', error);
            
            // HTTP 상태 코드별 예외 처리
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
        // 전체 레이아웃: 배경색 및 중앙 정렬 설정
        <div className="min-h-screen flex flex-col bg-gray-50">
            
            {/* 상단 헤더 영역: 로고 및 홈 이동 링크 */}
            <header className="w-full h-20 bg-white border-b border-gray-200 flex items-center px-8 md:px-20 shrink-0">
                <div 
                    className="text-indigo-600 text-2xl font-bold cursor-pointer select-none"
                    onClick={() => navigate('/')}
                >
                    TEAM LOGO
                </div>
            </header>

            {/* 메인 컨텐츠 영역: 로그인 폼 배치 */}
            <div className="flex-1 flex justify-center items-center p-4">
                
                <div className="w-full max-w-sm flex flex-col gap-8 bg-transparent">
                    
                    {/* 페이지 타이틀 */}
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">로그인</h1>
                        <p className="text-gray-500">서비스 이용을 위해 로그인해주세요.</p>
                    </div>

                    {/* 입력 필드 그룹 */}
                    <div className="flex flex-col gap-5">
                        {/* 아이디(이메일) 입력 필드 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">아이디 (Email)</label>
                            <input 
                                type="email" 
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 text-base outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all bg-white placeholder-gray-400"
                                placeholder="이메일을 입력해주세요"
                            />
                        </div>

                        {/* 비밀번호 입력 필드 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">비밀번호</label>
                            <input 
                                type="password" 
                                name="mb_password"
                                value={mb_password}
                                onChange={(e) => setMb_password(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 text-base outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all bg-white placeholder-gray-400"
                                placeholder="비밀번호를 입력하세요"
                                // 엔터키 입력 시 로그인 함수 실행
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            />
                        </div>
                    </div>

                    {/* 로그인 실행 버튼 */}
                    <button 
                        onClick={handleLogin}
                        className="w-full h-14 mt-2 bg-indigo-600 text-white rounded-xl text-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm active:scale-[0.98] transform duration-100"
                    >
                        로그인
                    </button>

                    {/* 하단 링크 영역: 회원가입 및 비밀번호 찾기 */}
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