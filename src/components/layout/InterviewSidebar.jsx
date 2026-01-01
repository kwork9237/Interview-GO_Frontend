import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';  // 공통 카드
import Badge from '../../components/common/Badge'; // 공통 뱃지

const InterviewSidebar = ({ currentStep, totalStep, isVoiceMode, timerActive }) => {
  const [seconds, setSeconds] = useState(0);

  // 타이머 로직
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => setSeconds(p => p + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // 시간 포맷 (MM:SS)
  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 진행률 계산
  const progressPercent = (currentStep / totalStep) * 100;

  return (
    // 레이아웃: sticky 유지 (면접 화면은 스크롤 방식이 다를 수 있으므로)
    // h-[calc(100vh-80px)] : 헤더 높이(예: 80px) 고려
    <aside className="w-80 flex flex-col gap-4 p-4 sticky top-20 h-[calc(100vh-80px)] z-30">
      
      {/* 1. 진행 상황 (Card 활용) */}
      <Card padding="medium" className="shadow-md border-0 ring-1 ring-gray-100">
        <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Progress</span>
            <Badge variant="primary">Step {currentStep}</Badge>
        </div>
        
        <div className="flex items-end gap-1 mb-3">
            <span className="text-4xl font-black text-gray-800 leading-none">{currentStep}</span>
            <span className="text-lg text-gray-400 font-medium mb-1">/ {totalStep}</span>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-500 ease-out rounded-full" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </Card>

      {/* 2. 타이머 (Card 활용) */}
      <Card padding="medium" className="shadow-md border-0 ring-1 ring-gray-100">
        <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Elapsed Time</span>
            {/* 타이머가 돌면 빨간불이 깜빡이는 애니메이션 */}
            {timerActive && (
                <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-red-500">REC</span>
                </div>
            )}
        </div>
        <div className="text-center py-2">
            <span className={`text-4xl font-mono font-bold tracking-wider ${timerActive ? 'text-gray-800' : 'text-gray-300'}`}>
                {formatTime(seconds)}
            </span>
        </div>
      </Card>

      {/* 3. 메모장 (음성 모드일 때만 표시) */}
      {isVoiceMode ? (
        <Card padding="small" className="flex-1 flex flex-col shadow-md border-0 ring-1 ring-gray-100 bg-yellow-50/50">
           <div className="flex justify-between items-center mb-2 px-1">
             <div className="flex items-center gap-2">
                <span className="text-lg">📝</span>
                <span className="text-sm font-bold text-gray-700">메모장</span>
             </div>
             <Badge variant="warning" className="text-[10px]">저장 안 됨</Badge>
           </div>
           
           <textarea 
             className="flex-1 w-full bg-yellow-100/50 border border-yellow-200 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-gray-700 leading-relaxed text-sm custom-scrollbar placeholder-yellow-600/30"
             placeholder="면접 중 기억해야 할 키워드를 메모하세요. (새로고침 시 삭제됩니다)"
           ></textarea>
        </Card>
      ) : (
        // 음성 모드가 아닐 때 (빈 공간 채우기)
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl m-1">
             <p className="text-gray-300 font-bold text-sm tracking-widest">INTERVIEW GO</p>
        </div>
      )}

    </aside>
  );
};

export default InterviewSidebar;