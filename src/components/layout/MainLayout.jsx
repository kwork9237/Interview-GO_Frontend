import React, { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import MainHeader from './MainHeader'; // 이름 일치 (Header -> MainHeader)
import Footer from './Footer';         // 푸터 추가

const MainLayout = () => {
    // 1. 로그인 상태 관리 (토큰 확인용)
    const [isLogin, setIsLogin] = useState(false);

    // 2. 화면이 켜질 때 '토큰'이 있는지 검사
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        // 토큰이 있으면 true, 없으면 false
        setIsLogin(!!token); 
    }, []);

    return(
        /* [전체 레이아웃 구조]
           - flex flex-col: 요소를 위아래로 배치
           - min-h-screen: 화면 높이를 최소 100%로 잡아서 푸터가 붕 뜨는 걸 방지
        */
        <div className="flex flex-col min-h-screen">
            
            {/* (A) 헤더: 로그인 상태(isLogin)를 전달해서 버튼 모양을 결정함 */}
            <MainHeader isLoggedIn={isLogin} />

            {/* (B) 본문 (Outlet)
                - flex-1: 남은 공간을 꽉 채워서 푸터를 바닥으로 밀어냄
                - max-w-7xl mx-auto: 화면이 너무 넓어지지 않게 중앙 정렬
                - px-6: 모바일에서 양옆 여백 확보
                - pt-16: ⭐ 중요! 고정된 헤더(h-16) 높이만큼 내용을 아래로 내림
            */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-16 pb-20">
                <Outlet/> 
            </main>

            {/* (C) 푸터: 내용이 짧아도 항상 바닥에 붙어있음 */}
            <Footer />

        </div>
    );
}

export default MainLayout;