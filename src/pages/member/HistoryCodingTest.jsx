import React from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

/**
 * [컴포넌트] 코딩 테스트 풀이 이력 목록
 * - 사용자가 푼 문제들의 목록을 카드 형태로 렌더링
 * - 점수(100점 만점)에 따른 성공/실패 상태 시각화
 * * @param {Array} data - 풀이 이력 데이터 배열 (백엔드 exam_history 테이블 매핑)
 */
const HistoryCodingTest = ({ data }) => {

    // [예외 처리] 데이터가 없거나 비어있을 경우 안내 카드 표시
    if (!data || data.length === 0) {
        return (
            <Card padding="large" className="text-center py-20 bg-gray-50 border-dashed">
                <p className="text-gray-400 font-bold">아직 푼 문제가 없습니다.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {/* [렌더링] 풀이 이력 리스트 매핑 */}
            {data.map((item, index) => {

                // 1. [데이터 가공] DB 필드값 추출 및 기본값 설정 (Null Safety)
                const title = item.ex_title || `문제 ${index + 1}`;
                const language = item.ex_lang_name || 'Java';
                const date = item.hist_date || '날짜 없음';
                const level = item.ex_level || 1;
                const score = item.hist_score || 0;

                // 2. [로직] 100점 만점일 경우에만 'SOLVED' 상태로 간주
                const isSuccess = score === 100;

                return (
                    <Card
                        key={item.hist_uid || index} // 고유 키 설정 (PK 권장)
                        padding="medium"
                        hover={true}
                        className="group"
                    >
                        {/* [UI] 카드 내부 레이아웃: 좌측(문제 정보) vs 우측(결과 정보) */}
                        <div className="flex items-center justify-between w-full">

                            {/* [Left] 문제 기본 정보 영역 */}
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-2 mb-1">
                                    {/* 문제 제목 (말줄임 처리됨) */}
                                    <h4 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                        {title}
                                    </h4>

                                    {/* 상태 표시 점 (성공: 초록, 실패: 빨강) */}
                                    <div className={`w-1.5 h-1.5 rounded-full ${isSuccess ? 'bg-green-500' : 'bg-red-400'}`}></div>
                                </div>

                                {/* 메타 정보: 언어 | 레벨 | 날짜 */}
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="font-bold text-gray-700">{language}</span>
                                    <span className="w-px h-3 bg-gray-200"></span>
                                    <span className="text-gray-500">Lv.{level}</span>
                                    <span className="w-px h-3 bg-gray-200"></span>
                                    <span className="text-gray-400 text-xs">{date}</span>
                                </div>
                            </div>

                            {/* [Right] 풀이 결과 영역 */}
                            <div className="flex flex-col items-end gap-1 shrink-0">
                                {/* 결과 뱃지 */}
                                <Badge variant={isSuccess ? 'success' : 'danger'} className="px-3 py-1 text-xs">
                                    {isSuccess ? 'SOLVED' : 'FAILED'}
                                </Badge>

                                {/* 점수 표시 (성공 시 초록색 강조) */}
                                <span className={`text-xl font-black ${isSuccess ? 'text-green-600' : 'text-gray-300'}`}>
                                    {score}<span className="text-sm font-medium text-gray-400 ml-0.5">점</span>
                                </span>
                            </div>

                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

export default HistoryCodingTest;