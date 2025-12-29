import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary', // primary, danger, outline, ghost
  size = 'medium',     // small, medium, large
  disabled = false,    // true면 클릭 불가
  className = ''
}) => {

  // 1. 기본 뼈대 (Base)
  const baseStyle = "rounded-xl font-bold transition duration-200 flex justify-center items-center";

  // 2. 종류별 스타일 (Variants)
  const variants = {
    // [Primary: 메인 버튼] 
    // - 가장 중요한 행동 (시작, 저장, 로그인)
    // - 남색 배경 + 흰 글씨 + 마우스 올리면(Hover) 진해짐 + 그림자 커짐(둥실 뜨는 느낌)
    primary: "bg-primary text-white hover:bg-primary-hover shadow-lg hover:shadow-xl",

    // [Danger: 위험 버튼] 
    // - 삭제, 로그아웃, 취소 등 되돌릴 수 없는 행동
    // - 빨간 배경 + 흰 글씨 + 마우스 올리면 약간 투명해짐(Opacity)
    danger: "bg-danger text-white hover:opacity-90 shadow-md",

    // [Outline: 보조 버튼] 
    // - 메인 버튼 옆에 있는 덜 중요한 행동 (이전으로, 닫기)
    // - 흰 배경 + 회색 테두리(border-2) + 글씨는 회색이었다가 마우스 올리면 진해짐
    outline: "bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900",

    // [Ghost: 투명 버튼] 
    // - 버튼인 듯 아닌 듯 조용한 버튼 (비밀번호 찾기, 단독 텍스트 링크)
    // - 배경 투명(bg-transparent) + 마우스 올리면 글씨가 메인색(Primary)으로 변함
    ghost: "bg-transparent text-secondary hover:text-primary hover:bg-gray-100",
  };

  // 3. 크기별 스타일 (Sizes)
  const sizes = {
    small: "px-3 py-1.5 text-sm",     // 촘촘한 목록용
    medium: "px-6 py-3 text-base",    // 기본
    large: "px-8 py-4 text-lg w-full", // 로그인/회원가입 등 강조용
  };

  // 4. 비활성화 스타일 (Disabled)
  const disabledStyle = "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none hover:bg-gray-300 hover:shadow-none";

  return (
    /* 
    사용법 <button variants="2번중 하나(없으면 primary)" size="3번중 하나(없으면 medium)">
    <button disabled> 비 활성화
    */
    <button
      onClick={disabled ? undefined : onClick} // 비활성이면 클릭 이벤트 막기
      disabled={disabled}
      className={`
        ${baseStyle} 
        ${sizes[size]} 
        ${disabled ? disabledStyle : variants[variant]} 
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;