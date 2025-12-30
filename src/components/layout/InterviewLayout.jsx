import React from 'react';
import { Outlet } from "react-router-dom";
import InterviewHeader from './InterviewHeader'; // 면접 전용 헤더

const InterviewLayout = () => {
    return (
        /* [면접 레이아웃 구조]
           - bg-gray-50: 면접 화면은 눈이 편안하도록 아주 연한 회색 배경을 깝니다.
           - min-h-screen: 화면 꽉 차게 설정
        */
        <div className="flex flex-col min-h-screen bg-gray-50">
            
            {/* (A) 면접 전용 헤더 
                - 이탈 방지 모달 로직이 포함되어 있습니다.
                - 높이가 h-20 (약 80px)입니다.
            */}
            <InterviewHeader />

            {/* (B) 본문 (Outlet)
                - flex-1: 남은 공간을 모두 차지
                - pt-20: ⭐ 중요! 헤더 높이(h-20)만큼 내려줘야 내용이 안 가려집니다.
                - max-w-7xl: 너무 넓게 퍼지지 않도록 중앙 정렬 (필요 시 w-full로 변경 가능)
            */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-20 pb-10">
                {/* 각 면접 페이지(채팅 면접, 화상 면접 등)가 여기서 렌더링됩니다. */}
                <Outlet />
            </main>

            {/* (C) 푸터 없음 
                - 면접 중에는 시선을 분산시키는 푸터(링크 등)를 보여주지 않습니다. 
            */}

        </div>
    );
}

export default InterviewLayout;