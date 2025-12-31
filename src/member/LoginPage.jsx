import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    // 입력값 상태 관리
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    // 로그인 버튼 클릭 핸들러
    const handleLogin = () => {
        console.log('로그인 시도:', { id, password });
        // 여기에 백엔드 로그인 API 호출 코드를 작성하면 됩니다.
    };

    return (
        // 1. 전체 페이지: 회색 배경, 중앙 정렬
        <div className="bg-gray-300 min-h-screen flex justify-center items-center relative m-0 overflow-y-auto">
            
            {/* 2. 좌측 상단 TEAM LOGO */}
            <div className="absolute top-6 left-6 text-purple-800 text-2xl font-bold font-sans select-none cursor-pointer">
                TEAM LOGO
            </div>

            {/* 3. 로그인 폼 컨테이너: 표준 너비(max-w-md) 사용 */}
            <div className="w-full max-w-md p-8 flex flex-col gap-6 box-border bg-transparent">
                
                {/* 타이틀 */}
                <h1 className="text-center text-3xl font-bold text-black mb-1 mt-0">
                    로그인
                </h1>

                {/* ID 입력 섹션 */}
                <div className="flex items-center gap-4">
                    <label className="text-xl font-medium w-12 text-left text-black shrink-0">
                        ID
                    </label>
                    <input 
                        type="text" 
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        // h-11은 약 44px, rounded-full은 완전 둥근 모서리
                        className="flex-1 h-11 rounded-full border-none px-5 text-base outline-none bg-white shadow-sm focus:ring-2 focus:ring-blue-400 transition-all"
                        placeholder="아이디를 입력하세요"
                    />
                </div>

                {/* PW 입력 섹션 */}
                <div className="flex items-center gap-4">
                    <label className="text-xl font-medium w-12 text-left text-black shrink-0">
                        PW
                    </label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex-1 h-11 rounded-full border-none px-5 text-base outline-none bg-white shadow-sm focus:ring-2 focus:ring-blue-400 transition-all" 
                        placeholder="비밀번호를 입력하세요"
                    />
                </div>

                {/* 로그인 버튼 컨테이너 */}
                <div className="flex justify-center mt-3">
                    <button 
                        onClick={handleLogin}
                        // w-72는 약 288px
                        className="w-72 h-12 bg-blue-500 text-white border-none rounded-full text-lg font-bold cursor-pointer hover:bg-blue-600 transition-colors shadow-md active:scale-95 transform"
                    >
                        로그인
                    </button>
                </div>

                {/* 하단 링크 섹션 */}
                <div className="flex justify-between px-4 mt-1">
                    <Link to="/signup" className="text-sm text-black no-underline cursor-pointer hover:underline hover:text-blue-600 transition-colors">
                        회원가입
                    </Link>
                    <Link to="#" className="text-sm text-black no-underline cursor-pointer hover:underline hover:text-blue-600 transition-colors">
                        비밀번호 찾기
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;