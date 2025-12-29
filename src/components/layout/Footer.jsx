import React from 'react';

/**
 * [레이아웃 컴포넌트: Footer]
 * - 페이지 최하단에서 서비스 정보, 저작권, 관련 링크를 제공합니다.
 * - 주요 용도: 모든 일반 페이지(MainLayout)의 마침표 역할
 */
const Footer = () => {
    return (
        /* footer 스타일 설정:
           - bg-gray-50: 본문과 구분되는 아주 연한 회색 배경
           - border-t: 상단 테두리를 넣어 본문 영역과의 경계를 명확히 함
           - py-8: 상하단에 넉넉한 여백(약 32px)을 주어 안정감을 줌
        */
        <footer className="bg-gray-50 border-t border-gray-200 py-8">
            
            {/* 컨텐츠 정렬:
                - flex-col: 모바일에서는 위아래로 배치
                - md:flex-row: 태블릿/PC 이상에서는 좌우로 배치
            */}
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">

                {/* 1. [왼쪽] 로고 및 저작권 정보 영역 */}
                <div className="text-center md:text-left">
                    <span className="text-lg font-bold text-gray-400 select-none">
                        Interview-GO
                    </span>
                    <p className="text-sm text-gray-400 mt-1 font-mono">
                        © 2025 Interview-GO Team. All rights reserved.
                    </p>
                </div>

                {/* 2. [오른쪽] 외부 링크 및 약관 영역 */}
                <div className="flex gap-6 text-sm text-gray-400 font-medium">
                    {/* 깃허브 링크: target="_blank"로 새 탭 열기 설정 */}
                    <a 
                        href="https://github.com/your-repo" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="hover:text-primary transition-colors"
                    >
                        Github
                    </a>
                    
                    {/* 약관 정보: 현재는 텍스트만 존재 (추후 Link로 교체 가능) */}
                    <span className="cursor-default hover:text-primary transition-colors">
                        이용약관
                    </span>
                    <span className="cursor-default hover:text-primary transition-colors">
                        개인정보처리방침
                    </span>
                </div>

            </div>
        </footer>
    );
};

export default Footer;