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
        // 1. 전체 페이지: 회색 배경(#d9d9d9), 중앙 정렬
        <div className="bg-[#d9d9d9] min-h-screen flex justify-center items-center relative m-0">
            
            {/* 2. 좌측 상단 TEAM LOGO */}
            <div className="absolute top-[30px] left-[30px] text-[#800080] text-[1.8rem] font-bold font-sans">
                TEAM LOGO
            </div>

            {/* 3. 로그인 폼 컨테이너: 너비 600px, 패딩 40px, 세로 배치 */}
            <div className="w-[600px] p-[40px] flex flex-col gap-[30px] box-border">
                
                {/* 타이틀 */}
                <h1 className="text-center text-[2rem] font-bold text-black mb-[10px] mt-0">
                    로그인
                </h1>

                {/* ID 입력 섹션 */}
                <div className="flex items-center">
                    <label className="text-[1.5rem] font-medium w-[60px] mr-[20px] text-left text-black">
                        ID
                    </label>
                    <input 
                        type="text" 
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="flex-1 h-[50px] rounded-[25px] border-none px-[20px] text-[1.2rem] outline-none bg-white"
                    />
                </div>

                {/* PW 입력 섹션 */}
                <div className="flex items-center">
                    <label className="text-[1.5rem] font-medium w-[60px] mr-[20px] text-left text-black">
                        PW
                    </label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex-1 h-[50px] rounded-[25px] border-none px-[20px] text-[1.2rem] outline-none bg-white" 
                    />
                </div>

                {/* 로그인 버튼 컨테이너 (중앙 정렬) */}
                <div className="flex justify-center mt-[10px]">
                    <button 
                        onClick={handleLogin}
                        className="w-full max-w-[300px] h-[55px] bg-[#007bff] text-white border-none rounded-[27.5px] text-[1.3rem] font-bold cursor-pointer hover:bg-blue-600 transition-colors"
                    >
                        로그인
                    </button>
                </div>

                {/* 하단 링크 섹션 */}
                <div className="flex justify-between px-[10px]">
                    <Link to="/signup" className="text-[1.2rem] text-black no-underline cursor-pointer">
                        회원가입
                    </Link>
                    <Link to="#" className="text-[1.2rem] text-black no-underline cursor-pointer">
                        비밀번호 찾기
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;