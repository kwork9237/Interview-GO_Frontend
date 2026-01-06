import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

/**
 * 면접 연습 이력 목록 + 상세 모달 컴포넌트
 * @param {Array} data - 백엔드(MyPageService)에서 그룹화되어 넘어온 InterviewGroupDTO 리스트
 */
const HistoryInterview = ({ data }) => {
    // 선택된 면접 세션 (클릭 시 모달로 상세 표시)
    const [selectedSession, setSelectedSession] = useState(null);

    // [2026-01-06 수정] 백엔드에서 이미 그룹화해서 보내주므로 useMemo를 통한 수동 그룹핑 로직을 제거함
    // 데이터가 없을 경우 안내 카드 표시
    if (!data || data.length === 0) {
        return (
            <Card padding="large" className="text-center py-20 bg-gray-50 border-dashed">
                <p className="text-gray-400 font-bold">아직 면접 연습 기록이 없습니다.</p>
            </Card>
        );
    }

    // 날짜 포맷팅 함수 (기존 디자인 유지)
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
                {/* [2026-01-06 수정] 서버에서 그룹화된 data(InterviewGroupDTO)를 직접 순회하도록 변경 */}
                {data.map((group, index) => {
                    const sessionItems = group.qnaList; // 해당 세션의 질문들
                    const firstItem = sessionItems[0];
                    
                    // 평균 점수 계산 (소수점 버림)
                    const totalScore = sessionItems.reduce((sum, item) => sum + (Number(item.iv_score) || 0), 0);
                    const avgScore = Math.floor(totalScore / sessionItems.length);

                    return (
                        <Card 
                            key={index} 
                            onClick={() => setSelectedSession(sessionItems)} // 클릭 시 해당 세션 상세 모달 오픈
                            padding="medium"
                            className="group cursor-pointer"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        {/* 면접 Step 정보 (없으면 1) */}
                                        <Badge variant="primary">Step {firstItem.iv_step || 1}</Badge>

                                        {/* [2026-01-06 수정] 서버에서 전달받은 대표 날짜(interviewDate) 사용 */}
                                        <span className="text-sm text-gray-400 font-bold">
                                            {formatDate(group.interviewDate)}
                                        </span>

                                        {/* 해당 면접의 총 질문 수 */}
                                        <Badge variant="gray" className="ml-1">
                                            총 {sessionItems.length}질문
                                        </Badge>
                                    </div>

                                    {/* 대표 질문 (여러 개일 경우 "외 n건" 표시) / [2026-01-06] iv_context 필드 반영 */}
                                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                                        {sessionItems.length > 1 
                                            ? `${firstItem.iv_context} 외 ${sessionItems.length - 1}건`
                                            : firstItem.iv_context}
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
                                    {/* 1. 질문 / [2026-01-06] iv_context 반영 */}
                                    <h4 className="font-bold text-xl text-gray-900 mb-4 leading-snug">
                                        {item.iv_context}
                                    </h4>

                                    {/* 2. 내 답변 / [2026-01-06] DB 구조에 따라 필요시 필드명 조정 가능 */}
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