import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

/**
 * [컴포넌트] 면접 연습 이력 목록 및 상세 보기
 * - 날짜별로 그룹핑된 면접 기록을 리스트로 표시
 * - 클릭 시 모달을 통해 질문/답변/AI피드백 상세 내용 확인
 * * @param {Array} data - 백엔드에서 전달받은 그룹 데이터 리스트
 * 구조: [{ interviewDate: "2024-01-01...", qnaList: [ {iv_question, iv_answer...} ] }]
 */
const HistoryInterview = ({ data }) => {
    
    // [상태] 상세 모달에 표시할 세션 데이터 (null이면 모달 닫힘)
    const [selectedSession, setSelectedSession] = useState(null);

    // [예외 처리] 데이터가 없거나 비어있을 경우 안내 UI 표시
    if (!data || data.length === 0) {
        return (
            <Card padding="large" className="text-center py-20 bg-gray-50 border-dashed">
                <p className="text-gray-400 font-bold">아직 면접 연습 기록이 없습니다.</p>
            </Card>
        );
    }

    /**
     * [유틸리티] 날짜 문자열 포맷팅
     * - "YYYY-MM-DD HH:MM:SS" -> "YYYY.MM.DD HH:MM" 변환
     * - Safari 브라우저 호환성을 위해 공백을 'T'로 치환 후 파싱
     */
    const formatDate = (dateString) => {
        if (!dateString) return "";
        
        const date = new Date(dateString.replace(" ", "T"));

        if (isNaN(date.getTime())) return dateString; // 파싱 실패 시 원본 반환

        return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    return (
        <>
            {/* 1. 면접 세션 목록 영역 */}
            <div className="space-y-4">
                {data.map((group, index) => {
                    const { interviewDate, qnaList } = group;
                    
                    // [방어 코드] 질문 리스트가 비어있으면 렌더링 스킵
                    if (!qnaList || qnaList.length === 0) return null;

                    const firstItem = qnaList[0];

                    // [로직] 해당 세션의 평균 점수 계산 (소수점 버림)
                    const totalScore = qnaList.reduce((sum, item) => sum + (Number(item.iv_score) || 0), 0);
                    const avgScore = Math.floor(totalScore / qnaList.length);

                    return (
                        <Card
                            key={interviewDate || index} // 고유 키: 면접 날짜
                            onClick={() => setSelectedSession(qnaList)} // [이벤트] 클릭 시 상세 데이터 모달로 전달
                            padding="medium"
                            className="group cursor-pointer"
                        >
                            <div className="flex justify-between items-center">
                                {/* [Left] 면접 기본 정보 */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        {/* 단계(Step) 배지 */}
                                        <Badge variant="primary">Step {firstItem.iv_step || 1}</Badge>

                                        {/* 면접 일시 */}
                                        <span className="text-sm text-gray-400 font-bold">
                                            {formatDate(interviewDate)}
                                        </span>

                                        {/* 질문 개수 */}
                                        <Badge variant="gray" className="ml-1">
                                            총 {qnaList.length}질문
                                        </Badge>
                                    </div>

                                    {/* 대표 질문 제목 (말줄임 처리) */}
                                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                                        {qnaList.length > 1
                                            ? `${firstItem.iv_question} 외 ${qnaList.length - 1}건`
                                            : firstItem.iv_question}
                                    </h3>
                                </div>

                                {/* [Right] 평균 점수 표시 */}
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

            {/* 2. 면접 상세 결과 모달 */}
            <Modal
                isOpen={!!selectedSession} // selectedSession 값이 존재하면 모달 오픈
                title="면접 결과 상세 리포트"
                size="large"
                onClose={() => setSelectedSession(null)}
                confirmText="닫기"
                onConfirm={() => setSelectedSession(null)}
            >
                {/* 모달 내부 컨텐츠: 질문-답변-피드백 리스트 */}
                {selectedSession && (
                    <div className="space-y-12 px-2 pb-4">
                        {selectedSession.map((item, index) => (
                            <div key={item.iv_uid || index} className="relative">
                                
                                {/* Q넘버링 배지 (왼쪽 상단 플로팅) */}
                                <div className="absolute -left-2 -top-4 bg-blue-600 text-white w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shadow-lg z-10 border-2 border-white">
                                    Q{index + 1}
                                </div>

                                <div className="bg-white border border-gray-200 rounded-2xl p-6 pt-8 shadow-sm hover:shadow-md transition-shadow">
                                    {/* (1) 질문 내용 */}
                                    <h4 className="font-bold text-xl text-gray-900 mb-4 leading-snug">
                                        {item.iv_question}
                                    </h4>

                                    {/* (2) 사용자 답변 */}
                                    <div className="bg-gray-50 p-5 rounded-xl mb-4 border border-gray-100">
                                        <span className="text-[10px] font-black text-gray-400 block mb-2 uppercase tracking-widest">MY ANSWER</span>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {item.iv_answer || "답변 내용이 없습니다."}
                                        </p>
                                    </div>

                                    {/* (3) AI 피드백 & 점수 */}
                                    <div className={`p-5 rounded-xl border ${item.iv_feedback ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">AI FEEDBACK</span>
                                            {/* 점수에 따른 배지 색상 변경 (80점 기준) */}
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