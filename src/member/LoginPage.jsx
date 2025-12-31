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
        <div className="bg-[#d9d9d9] min-h-screen flex justify-center items-center relative m-0 overflow-y-auto">
            
            {/* 2. 좌측 상단 TEAM LOGO (위치와 크기 약간 축소) */}
            <div className="absolute top-[25px] left-[25px] text-[#800080] text-[1.5rem] font-bold font-sans select-none cursor-pointer">
                TEAM LOGO
            </div>

            {/* 3. 로그인 폼 컨테이너: 너비 600->450px, 패딩 축소, 간격 축소 */}
            <div className="w-[450px] p-[30px] flex flex-col gap-[20px] box-border bg-transparent">
                
                {/* 타이틀: 폰트 사이즈 2rem -> 1.8rem */}
                <h1 className="text-center text-[1.8rem] font-bold text-black mb-[5px] mt-0">
                    로그인
                </h1>

                {/* ID 입력 섹션 */}
                <div className="flex items-center">
                    {/* 라벨 폰트 1.5rem -> 1.2rem */}
                    <label className="text-[1.2rem] font-medium w-[50px] mr-[15px] text-left text-black">
                        ID
                    </label>
                    <input 
                        type="text" 
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        // 높이 50px -> 45px
                        className="flex-1 h-[45px] rounded-[22.5px] border-none px-[20px] text-[1rem] outline-none bg-white shadow-sm"
                        placeholder="아이디를 입력하세요"
                    />
                </div>

                {/* PW 입력 섹션 */}
                <div className="flex items-center">
                    <label className="text-[1.2rem] font-medium w-[50px] mr-[15px] text-left text-black">
                        PW
                    </label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        // 높이 50px -> 45px
                        className="flex-1 h-[45px] rounded-[22.5px] border-none px-[20px] text-[1rem] outline-none bg-white shadow-sm" 
                        placeholder="비밀번호를 입력하세요"
                    />
                </div>

                {/* 로그인 버튼 컨테이너 */}
                <div className="flex justify-center mt-[10px]">
                    <button 
                        onClick={handleLogin}
                        // 높이 55px -> 50px, 폰트 1.3rem -> 1.1rem
                        className="w-full max-w-[280px] h-[50px] bg-[#007bff] text-white border-none rounded-[25px] text-[1.1rem] font-bold cursor-pointer hover:bg-blue-600 transition-colors shadow-md"
                    >
                        로그인
                    </button>
                </div>

                {/* 하단 링크 섹션: 폰트 1.2rem -> 0.95rem */}
                <div className="flex justify-between px-[15px] mt-[5px]">
                    <Link to="/signup" className="text-[0.95rem] text-black no-underline cursor-pointer hover:underline">
                        회원가입
                    </Link>
                    <Link to="#" className="text-[0.95rem] text-black no-underline cursor-pointer hover:underline">
                        비밀번호 찾기
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;