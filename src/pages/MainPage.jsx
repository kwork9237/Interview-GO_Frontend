import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import YouTube from 'react-youtube';
import Button from '../components/common/Button';

const MainPage = () => {
    const navigate = useNavigate();
    
    // 1. 상태 관리
    const [mainVideo, setMainVideo] = useState(null);
    const [jobList, setJobList] = useState([]);

    // 2. 안전장치 (유튜브 에러 및 메모리 누수 방지용)
    const isMounted = useRef(true);
    const playerRef = useRef(null);

    useEffect(() => {
        isMounted.current = true; // 컴포넌트 등장 깃발 

        // (1) 유튜브 데이터 가져오기 (면접 꿀팁 카테고리)
        const fetchYoutube = async () => {
            try {
                const res = await axios.get(`/api/youtube/check`, {
                    params: { category: "면접 꿀팁" }
                });
                
                // 첫 번째 영상만 가져와서 메인에 배치
                if (isMounted.current && res.data && res.data.length > 0) {
                    setMainVideo(res.data[0]); 
                }
            } catch (err) {
                console.error("유튜브 로딩 실패:", err);
            }
        };

        // (2) 공고(Job) 데이터 가져오기
        const fetchJobs = async () => {
            try {
                // 백엔드 실제 주소 호출
                const res = await axios.get('/api/work24/list');
                
                // 데이터가 있고 컴포넌트가 살아있다면 상위 4개만 자르기
                if (isMounted.current && res.data) {
                    setJobList(res.data.slice(0, 4));
                }
            } catch (err) {
                console.error("공고 로딩 실패:", err);
            }
        };

        fetchYoutube();
        fetchJobs();

        // (3) 뒷정리 (Cleanup), 페이지 떠날 때 실행
        return () => {
            isMounted.current = false;
            // 유튜브 플레이어 안전하게 파괴 (에러 방지 핵심)
            if (playerRef.current && playerRef.current.destroy) {
                try { playerRef.current.destroy(); } catch (e) {}
            }
        };
    }, []);

    // 유튜브 플레이어 준비 완료 시 실행
    const onPlayerReady = (event) => {
        if (!isMounted.current) {
            event.target.destroy();
            return;
        }
        playerRef.current = event.target;
    };

    // 유튜브 옵션
    const videoOpts = {
        height: '320',
        width: '100%',
        playerVars: { autoplay: 0 },
    };

    // 면접 시작하기 버튼을 눌렀을때 로그인 페이지로 이동
    const handleStartClick = async () => {

        // 사용자의 토큰이 있는지 확인
        const token = localStorage.getItem('accessToken');
        
        // 토큰이 없는 경우 로그인 페이지로 리다이렉트
        if (!token) {
            // 1. 사용자에게 상황 설명 (그냥 튕기는 것보다 훨씬 친절함)
            if (window.confirm("면접을 시작하려면 로그인이 필요합니다. 로그인 페이지로 이동할까요?")) {
                // 2. 로그인 후 다시 돌아올 수 있도록 현재 경로를 state에 담아 보냄
                navigate('/login', { state: { redirectUrl: '/' } });
            }
            return;
        }

        try {
            // 토큰이 있는 경우 서버 호출하여 신규 세션 생성
            const setupResponse = await fetch("/api/interview/setup", {
                method: 'POST',
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            });

            // 정상으로 return 되지 않을 경우 오류 호출
            if(!setupResponse.ok) throw new Error("서버 측 처리 오류");

            // 결과값에서 ssid 추출
            const data = await setupResponse.json();

            // data에 세션 id값이 들어있는 경우 시작페이지 이동.
            // 그것이 아니면 로그에서 오류값 반환
            if(data.sid) navigate(`/interview/start/${data.sid}`);
            else {
                console.log("유효한 SID를 받지 못했습니다.");
            }
            
        }
        catch(error) {
            console.log("ERROR >> ", error);
        }
    }
    

    return (
        <div className="space-y-16 pb-20">

            {/* ----------------------------------------------------------------
               1. Hero Section (상단 배너)
            ---------------------------------------------------------------- */}
            <section className="text-center py-20 animate-fade-in-up">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                    AI와 함께하는 <br />
                    <span className="text-primary">가장 확실한 합격 전략</span>
                </h1>
                <p className="text-xl text-gray-500 mb-10">
                    실전 모의 면접부터 코딩 테스트까지, 취업의 모든 것을 준비했습니다.
                </p>
                <div className="flex justify-center gap-4">
                    <Button
                        size="medium"
                        // onClick={() => navigate('/interview/setting')} // 면접 설정 페이지로 이동
                        onClick={handleStartClick}
                        className="shadow-xl shadow-primary/20"
                    >
                        AI 면접 시작하기
                    </Button>
                </div>
            </section>


            {/* ----------------------------------------------------------------
               2. Trend Section (좌: 유튜브 / 우: 공고 리스트)
            ---------------------------------------------------------------- */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* (A) 왼쪽: 추천 영상 */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center">
                                <span className="text-red-600 mr-2 text-3xl">▶</span> 
                                <span>오늘의 추천 영상</span>
                            </h2>
                            <span 
                                onClick={() => navigate('/youtube')} 
                                className="text-sm text-blue-600 hover:text-blue-800 font-bold hover:underline transition cursor-pointer"
                            >
                                더보기+
                            </span>
                        </div>
                        <div className="rounded-xl overflow-hidden shadow-md bg-black flex-1 flex flex-col justify-center">
                            {mainVideo ? (
                                <YouTube 
                                    videoId={mainVideo.ytKey} 
                                    opts={videoOpts} 
                                    onReady={onPlayerReady} 
                                    className="w-full"
                                />
                            ) : (
                                <div className="h-60 flex items-center justify-center text-gray-500 bg-gray-100">
                                    <p>추천 영상을 불러오는 중입니다... ☁️</p>
                                </div>
                            )}
                        </div>

                        {mainVideo && (
                            <div className="mt-4">
                                <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                                    {mainVideo.title}
                                </h3>
                            </div>
                        )}
                    </div>

                    {/* (B) 오른쪽: 실시간 채용 공고 */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col h-full">
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                                🔥 실시간 채용 공고
                            </h2>
                            <span 
                                onClick={() => navigate('/joblist')} 
                                className="text-sm text-blue-600 hover:text-blue-800 font-bold hover:underline transition cursor-pointer"
                            >
                                더보기+
                            </span>
                        </div>

                        {/* 리스트 영역 */}
                        <div className="flex-1 flex flex-col gap-3">
                            {jobList.length > 0 ? (
                                jobList.map((job, idx) => (
                                    <div 
                                        // 고유값 Key 설정
                                        key={job.empSeqno || idx} 
                                        className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition cursor-pointer group"
                                        // 클릭 시 공고 원문 새 창으로 열기
                                        onClick={() => job.empWantedHomepgDetail && window.open(job.empWantedHomepgDetail, '_blank')}
                                    >
                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-white border border-gray-200 text-gray-600 text-[11px] font-bold px-1.5 py-0.5 rounded truncate max-w-[120px]">
                                                    {/* 변수명 수정: empBusiNm (회사명) */}
                                                    {job.empBusiNm || "회사정보"}
                                                </span>
                                            </div>
                                            {/* 변수명 수정: empWantedTitle (제목) */}
                                            <h4 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition truncate">
                                                {job.empWantedTitle || "제목 없음"}
                                            </h4>
                                        </div>
                                        
                                        <div className="text-right shrink-0">
                                            {/* 변수명 수정: empWantedEndt (마감일) */}
                                            <span className="font-bold text-xs px-2.5 py-1.5 rounded-full bg-gray-200 text-gray-600">
                                                ~{job.empWantedEndt || "-"}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-400">
                                    현재 등록된 공고를 불러오는 중입니다...
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default MainPage;