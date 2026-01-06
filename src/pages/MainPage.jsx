// 메인 페이지 입니다.
// 메인 페이지는 이곳에서만 편집해주세요.

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const MainPage = () => {
    const navigate = useNavigate();

    // 면접 시작하기 버튼을 눌렀을때 로그인 페이지로 이동
    const handleStartClick = () => {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
            // 1. 사용자에게 상황 설명 (그냥 튕기는 것보다 훨씬 친절함)
            if (window.confirm("면접을 시작하려면 로그인이 필요합니다. 로그인 페이지로 이동할까요?")) {
                // 2. 로그인 후 다시 돌아올 수 있도록 현재 경로를 state에 담아 보냄
                navigate('/login', { state: { redirectUrl: '/interview/setting' } });
            }
            return;
        }
        
        navigate('/interview/setting');
    };

    return (
        <div className="space-y-16">

            {/* ----------------------------------------------------------------
          1. Hero Section (서비스 소개 및 시작 버튼)
          - 시원한 여백(py-20)과 중앙 정렬로 시선을 집중시킵니다.
         ---------------------------------------------------------------- */}
            <section className="text-center py-20 animate-fade-in-up">

                {/* 헤드라인: 두 줄을 짧게 압축 */}
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                    AI와 함께하는 <br />
                    <span className="text-primary">가장 확실한 합격 전략</span>
                </h1>

                {/* 서브텍스트: 한 줄로 요약 */}
                <p className="text-xl text-gray-500 mb-10">
                    실전 모의 면접부터 코딩 테스트까지, 취업의 모든 것을 준비했습니다.
                </p>

                {/* 주요 액션 버튼 (CTA) */}
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
          2. Dashboard Section (정보 카드 영역)
          - Large Card 2개를 나란히 배치 (모바일은 세로, PC는 가로)
         ---------------------------------------------------------------- */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* (A) 유튜브 꿀팁 카드 */}
                <Card
                    size="large"
                    title="🎬 면접 꿀팁 하이라이트"
                    subtitle="현직자가 알려주는 면접 노하우를 확인하세요."
                >
                    {/* 유튜브 플레이어 자리 (임시) */}
                    <div className="w-full h-64 bg-gray-100 rounded-xl flex flex-col items-center justify-center border border-gray-200 group cursor-pointer hover:bg-gray-200 transition">
                        <span className="text-5xl mb-2 group-hover:scale-110 transition">▶️</span>
                        <span className="text-gray-500 font-medium">추천 영상 재생하기</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-4 text-right">
                        Provided by YouTube API
                    </p>
                </Card>

                {/* (B) 취업 뉴스 카드 */}
                <Card
                    size="large"
                    title="📰 실시간 취업 뉴스"
                    subtitle="놓치면 안 되는 최신 채용 트렌드"
                >
                    {/* 뉴스 리스트 (임시 데이터) */}
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex justify-between items-start border-b border-gray-100 pb-3 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition cursor-pointer">
                                <div>
                                    <Badge variant="warning" className="mb-1">HOT</Badge>
                                    <h4 className="font-bold text-gray-800 line-clamp-1">
                                        2025년 상반기 대기업 공채 일정 총정리
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                        2025.12.29 · 취업뉴스
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-right">
                        <Link to="/news" className="text-sm text-primary font-bold hover:underline">
                            뉴스 더보기 →
                        </Link>
                    </div>
                </Card>

            </section>
        </div>
    );
};

export default MainPage;