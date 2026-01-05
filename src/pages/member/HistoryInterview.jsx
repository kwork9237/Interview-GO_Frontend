import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

/**
 * 면접 연습 이력 목록 + 상세 모달 컴포넌트
 * @param {Array} data - 면접 질문/답변/피드백 이력 데이터
 */
const HistoryInterview = ({ data }) => {
    // 선택된 면접 세션 (클릭 시 모달로 상세 표시)
    const [selectedSession, setSelectedSession] = useState(null);

    // 1. 데이터 그룹핑 (안전한 버전)
    // 같은 면접 세션을 날짜(분 단위) 기준으로 묶음
    const groupedData = useMemo(() => {
        if (!data) return {};

        return data.reduce((acc, item) => {
            // 날짜 문자열이 없으면 제외
            if (!item.iv_date) return acc;

            // "2024-12-30T14:20:05.123" -> "2024-12-30T14:20"
            // 초/밀리초 차이로 저장된 질문들을 하나의 면접으로 묶기 위함
            const dateKey = item.iv_date.substring(0, 16); 

            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(item);
            return acc;
        }, {});
    }, [data]);

    // 최신 면접이 위로 오도록 날짜 내림차순 정렬
    const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));

    // 데이터가 없을 경우 안내 카드 표시
    if (!data || data.length === 0) {
        return (
            <Card padding="large" className="text-center py-20 bg-gray-50 border-dashed">
                <p className="text-gray-400 font-bold">아직 면접 연습 기록이 없습니다.</p>
            </Card>
        );
    }

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        // "2024-12-30T14:20" 형태이므로 바로 Date 파싱 가능
        const date = new Date(dateString); 
        // 유효하지 않은 날짜일 경우 원본 문자열 반환
        if (isNaN(date.getTime())) return dateString; 
        
        return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    return (
        <>
            {/* 면접 세션 목록 */}
            <div className="space-y-4">
                {sortedDates.map((dateKey) => {
                    const sessionItems = groupedData[dateKey];
                    const firstItem = sessionItems[0];
                    
                    // 평균 점수 계산 (소수점 버림)
                    const totalScore = sessionItems.reduce((sum, item) => sum + (Number(item.iv_score) || 0), 0);
                    const avgScore = Math.floor(totalScore / sessionItems.length);

                    return (
                        <Card 
                            key={dateKey} 
                            onClick={() => setSelectedSession(sessionItems)} // 클릭 시 해당 세션 상세 모달 오픈
                            padding="medium"
                            className="group"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        {/* 면접 Step 정보 (없으면 1) */}
                                        <Badge variant="primary">Step {firstItem.iv_step || 1}</Badge>

                                        {/* 면접 날짜 */}
                                        <span className="text-sm text-gray-400 font-bold">
                                            {formatDate(dateKey)}
                                        </span>

                                        {/* 해당 면접의 총 질문 수 */}
                                        <Badge variant="gray" className="ml-1">
                                            총 {sessionItems.length}질문
                                        </Badge>
                                    </div>

                                    {/* 대표 질문 (여러 개일 경우 "외 n건" 표시) */}
                                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                                        {sessionItems.length > 1 
                                            ? `${firstItem.iv_question} 외 ${sessionItems.length - 1}건`
                                            : firstItem.iv_question}
                                    </h3>
                                </div>
                                
                                {/* 평균 점수 영역 */}
                                <div className="text-right shrink-0 pl-4 border-l border-gray-100 ml-4">
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Avg Score</div>
                                    <div className="text-2xl font-black text-blue-600">
                                        {avgScore}<span className="text-sm ml-0.5 text-gray-400 font-normal">pt</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* 면접 상세 보기 모달 */}
            <Modal
                isOpen={!!selectedSession} // 선택된 세션이 있을 때만 열림
                title="면접 결과 상세 리포트"
                size="large"
                onClose={() => setSelectedSession(null)}
                confirmText="닫기"
                onConfirm={() => setSelectedSession(null)}
            >
                {/* selectedSession이 있을 때만 상세 렌더링 */}
                {selectedSession && (
                    <div className="space-y-12 px-2 pb-4">
                        {selectedSession.map((item, index) => (
                            <div key={item.iv_uid || index} className="relative">
                                {/* 질문 번호 배지 */}
                                <div className="absolute -left-2 -top-4 bg-blue-600 text-white w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shadow-lg z-10 border-2 border-white">
                                    Q{index + 1}
                                </div>

                                <div className="bg-white border border-gray-200 rounded-2xl p-6 pt-8 shadow-sm hover:shadow-md transition-shadow">
                                    {/* 1. 질문 */}
                                    <h4 className="font-bold text-xl text-gray-900 mb-4 leading-snug">
                                        {item.iv_question}
                                    </h4>

                                    {/* 2. 내 답변 */}
                                    <div className="bg-gray-50 p-5 rounded-xl mb-4 border border-gray-100">
                                        <span className="text-[10px] font-black text-gray-400 block mb-2 uppercase tracking-widest">MY ANSWER</span>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {item.iv_answer || "답변 내용이 없습니다."}
                                        </p>
                                    </div>

                                    {/* 3. AI 피드백 */}
                                    <div className={`p-5 rounded-xl border ${item.iv_feedback ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">AI FEEDBACK</span>
                                            <Badge variant={item.iv_score >= 80 ? 'success' : 'warning'}>
                                                {Math.floor(item.iv_score)}점
                                            </Badge>
                                        </div>
                                        <p className="text-blue-900/80 text-sm leading-relaxed whitespace-pre-wrap">
                                            {item.iv_feedback || "피드백이 아직 생성되지 않았습니다."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </>
    );
};

export default HistoryInterview;
