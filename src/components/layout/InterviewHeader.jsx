// 면접 전용 헤더 컴포넌트입니다.
// 면접 진행 중 이탈을 방지하기 위한 경고 로직(Modal)이 포함되어 있습니다.

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../common/Button'; // 공통 컴포넌트 버튼 활용
import Modal from '../common/Modal';   // 이탈 방지용 공통 모달
import Badge from '../common/Badge';

/**
 * [레이아웃 컴포넌트: InterviewHeader]
 * @param {string} className - 디자인 가이드 등에서 위치 제어를 위해 전달받는 클래스
 */
const InterviewHeader = ({ className = '' }) => {
    const navigate = useNavigate();
    const { id } = useParams(); // URL의 :id (sid) 값을 가져옵니다.

    // 1. 상태 관리 (State)
    // - 면접 종료 확인 모달의 열림/닫힘 상태를 제어합니다.
    const [isModalOpen, setIsModalOpen] = useState(false);

    // [추가] 면접 종료 여부 상태
    const [isFinished, setIsFinished] = useState(false);

    // [추가] 이벤트 리스너로 종료 상태 감지
    useEffect(() => {
        const handleFinished = () => setIsFinished(true);
        window.addEventListener('interview-finished', handleFinished);
        return () => window.removeEventListener('interview-finished', handleFinished);
    }, []);

    // 2. 이벤트 핸들러 (Handlers)

    // [종료 버튼 클릭 시]
    // - 바로 페이지를 이동시키지 않고, 사용자에게 의사를 묻는 모달을 띄웁니다.
    const handleExitClick = () => {
        if (isFinished) {
            // ⭐ 면접이 끝났으면 모달 없이 바로 메인으로!
            navigate('/');
        } else {
            // 진행 중일 때만 모달 오픈
            setIsModalOpen(true);
        }
    };

    // [모달 - 종료 확정 시]
    // - 사용자가 '종료하기'를 눌렀을 때만 실제 메인 페이지로 이동시킵니다.
    const handleConfirmExit = async () => {
        setIsModalOpen(false);
        // TODO: 면접 중단 로그 기록 등이 필요하면 여기에 작성

        var mbUid = -9999;
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsed = JSON.parse(userInfo);
            mbUid = parsed.mb_uid || -9999;
        }

        try {
            // 백엔드에 중도 이탈(데이터 삭제) 요청
            // TODO: 실제 API 주소에 맞게 수정하세요.
            const response = await fetch(`/api/interview/dropout?sid=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (response.ok) {
                console.log("중도 이탈 세션 삭제 성공");
            }
        } catch (error) {
            console.error("중도 이탈 처리 중 오류 발생:", error);
        }

        navigate('/');
    };

    // [모달 - 취소 시]
    // - 모달만 닫고 면접 화면을 유지합니다.
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        /* fragments(<>)를 사용하여 헤더와 모달을 함께 묶어줍니다. */
        <>
            {/* --- 헤더 UI 영역 --- 
                - h-20: 일반 헤더(h-16)보다 조금 더 높게 설정하여 안정감을 줌
                - fixed: 화면 상단에 고정 (단, className으로 absolute 등이 들어오면 덮어씌움)
            */}
            <header className={`h-20 bg-white border-b border-gray-200 flex justify-between items-center px-6 top-0 w-full z-50 ${className || 'fixed'}`}>

                {/* 왼쪽 영역: 로고 및 진행 상태 표시 */}
                <div className="flex items-center gap-2">
                    {/* 서비스 로고: 면접 중에는 클릭 시 이동하는 것을 방지하기 위해 <span>으로 구현 */}
                    <span className="text-2xl font-bold text-primary select-none cursor-default">
                        TEAM LOGO
                    </span>

                    {/* 현재 상태 배지: 사용자가 '면접 중'임을 인지하게 함 */}
                    <Badge variant='primary'>
                        면접 진행 중
                    </Badge>
                </div>

                {/* 오른쪽 영역: 제어 버튼 */}
                <div>
                    {/* [면접 종료] 버튼: 실수로 누르는 것을 방지하기 위해 눈에 잘 띄는 danger(빨간색) 적용 */}
                    <Button 
                    variant={isFinished ? "primary" : "danger"} 
                    onClick={handleExitClick}
                    >
                        {isFinished ? "면접 마치기" : "면접 종료하기"}
                    </Button>
                </div>
            </header>


            {/* --- 이탈 방지 경고 모달 --- 
                - 사용자가 면접을 중단하려고 할 때 데이터를 잃을 수 있음을 알림
            */}
            <Modal
                isOpen={isModalOpen}
                title="⚠️ 면접을 종료하시겠습니까?"
                confirmText="종료하기"
                onClose={handleCloseModal}
                onConfirm={handleConfirmExit}
            >
                면접이 아직 완료되지 않았습니다.<br />
                지금 종료하면 <span className="font-bold text-red-600">진행 내용은 저장되지 않습니다.</span><br />
                정말 나가시겠습니까?
            </Modal>
        </>
    );
};

export default InterviewHeader;