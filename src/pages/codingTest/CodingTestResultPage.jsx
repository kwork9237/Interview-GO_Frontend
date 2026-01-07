import React from 'react';

const HistoryCodingTest = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 py-24 text-center">
                <div className="text-5xl mb-4">📝</div>
                <p className="text-gray-400 font-bold text-lg">아직 완료한 코딩 테스트 기록이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {data.map((item, index) => {
                const title = item.ex_title || "제목 정보 없음"; 
                const language = item.ex_lang_name || "Java";
                const level = item.ex_level || 1;
                const date = item.hist_date ? new Date(item.hist_date).toLocaleDateString() : "최근 풀이";

                return (
                    <div 
                        key={item.hist_uid || index} 
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center transition-all hover:shadow-md hover:border-emerald-100 group"
                    >
                        {/* [왼쪽] 문제 정보 */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                                    {title}
                                </h3>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium">
                                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{language}</span>
                                <span className="text-gray-300">|</span>
                                <span className="text-gray-500 font-bold">Lv.{level}</span>
                                <span className="text-gray-300">|</span>
                                <span className="text-gray-400 font-normal">{date}</span>
                            </div>
                        </div>

                        {/* [오른쪽] 결과 영역 - 요청하신 텍스트 반영 */}
                        <div className="text-right flex flex-col items-end gap-1">
                            {/* 1. 상단 배지: COMPLETED */}
                            <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest border border-emerald-200 shadow-sm">
                                COMPLETED
                            </div>
                            {/* 2. 하단 큰 글씨: 완료 */}
                            <span className="text-emerald-500 font-black text-2xl tracking-tight">
                                완료
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default HistoryCodingTest;