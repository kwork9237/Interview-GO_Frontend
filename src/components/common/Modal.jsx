import React from 'react';
import Button from './Button';

/**
 * [Common UI] 모달(팝업) 컴포넌트
 * - Header, Body(Scrollable), Footer 구조를 가진 표준 모달
 * - Overlay 클릭 차단 및 내부 스크롤 처리가 포함됨
 * @param {string} size - 모달 너비 설정 (small | medium | large | xlarge)
 */
const Modal = ({
    isOpen,              // 모달 표시 여부
    title,               // 상단 제목
    children,            // 본문 내용
    onClose,             // 닫기/취소 이벤트
    onConfirm,           // 확인/실행 이벤트
    confirmText = "확인",
    cancelText = "취소",
    isConfirmDisabled = false, // 확인 버튼 비활성화 트리거
    size = "medium"      
}) => {
    // 닫힌 상태면 DOM 렌더링 안 함
    if (!isOpen) return null;

    // 사이즈별 최대 너비 설정 (Tailwind max-w 클래스)
    const sizeClasses = {
        small: "max-w-sm",      // 알림/Confirm 용
        medium: "max-w-md",     // 일반 폼
        large: "max-w-3xl",     // 넓은 컨텐츠 (상세보기)
        xlarge: "max-w-5xl"     // 대시보드급 데이터
    };

    return (
        /* 1. Overlay: 화면 전체를 덮는 반투명 배경 + 최상위 z-index */
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] p-4 backdrop-blur-sm">
            
            {/* 2. Modal Container */}
            <div className={`
                bg-white rounded-2xl shadow-2xl w-full 
                flex flex-col max-h-[90vh] /* 뷰포트 높이의 90% 제한 (넘치면 내부 스크롤) */
                animate-fade-in-up
                ${sizeClasses[size] || sizeClasses.medium}
            `}>
                
                {/* Header: 제목 및 닫기 버튼 (shrink-0으로 높이 축소 방지) */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1">
                        ✕
                    </button>
                </div>

                {/* Body: 컨텐츠 영역 */}
                {/* flex-1: 남은 높이 차지 / min-h-0: 중첩 Flexbox 스크롤 이슈 해결용 필수 속성 */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                    <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                        {children}
                    </div>
                </div>

                {/* Footer: 하단 버튼 액션 */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 shrink-0 bg-gray-50 rounded-b-2xl">
                    <Button variant="ghost" onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button variant="primary" onClick={onConfirm} disabled={isConfirmDisabled}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Modal;