import React from 'react';

const Card = ({
    children,
    title,
    subtitle,
    onClick,
    className = "",
    hover = true,
    size = "medium" // small, medium, large
}) => {

    // 1. 크기별 스타일 (Sizes & Layout)
    // - 컨텐츠의 양과 중요도에 따라 패딩(p)과 최소 높이(min-h)를 조절합니다.
    const sizeStyles = {
        // [Small: 미니 정보용] 
        // - 대시보드 통계, 작은 상태 표시(Badge 대용)
        // - 촘촘한 여백 + 낮은 높이
        small: "p-3 min-h-[120px]",

        // [Medium: 표준 목록용] 
        // - 뉴스 리스트, 일반적인 게시글 조각
        // - 기본 여백 + 적당한 높이감
        medium: "p-6 min-h-[200px]",

        // [Large: 메인 강조용] 
        // - 메인 페이지 하단 하이라이트(유튜브, 뉴스 API)
        // - 넓은 여백 + 시원한 높이감으로 가독성 극대화
        large: "p-8 min-h-[350px]"
    };

    // 2. 제목 텍스트 스타일 (Typography)
    // - 카드 체급에 맞춰 제목 크기를 자동으로 조정합니다.
    const titleStyles = {
        small: "text-base font-bold",
        medium: "text-xl font-bold",
        large: "text-2xl font-extrabold"
    };

    return (
        /* 사용법:
          <Card title="제목" subtitle="부제목" size="large"> 내용 </Card>
          - hover={false}: 마우스 올렸을 때 움직임 효과 제거
          - onClick: 클릭 시 실행할 함수 (상세 페이지 이동 등)
        */
        <div
            onClick={onClick}
            className={`
        bg-white rounded-2xl border border-gray-100 flex flex-col
        shadow-card transition-all duration-300
        ${sizeStyles[size]}
        ${hover ? 'hover:shadow-floating hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
        >
            {/* 상단 텍스트 영역: 제목이나 부제목이 있을 때만 렌더링 */}
            {(title || subtitle) && (
                <div className={size === 'small' ? 'mb-2' : 'mb-4'}>
                    {title && <h3 className={`${titleStyles[size]} text-gray-900`}>{title}</h3>}
                    {subtitle && (
                        <p className={`${size === 'small' ? 'text-[10px]' : 'text-sm'} text-gray-500 mt-0.5`}>
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            {/* 카드 본문 영역: flex-1을 사용하여 남은 공간을 꽉 채움 */}
            <div className="text-gray-700 flex-1">
                {children}
            </div>
        </div>
    );
};

export default Card;