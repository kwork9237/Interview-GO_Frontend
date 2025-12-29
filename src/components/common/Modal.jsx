import React from 'react';
import Button from './Button'; // 공통 컴포넌트 버튼 활용

/**
 * [공통 컴포넌트: Modal]
 * - 화면 중앙에 나타나 사용자의 최종 확인이나 안내를 돕는 팝업창입니다.
 * - 주요 용도: 면접 종료 확인, 로그아웃 확인, 중요 알림 등
 */
const Modal = ({
    isOpen,           // 모달 표시 여부 (true/false)
    title,            // 모달 상단 제목
    children,         // 모달 본문 내용 (문자열 또는 HTML)
    onClose,          // 취소/닫기 버튼 클릭 시 함수
    onConfirm,        // 확인/진행 버튼 클릭 시 함수
    confirmText = "확인", // 확인 버튼 텍스트 (기본값: 확인)
    cancelText = "취소"   // 취소 버튼 텍스트 (기본값: 취소)
}) => {

    // 1. 노출 여부 체크
    // - isOpen이 false라면 DOM을 아예 생성하지 않아 메모리를 아낍니다.
    if (!isOpen) return null;

    return (
        /* 사용법:
           <Modal 
             isOpen={isModalOpen} 
             title="정말 나갈까요?" 
             onClose={() => setOpen(false)} 
             onConfirm={handleExit}
           >
             지금 나가면 데이터가 저장되지 않습니다.
           </Modal>
        */

        // 2. 오버레이 레이어 (Background)
        // - 검은색 반투명(bg-black/50)으로 뒷 배경을 가려 모달에 집중하게 합니다.
        // - z-[9999]로 설정하여 헤더나 다른 요소보다 무조건 위에 뜨게 합니다.
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] p-4">

            {/* 3. 모달 컨테이너 (Modal Box)
          - animate-fade-in-up: 부드럽게 아래에서 위로 나타나는 애니메이션 적용
          - max-w-md: 너무 넓어지지 않게 최대 너비 제한
      */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden animate-fade-in-up">

                {/* 4. 제목 영역 (Header) */}
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {title}
                </h2>

                {/* 5. 본문 영역 (Body)
            - whitespace-pre-wrap: 줄바꿈(\n)이 포함된 문자열도 그대로 보여줌
        */}
                <div className="text-gray-600 mb-8 whitespace-pre-wrap leading-relaxed">
                    {children}
                </div>

                {/* 6. 액션 버튼 영역 (Actions)
            - 오른쪽 정렬(justify-end)을 기본으로 합니다.
        */}
                <div className="flex justify-end gap-3">
                    {/* [취소] - 배경이 없는 Ghost 스타일로 시선 분산 방지 */}
                    <Button variant="ghost" onClick={onClose}>
                        {cancelText}
                    </Button>

                    {/* [확인] - Danger(빨강) 혹은 Primary를 상황에 맞게 쓰되, 여기서는 경고용 Danger 기본 적용 */}
                    <Button variant="danger" onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default Modal;