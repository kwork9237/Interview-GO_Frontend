import React, { useState } from 'react';
import InterviewSidebar from '../../components/layout/InterviewSidebar'; // 경로에 맞게 수정하세요!

const PreviewInterview = () => {
    // 1. 사이드바를 테스트하기 위한 임시 상태값들
    const [currentStep, setCurrentStep] = useState(1);
    const [totalStep] = useState(3); // 총 3단계 가정
    const [isVoiceMode, setIsVoiceMode] = useState(true); // 기본 음성모드
    const [timerActive, setTimerActive] = useState(false); // 타이머 작동 여부

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            
            {/* 가짜 헤더 (Sidebar의 sticky top 위치 확인용) */}
            <header className="h-20 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm z-40">
                <h1 className="text-xl font-bold text-gray-800">Interview Room (Preview)</h1>
            </header>

            {/* 메인 레이아웃 */}
            <div className="flex max-w-7xl mx-auto w-full gap-8 p-8 items-start">
                
                <InterviewSidebar 
                    currentStep={currentStep}
                    totalStep={totalStep}
                    isVoiceMode={isVoiceMode}
                    timerActive={timerActive}
                />

                {/* 👉 테스트 컨트롤 패널 (실제 면접 화면 자리) */}
                <main className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 min-h-[500px]">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">🛠️ 사이드바 기능 테스트</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 1. 진행 단계 조절 */}
                        <div className="p-4 border rounded-xl bg-slate-50">
                            <h3 className="font-bold mb-2">Step Control</h3>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                                    className="px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50 font-bold"
                                >
                                    ◀ 이전
                                </button>
                                <button 
                                    onClick={() => setCurrentStep(prev => Math.min(totalStep, prev + 1))}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 font-bold"
                                >
                                    다음 ▶
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                파란색 진행 바가 부드럽게 차오르는지 확인하세요.
                            </p>
                        </div>

                        {/* 2. 타이머 조절 */}
                        <div className="p-4 border rounded-xl bg-slate-50">
                            <h3 className="font-bold mb-2">Timer Control</h3>
                            <button 
                                onClick={() => setTimerActive(!timerActive)}
                                className={`px-4 py-2 rounded-lg font-bold shadow-sm text-white transition-colors ${
                                    timerActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                                }`}
                            >
                                {timerActive ? '⏹ 타이머 정지' : '▶ 타이머 시작'}
                            </button>
                            <p className="text-sm text-gray-500 mt-2">
                                'REC' 빨간불이 깜빡이는지 확인하세요.
                            </p>
                        </div>

                        {/* 3. 모드 전환 */}
                        <div className="p-4 border rounded-xl bg-slate-50">
                            <h3 className="font-bold mb-2">Mode Switch</h3>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={isVoiceMode} 
                                        onChange={(e) => setIsVoiceMode(e.target.checked)}
                                        className="w-5 h-5 accent-blue-600"
                                    />
                                    <span className="font-medium">음성 모드 (메모장 표시)</span>
                                </label>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                체크 해제 시 메모장이 사라지는지 확인하세요.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
                        <strong>Tip:</strong> 스크롤을 내려도 사이드바가 화면 상단에 <strong>Sticky(고정)</strong> 되어 따라오는지 확인해보세요.
                    </div>
                    {/* 스크롤 테스트용 빈 공간 */}
                    <div className="h-[1000px]"></div>
                </main>
            </div>
        </div>
    );
};

export default PreviewInterview;