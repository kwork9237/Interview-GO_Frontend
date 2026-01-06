import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    // 페이지 이동을 위한 훅
    const navigate = useNavigate();

    // 로그인 입력 폼 상태 관리
    const [username, setUsername] = useState('');
    const [mb_password, setMb_password] = useState('');
    
    // ✨ 추가: 아이디 저장 체크박스 상태
    const [rememberId, setRememberId] = useState(false);

    // ✨ 추가: 컴포넌트 마운트 시 저장된 아이디 불러오기
    useEffect(() => {
        const savedId = localStorage.getItem('savedId');
        if (savedId) {
            setUsername(savedId);
            setRememberId(true);
        }
    }, []);

    // 로그인 버튼 클릭 시 실행되는 핸들러
    const handleLogin = async () => {
        // 1. 유효성 검사
        if (!username || !mb_password) {
            alert('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

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
                withCredentials: true 
            });

            // 3. 요청 성공 시 처리
            if (response.status === 200) {
                console.log('로그인 성공:', response.data);
                const { token, user } = response.data;
                
                if (token) {
                    // 토큰 및 유저 정보 저장
                    localStorage.setItem('accessToken', token);
                    localStorage.setItem('userInfo', JSON.stringify(user));

                    // ✨ 추가: 아이디 저장 로직 (로그인 성공 시에만 수행)
                    if (rememberId) {
                        localStorage.setItem('savedId', username);
                    } else {
                        localStorage.removeItem('savedId');
                    }
                    
                    alert('로그인에 성공했습니다.');
                    navigate('/'); 
                } else {
                    alert('로그인은 되었으나 토큰을 받지 못했습니다.');
                }
            }

        } catch (error) {
            // 6. 에러 처리
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
        <div className="min-h-screen flex flex-col bg-gray-50">
            
            {/* 상단 헤더 영역 */}
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
                
                <div className="w-full max-w-sm flex flex-col gap-8 bg-transparent">
                    
                    {/* 페이지 타이틀 */}
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">로그인</h1>
                        <p className="text-gray-500">서비스 이용을 위해 로그인해주세요.</p>
                    </div>

                    {/* 입력 필드 그룹 */}
                    <div className="flex flex-col gap-5">
                        {/* 아이디(이메일) */}
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

                        {/* 비밀번호 */}
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
                        
                        {/* ✨ 추가: 아이디 저장 체크박스 & 에러메시지 공간 */}
                        <div className="flex justify-between items-center px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="checkbox"
                                    checked={rememberId}
                                    onChange={(e) => setRememberId(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-indigo-600 transition-colors">아이디 저장</span>
                            </label>

                            {/* (선택사항) 에러 메시지가 뜰 공간을 위해 비워두거나, 나중에 활용 가능 */}
                            {/* <span className="text-xs text-red-500"></span> */}
                        </div>
                    </div>

                    {/* 로그인 실행 버튼 */}
                    <button 
                        onClick={handleLogin}
                        className="w-full h-14 mt-2 bg-indigo-600 text-white rounded-xl text-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm active:scale-[0.98] transform duration-100"
                    >
                        로그인
                    </button>

                    {/* 하단 링크 영역 */}
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