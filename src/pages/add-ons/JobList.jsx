import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * 고용24 API를 통해 수집된 최신 IT 채용 정보를 화면에 출력합니다.
 * 백엔드에서 마감일 순으로 정렬된 상위 30개 데이터를 기반으로 구성됩니다.
 */
const JobList = () => {
    // 공고 데이터를 저장할 상태 변수
    const [jobs, setJobs] = useState([]);

    /**
     * 컴포넌트가 마운트될 때 딱 한 번 실행되어 DB에 저장된 공고 목록을 요청합니다.
     */
    useEffect(() => {
        // 백엔드 컨트롤러(@GetMapping("/list"))와 통신
        axios.get('/api/work24/list')
            .then(response => {
                // 성공적으로 받아온 30개의 공고 리스트를 상태에 저장
                setJobs(response.data);
            })
            .catch(error => {
                console.error("채용 데이터 로드 실패:", error);
            });
    }, []);

    return (
        <main className="min-h-[70vh] bg-white py-12">
            <div className="max-w-[1400px] mx-auto px-6">
                
                <div className="mb-12 border-l-4 border-blue-600 pl-4">
                    <h2 className="text-3xl font-bold text-gray-900">최신 채용 공고</h2>
                </div>

                <div className="grid grid-cols-3 gap-10">
                    {jobs.map((job) => (
                        <div 
                            key={job.empSeqno} // 고용24 고유 번호를 Key로 사용
                            className="group flex flex-col justify-between border border-gray-100 rounded-2xl p-8 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                        >
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    {/* 기업 분류 태그 (중소/대기업 등) */}
                                    <span className="text-[11px] uppercase tracking-widest font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                                        {job.coClcdNm || '일반 기업'}
                                    </span>
                                    {/* 마감 기한 정보 (yyyyMMdd 형식 출력) */}
                                    <span className="text-sm font-semibold text-red-500">
                                        D-Day {job.empWantedEndt}
                                    </span>
                                </div>

                                {/* 공고 제목: 호버 시 블루 컬러로 변경되는 인터랙션 추가 */}
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

                            {/* [하단 액션 버튼] 
                                href를 통해 고용24 상세 공고 원문 페이지로 새 창 연결
                            */}
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