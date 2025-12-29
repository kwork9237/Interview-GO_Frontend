import React from 'react';

/**
 * [공통 컴포넌트: Badge]
 * - 현재 진행 상태나 완료 여부를 짧고 명확하게 표시할 때 사용합니다.
 * - 주요 용도: 코딩 테스트 해결 여부(Solved/Unsolved), 면접 예약 상태 등
 */
const Badge = ({ 
  children, 
  variant = 'primary', // primary, success, danger, warning, gray
  className = '' 
}) => {

  // 1. 상태별 스타일 (Variants)
  // - 진행률이나 결과에 따라 시각적 피드백을 다르게 줍니다.
  const variants = {
    // [Primary: 진행 중, 정보]
    // - 면접 진행 중, 코딩 테스트 시도 중 등
    primary: "bg-indigo-50 text-indigo-700 border-indigo-100",

    // [Success: 완료, 통과]
    // - 코딩 테스트 해결(Solved), 면접 완료 등
    success: "bg-green-50 text-green-700 border-green-100",

    // [Danger: 실패, 중단]
    // - 면접 중단, 불합격 등
    danger: "bg-red-50 text-red-700 border-red-100",

    // [Warning: 대기, 주의]
    // - 결제 대기, 면접 예정 등
    warning: "bg-yellow-50 text-yellow-700 border-yellow-100",

    // [Gray: 미수행, 기본]
    // - 코딩 테스트 미풀이(Unsolved), 기본 태그 등
    gray: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    /* 사용법: 
       <Badge variant="success">Solved</Badge>
       <Badge variant="gray">Unsolved</Badge>
    */
    <span className={`
      inline-flex items-center px-2.5 py-0.5 
      rounded-full text-xs font-bold border
      ${variants[variant]} 
      ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;