import React from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const HistoryCodingTest = ({ data }) => {

    if (!data || data.length === 0) {
        return (
            <Card padding="large" className="text-center py-20 bg-gray-50 border-dashed border-2 border-gray-200">
                <p className="text-gray-400 font-bold text-lg">아직 완료한 코딩 테스트가 없습니다.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {data.map((item, index) => {
                // ✅ 백엔드 응답이 ex_title(DB형식)인지 exTitle(DTO형식)인지 모르므로 둘 다 체크합니다.
                const title = item.ex_title || item.exTitle || `문제 번호: ${item.ex_uid || item.exUid}`;
                const language = item.ex_lang_name || item.exLangName || 'Java';
                const level = item.ex_level || item.exLevel || 1;
                
                // ✅ 날짜 필드명도 확인 (hist_date, createdAt 등 모든 가능성 체크)
                const dateRaw = item.hist_date || item.createdAt || item.mb_date;
                const date = dateRaw ? new Date(dateRaw).toLocaleDateString() : '최근 풀이';

                return (
                    <Card 
                        key={item.hist_uid || item.exUid || index} 
                        padding="medium"
                        hover={true} 
                        className="group border border-gray-100 shadow-sm rounded-2xl"
                    >
                        <div className="flex items-center justify-between w-full">
                            
                            {/* [왼쪽] 문제 정보 영역 */}
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {title}
                                    </h4>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                </div>
                                
                                <div className="flex items-center gap-3 text-sm font-medium">
                                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{language}</span>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-gray-500">Lv.{level}</span>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-gray-400">{date}</span>
                                </div>
                            </div>

                            {/* [오른쪽] 결과 정보 영역 */}
                            <div className="flex flex-col items-end gap-1 shrink-0">
                                <Badge variant="success" className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-600 border-emerald-200">
                                    COMPLETED
                                </Badge>
                                <span className="text-2xl font-black text-emerald-500">
                                    완료
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