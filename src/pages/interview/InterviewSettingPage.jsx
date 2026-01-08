// 면접 페이지입니다.
// 면접 프론트는 이곳에 구현해주세요.

import React, { useState } from 'react';

import { Navigate, useNavigate } from 'react-router-dom';

const InterviewSetting = () => {
    const [mode, setMode] = useState('text'); // 'text' or 'voice'
    const [gender, setGender] = useState('male');
    const [speed, setSpeed] = useState('normal');
    const [isRecording, setIsRecording] = useState(false);
    const navigate = useNavigate();

    // 백엔드에 보낼 면접 설정
    const InterviewSettings = async () => {
        try {
            // 토큰으로
            const token = localStorage.getItem('accessToken');
            const mbid = JSON.parse(localStorage.getItem('userInfo')).mb_uid;

            const response = await fetch("/api/interview/setup", {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify(mbid)
            });

            if(!response.ok) throw new Error("SERVER ERROR");

            const data = await response.json();

            if(data.sid) {
                navigate(`/interview/start/${data.sid}`);
            }
        }
        catch (error) {
            console.log("오류 발생 >>", error);
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-8">
        
        {/* 1. 진행 모드 선택 */}
        <section>
            <h2 className="text-lg font-bold mb-4">진행 모드 선택</h2>
            <div className="flex gap-2">
            <button
                onClick={() => setMode('text')}
                className={`flex-1 py-3 rounded-lg border transition ${
                mode === 'text' ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600'
                }`}
            >
                텍스트 채팅
            </button>
            <button
                onClick={() => setMode('voice')}
                className={`flex-1 py-3 rounded-lg border transition ${
                mode === 'voice' ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-600'
                }`}
            >
                음성 대화
            </button>
            </div>
        </section>

        {/* 2. AI 설정 (음성 모드일 때만 표시) */}
        {mode === 'voice' && (
            <section className="space-y-6 animate-fadeIn">
            <h2 className="text-lg font-bold">AI 설정</h2>
            
            {/* TTS 목소리 성별 */}
            <div className="flex gap-4">
                <button 
                onClick={() => setGender('male')}
                className={`flex-1 p-4 rounded-lg flex flex-col items-center gap-2 border ${gender === 'male' ? 'bg-slate-700 text-white' : 'bg-gray-50'}`}
                >
                <span className="text-2xl">👤</span>
                <span>남성</span>
                </button>
                <button 
                onClick={() => setGender('female')}
                className={`flex-1 p-4 rounded-lg flex flex-col items-center gap-2 border ${gender === 'female' ? 'bg-slate-700 text-white' : 'bg-gray-50'}`}
                >
                <span className="text-2xl">👩‍💼</span>
                <span>여성</span>
                </button>
            </div>

            {/* TTS 속도 설정 */}
            <div className="flex gap-2">
                {['느림', '보통', '빠름'].map((s, idx) => {
                const val = ['slow', 'normal', 'fast'][idx];
                return (
                    <button
                    key={val}
                    onClick={() => setSpeed(val)}
                    className={`flex-1 py-2 rounded-lg border ${
                        speed === val ? 'bg-slate-700 text-white' : 'bg-gray-100'
                    }`}
                    >
                    {s}
                    </button>
                );
                })}
            </div>

            {/* 마이크 테스트 */}
            <div className="flex items-center gap-4">
                <button
                onClick={() => setIsRecording(!isRecording)}
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold"
                >
                마이크 테스트
                </button>
                {isRecording && (
                <div className="flex gap-1 items-end h-4">
                    <div className="w-1 bg-cyan-400 animate-bounce h-full"></div>
                    <div className="w-1 bg-cyan-400 animate-bounce h-2 delay-75"></div>
                    <div className="w-1 bg-cyan-400 animate-bounce h-4 delay-150"></div>
                    <div className="w-1 bg-cyan-400 animate-bounce h-3 delay-100"></div>
                </div>
                )}
            </div>
            </section>
        )}

        {/* 3. 입장 버튼 (최하단 고정) */}
        <div className="pt-4">
            <button 
                onClick={InterviewSettings}
                className="w-full py-4 bg-gray-300 hover:bg-gray-400 text-black font-bold rounded-xl transition">
                {/* 면접 페이지 이동 (인터뷰 또는 보이스) 
                    아니면 테스트페이지에서 이동하여 voice이면 voice출력으로
                */}
            면접 입장하기
            </button>
        </div>
        </div>
    );
}

export default InterviewSetting;