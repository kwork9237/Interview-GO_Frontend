import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobList = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        // 백엔드에서 30개 넘게 긁어온 리스트 호출
        axios.get('http://localhost:8080/api/work24/list')
            .then(response => setJobs(response.data))
            .catch(error => console.error("데이터 로드 실패:", error));
    }, []);

    return (
        /* 헤더와 푸터 사이의 최소 높이를 확보 (min-h-screen) */
        <main className="min-h-[70vh] bg-white py-12">
            <div className="max-w-[1400px] mx-auto px-6">
                
                {/* 섹션 타이틀 영역 */}
                <div className="mb-12 border-l-4 border-blue-600 pl-4">
                    <h2 className="text-3xl font-bold text-gray-900">최신 채용 공고</h2>
                </div>

                {/* 3열 고정 그리드 섹션 */}
                <div className="grid grid-cols-3 gap-10">
                    {jobs.map((job) => (
                        <div 
                            key={job.empSeqno} 
                            className="group flex flex-col justify-between border border-gray-100 rounded-2xl p-8 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                        >
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[11px] uppercase tracking-widest font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                                        {job.coClcdNm || 'IT 기업'}
                                    </span>
                                    <span className="text-sm font-semibold text-red-500">
                                        D-Day {job.empWantedEndt}
                                    </span>
                                </div>

                                {/* 제목 클릭 시 상세 페이지 이동 */}
                                <h3 className="text-xl font-bold text-gray-800 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                                        {job.empWantedTitle}   
                                </h3>

                                <div className="flex items-center text-gray-600 font-medium">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-xs">🏢</span>
                                    </div>
                                    {job.empBusiNm}
                                </div>
                            </div>

                            {/* 하단 액션 버튼 */}
                            <div className="mt-8">
                                <a 
                                    href={job.empWantedHomepgDetail} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block w-full py-4 bg-gray-50 text-gray-900 font-bold rounded-xl text-center group-hover:bg-blue-600 group-hover:text-white transition-all"
                                >
                                    공고 상세보기
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default JobList;