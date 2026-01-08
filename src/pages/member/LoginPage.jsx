import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();

    // AI 면접 시작하기 버튼의 경로 기억을 위해 추가
    const location = useLocation();

    // 로그인 입력 폼 상태 관리 (아이디/이메일, 비밀번호)
    const [username, setUsername] = useState('');
    const [mb_password, setMb_password] = useState('');
    
    // UI 상태 관리
    const [rememberId, setRememberId] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showCapsLock, setShowCapsLock] = useState(false);
    
    // ✨ 추가: 로딩 상태
    const [isLoading, setIsLoading] = useState(false);

    // 초기화: 저장된 아이디 불러오기
    useEffect(() => {
        const savedId = localStorage.getItem('savedId');
        if (savedId) {
            setUsername(savedId);
            setRememberId(true);
        }
    }, []);

    // 툴팁 & CapsLock 타이머 (5초)
    useEffect(() => {
        let timer;
        if (showTooltip) timer = setTimeout(() => setShowTooltip(false), 5000);
        return () => clearTimeout(timer);
    }, [showTooltip]);

    useEffect(() => {
        let timer;
        if (showCapsLock) timer = setTimeout(() => setShowCapsLock(false), 5000);
        return () => clearTimeout(timer);
    }, [showCapsLock]);

    // 체크박스 핸들러
    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        setRememberId(isChecked);
        if (isChecked) setShowTooltip(true);
        else setShowTooltip(false);
    };

    // 키보드 핸들러
    const handlePasswordKeyDown = (e) => {
        if (e.getModifierState("CapsLock")) setShowCapsLock(true);
        else setShowCapsLock(false);
        if (e.key === 'Enter') handleLogin();
    };

    // 로그인 요청 핸들러
    const handleLogin = async () => {
        if (!username || !mb_password) {
            alert('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        const loginData = { username, mb_password };

        // ✨ 로딩 시작
        setIsLoading(true);

        try {
            const response = await axios.post('/api/login', loginData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true 
            });

            const { token, user } = response.data;
            
            if(token) {
                localStorage.setItem('accessToken', token);
                localStorage.setItem('userInfo', JSON.stringify(user));

                if (rememberId) localStorage.setItem('savedId', username);
                else localStorage.removeItem('savedId');

                alert('로그인에 성공했습니다.');

                const destination = location.state?.redirectUrl || '/';
                navigate(destination);
            }

            else {
                alert('토큰을 받지 못했습니다.');
            }
        } 
        catch (error) {
            console.error('로그인 에러:', error);
            if (error.response?.status === 403) alert('아이디 비밀번호가 일치하지 않습니다.');
            else if (error.response?.status === 401) alert('존재하지 않는 계정입니다.');
            else alert('로그인 중 오류가 발생했습니다.');
        }
        finally {
            // ✨ 로딩 끝 (무조건 실행)
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="w-full h-20 bg-white border-b border-gray-200 flex items-center px-8 md:px-20 shrink-0">
                <div className="text-indigo-600 text-2xl font-bold cursor-pointer select-none" onClick={() => navigate('/')}>
                    TEAM LOGO
                </div>
            </header>

            <div className="flex-1 flex justify-center items-center p-4">
                <div className="w-full max-w-sm flex flex-col gap-8 bg-transparent">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">로그인</h1>
                        <p className="text-gray-500">서비스 이용을 위해 로그인해주세요.</p>
                    </div>

                    <div className="flex flex-col gap-5">
                        {/* 아이디 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">아이디 (Email)</label>
                            <input 
                                type="email" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                // ✨ 추가: 자동 포커스
                                autoFocus 
                                className="w-full h-12 px-4 rounded-xl border border-gray-300 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                                placeholder="이메일을 입력해주세요"
                            />
                        </div>

                        {/* 비밀번호 */}
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-sm font-bold text-gray-700 ml-1">비밀번호</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={mb_password}
                                    onChange={(e) => setMb_password(e.target.value)}
                                    className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-300 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all bg-white"
                                    placeholder="비밀번호를 입력하세요"
                                    onKeyDown={handlePasswordKeyDown}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 focus:outline-none">
                                    {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.059 10.059 0 013.999-5.42m3.714-2.172a9.994 9.994 0 018.625 1.564m-6.427 3.443a3 3 0 014.243 4.242" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>}
                                </button>
                            </div>
                            {showCapsLock && (
                                <div className="absolute top-full left-0 mt-1 flex items-center gap-1 text-xs text-red-500 font-medium animate-pulse">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    Caps Lock이 켜져 있습니다.
                                </div>
                            )}
                        </div>
                        
                        {/* 아이디 저장 & 툴팁 */}
                        <div className="flex justify-between items-center px-1 relative">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" checked={rememberId} onChange={handleCheckboxChange} className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                                <span className="text-sm text-gray-600 group-hover:text-indigo-600 transition-colors">아이디 저장</span>
                            </label>
                            {showTooltip && (
                                <div className="absolute left-0 bottom-8 z-10 w-max bg-gray-800 text-white text-xs rounded-md shadow-lg p-2.5 animate-fade-in-up">
                                    <div className="flex items-center gap-2">
                                        <span>공용 PC에서는 사용을 권장하지 않습니다.</span>
                                        <button onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }} className="text-gray-400 hover:text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>
                                    <div className="absolute top-full left-4 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-gray-800"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ✨ 로딩 적용된 로그인 버튼 */}
                    <button 
                        onClick={handleLogin}
                        disabled={isLoading}
                        className={`w-full h-14 mt-2 text-white rounded-xl text-lg font-bold transition-all shadow-sm flex justify-center items-center
                            ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'}`}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : "로그인"}
                    </button>

                    <div className="flex justify-center gap-6 mt-2 text-sm font-medium text-gray-500">
                        <Link to="/signup" className="hover:text-indigo-600 hover:underline transition-colors">회원가입</Link>
                        <span className="text-gray-300">|</span>
                        <Link to="/findpw" className="hover:text-indigo-600 hover:underline transition-colors">비밀번호 찾기</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;