// 서비스의 상단 내비게이션 바입니다.
// 로그인 여부에 따라 사용자 메뉴(로그인/회원가입 vs 마이페이지/로그아웃)가 유동적으로 변경됩니다.

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button'; // 우리가 만든 공통 버튼 컴포넌트 활용

/**
 * [레이아웃 컴포넌트: MainHeader]
 * @param {boolean} isLoggedIn - 로그인 상태 (MainLayout으로부터 전달받음)
 * @param {string} className - 디자인 가이드 등에서 스타일 제어를 위해 받는 props
 */
const MainHeader = ({ isLoggedIn, className = '' }) => {
    const navigate = useNavigate();

    // 1. 기능 핸들러 (Functions)
    // [로그아웃 처리]
    // - 추후 백엔드 연동 시 localStorage.removeItem('accessToken') 등의 로직이 이곳에 추가됩니다.
    const handleLogout = (e) => {
        alert("로그아웃 되었습니다.");
        localStorage.removeItem('accessToken');     // 토큰 삭제
        localStorage.removeItem('refreshToken');  // 리프레시 토큰 삭제
         
        // TODO: 실제 로그아웃 처리 로직 구현 (상태값 변경 등)
        // navigate('/'); // 메인 페이지로 리다이렉트

        // 페이지를 메인('/')으로 이동시키면서 동시에 '새로고침' 하는 효과가 있습니다.
        window.location.href = '/';   // 메인 페이지로 리다이렉트

    };

    return (
        /* header 스타일 설정:
           - h-16: 고정 높이 16 (약 64px)
           - z-50: 페이지 컨텐츠보다 항상 위에 노출
           - fixed: 상단 고정 (단, className으로 absolute 등이 들어오면 해당 값 적용)
        */
        <header className={`h-16 bg-white border-b border-gray-200 flex justify-between items-center px-6 top-0 w-full z-50 ${className || 'fixed'}`}>

            {/* 1. [좌측] 서비스 로고 영역 */}
            <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
                    INTERVIEW GO
                </Link>
            </div>

            {/* 2. [우측] 내비게이션 및 사용자 메뉴 그룹 */}
            <div className="flex items-center gap-6">

                {/* (A) 서비스 공통 메뉴: 로그인 여부와 관계없이 항상 노출 */}
                <nav className="flex gap-6 text-gray-600 font-medium">
                    <Link to="/codingtest/main" className="hover:text-primary transition-colors">
                        코딩 테스트
                    </Link>
                    <Link to='/joblist' className="hover:text-primary transition-colors">
                        채용 공고
                    </Link>
                    <Link to='/WordCloud' className="hover:text-primary transition-colors">
                        취업 키워드
                    </Link>
                    <Link to='/youtube' className="hover:text-primary transition-colors">
                        추천 영상
                    </Link>
                    
                </nav>

                {/* (B) 조건부 사용자 메뉴 (핵심 로직)
                    - isLoggedIn 값에 따라 서로 다른 버튼 세트를 렌더링합니다.
                */}
                <div className="flex items-center gap-3">
                    {isLoggedIn ? (
                        // Case 1: 회원 상태 (Member)
                        // - 개인화된 서비스 접근(마이페이지) 및 로그아웃 제공
                        <>
                            <Link to="/mypage">
                                <Button variant="ghost" size="small">마이페이지</Button>
                            </Link>
                            <Button variant="outline" size="small" onClick={handleLogout}>
                                로그아웃
                            </Button>
                        </>
                    ) : (
                        // Case 2: 비회원 상태 (Guest)
                        // - 서비스 진입을 위한 회원가입 및 로그인 버튼 제공
                        <>
                            <Link to="/signup">
                                <Button variant="ghost" size="small">회원가입</Button>
                            </Link>
                            <Link to="/login">
                                <Button size="small">로그인</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default MainHeader;