import React from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

/**
 * 코딩 테스트 풀이 이력 컴포넌트
 * @param {Array} data - 풀이 이력 데이터 배열
 */
const HistoryCodingTest = ({ data }) => {

    // data가 없거나 비어있을 경우: 안내 카드 표시
    if (!data || data.length === 0) {
        return (
            <Card padding="large" className="text-center py-20 bg-gray-50 border-dashed">
                <p className="text-gray-400 font-bold">아직 푼 문제가 없습니다.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {data.map((item, index) => {

                // 문제 제목 (없으면 기본값: 문제 n)
                const title = item.ex_title || `문제 ${index + 1}`;
                // 사용 언어 (없으면 Java)
                const language = item.ex_lang_name || 'Java';
                // 풀이 날짜
                const date = item.hist_date || '날짜 없음';
                // 문제 난이도
                const level = item.ex_level || 1;
                // 획득 점수
                const score = item.hist_score || 0;

                // 점수가 100점이면 성공(SOLVED)
                const isSuccess = score === 100;

                return (
                    <Card 
                        key={item.hist_uid || index} // 고유 키 (없으면 index 사용)
                        padding="medium"
                        hover={true} 
                        className="group"
                    >
                        {/* 카드 내부 전체 레이아웃: 좌측(문제 정보) / 우측(결과 정보) */}
                        <div className="flex items-center justify-between w-full">
                            
                            {/* [왼쪽] 문제 정보 영역 */}
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-2 mb-1">
                                    {/* 문제 제목 */}
                                    <h4 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                        {title}
                                    </h4>

                                    {/* 성공/실패 여부를 나타내는 점 표시 */}
                                    <div className={`w-1.5 h-1.5 rounded-full ${isSuccess ? 'bg-green-500' : 'bg-red-400'}`}></div>
                                </div>
                                
                                {/* 언어 / 레벨 / 날짜 정보 */}
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="font-bold text-gray-700">{language}</span>
                                    <span className="w-px h-3 bg-gray-200"></span>
                                    <span className="text-gray-500">Lv.{level}</span>
                                    <span className="w-px h-3 bg-gray-200"></span>
                                    <span className="text-gray-400 text-xs">{date}</span>
                                </div>
                            </div>

                            {/* [오른쪽] 결과 정보 영역 */}
                            <div className="flex flex-col items-end gap-1 shrink-0">
                                {/* 성공 / 실패 뱃지 */}
                                <Badge variant={isSuccess ? 'success' : 'danger'} className="px-3 py-1 text-xs">
                                    {isSuccess ? 'SOLVED' : 'FAILED'}
                                </Badge>

                                {/* 점수 표시 */}
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
