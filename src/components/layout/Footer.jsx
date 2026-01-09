import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * [Common UI] 푸터 (Footer)
 * - 애플리케이션 최하단 정보 영역
 * - 현재 경로(Path)를 감지하여 사이드바가 있는 페이지에서는 자동으로 여백(Padding)을 보정함
 */
const Footer = () => {
    // 1. 현재 URL 경로 추적
    const location = useLocation();
    
    // 2. 사이드바가 고정된 페이지인지 판별 (마이페이지, 면접방 등)
    const hasSidebar = location.pathname.startsWith('/mypage') || location.pathname.startsWith('/interview');

    return (
        <footer className={`
            bg-gray-50 border-t border-gray-200 py-8
            transition-all duration-200 ease-in-out
            
            /* [Layout Shift 보정] 
               사이드바가 있는 경로라면, 데스크탑(md) 화면에서 
               사이드바 너비(72 = 18rem)만큼 왼쪽 여백을 확보해 겹침 방지 
            */
            ${hasSidebar ? 'md:pl-72' : ''} 
        `}>
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">

                {/* 1. 좌측: 브랜드 로고 및 Copyright */}
                <div className="text-center md:text-left">
                    <span className="text-lg font-bold text-gray-400 select-none">
                        Interview-GO
                    </span>
                    <p className="text-sm text-gray-400 mt-1 font-mono">
                        © 2025 Interview-GO Team. All rights reserved.
                    </p>
                </div>

                {/* 2. 우측: 외부 링크 및 정책 */}
                <div className="flex gap-6 text-sm text-gray-400 font-medium">
                    <a 
                        href="https://github.com/kwork9237/Interview-GO_Frontend" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="hover:text-blue-600 transition-colors"
                    >
                        Github
                    </a>
                    
                    <span className="cursor-default hover:text-blue-600 transition-colors">
                        이용약관
                    </span>
                    <span className="cursor-default hover:text-blue-600 transition-colors">
                        개인정보처리방침
                    </span>
                </div>

            </div>
        </footer>
    );
};

export default Footer;