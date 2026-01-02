import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import axios from 'axios'; // axios 임포트

const LoginPage = () => {
    const navigate = useNavigate(); // 페이지 이동 훅

    // 변수명: username, mb_password
    const [username, setUsername] = useState('');
    const [mb_password, setMb_password] = useState('');

    const handleLogin = async () => {
        // 1. 유효성 검사
        if (!username || !mb_password) {
            alert('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        const loginData = {
            username: username,
            mb_password: mb_password // 주의: 백엔드가 'password'라는 키값을 원할 확률이 높습니다. 만약 백엔드 DTO가 mb_password라면 그대로 두세요. 여기서는 안전하게 매핑했습니다.
        };

        try {
            // 2. 백엔드로 로그인 요청 (주소 확인 필요)
            const response = await axios.post('http://localhost:8080/login', loginData, {
                headers: {
                    'Content-Type': 'application/json', // JSON 형식 명시
                },
                withCredentials: true // CORS 쿠키 공유 필요시 true (옵션)
            });

            // 3. 로그인 성공 처리 (200 OK)
            if (response.status === 200) {
                console.log('로그인 성공:', response.data);

                // 헤더에서 토큰 꺼내기 (Authorization 헤더 사용 시)
 //             const token = response.headers['authorization'] || response.data.token;
                const token = response.headers['authorization'] || response.data;
                
                if (token) {
                    localStorage.setItem('accessToken', token); // 로컬 스토리지 저장
                }
                
                alert('로그인에 성공했습니다.');
                navigate('/'); // 메인 페이지로 이동
            }

        } catch (error) {
            // 4. 에러 처리
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
        <div className="bg-gray-300 min-h-screen flex justify-center items-center relative m-0 overflow-y-auto">
            
            {/* 로고 클릭 시 홈 이동 */}
            <div 
                className="absolute top-6 left-6 text-purple-800 text-2xl font-bold font-sans select-none cursor-pointer"
                onClick={() => navigate('/')}
            >
                TEAM LOGO
            </div>

            <div className="w-full max-w-md p-8 flex flex-col gap-6 box-border bg-transparent">
                <h1 className="text-center text-3xl font-bold text-black mb-1 mt-0">
                    로그인
                </h1>

                {/* ID 입력 */}
                <div className="flex items-center gap-4">
                    <label className="text-xl font-medium w-12 text-left text-black shrink-0">ID</label>
                    <input 
                        type="email" 
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="flex-1 h-11 rounded-full border-none px-5 text-base outline-none bg-white shadow-sm focus:ring-2 focus:ring-blue-400 transition-all"
                        placeholder="이메일을 입력해주세요"
                    />
                </div>

                {/* PW 입력 */}
                <div className="flex items-center gap-4">
                    <label className="text-xl font-medium w-12 text-left text-black shrink-0">PW</label>
                    <input 
                        type="password" 
                        name="mb_password"
                        value={mb_password}
                        onChange={(e) => setMb_password(e.target.value)}
                        className="flex-1 h-11 rounded-full border-none px-5 text-base outline-none bg-white shadow-sm focus:ring-2 focus:ring-blue-400 transition-all" 
                        placeholder="비밀번호를 입력하세요"
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()} // 엔터키 로그인 기능 추가
                    />
                </div>

                <div className="flex justify-center mt-3">
                    <button 
                        onClick={handleLogin}
                        className="w-72 h-12 bg-blue-500 text-white border-none rounded-full text-lg font-bold cursor-pointer hover:bg-blue-600 transition-colors shadow-md active:scale-95 transform"
                    >
                        로그인
                    </button>
                </div>

                <div className="flex justify-between px-4 mt-1">
                    <Link to="/signup" className="text-sm text-black no-underline cursor-pointer hover:underline hover:text-blue-600 transition-colors">
                        회원가입
                    </Link>
                    <Link to="/findpw" className="text-sm text-black no-underline cursor-pointer hover:underline hover:text-blue-600 transition-colors">
                        비밀번호 찾기
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;