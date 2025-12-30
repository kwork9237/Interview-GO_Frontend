import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal'; 

/**
 * [Layout Component] 마이페이지 사이드바
 * - 프로필 요약, 활동 통계, 네비게이션 메뉴를 제공하는 고정형 패널
 * - 회원 탈퇴(Withdraw) 프로세스도 이곳에서 진입
 */
const Sidebar = ({
    memberInfo,     // 사용자 정보 객체 (nickname, role, icon 등)
    examCount,      // 푼 문제 수
    interviewCount, // 면접 연습 횟수
    activeMenu,     // 현재 선택된 탭 ('profile' | 'exam' | 'interview')
    onMenuClick,    // 탭 변경 핸들러
    isEditing,      // 프로필 수정 모드 여부
    previewIcon     // 수정 중인 프로필 이미지 미리보기 URL
}) => {
    const navigate = useNavigate();

    // 회원 탈퇴 모달 상태 관리
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [confirmInput, setConfirmInput] = useState('');
    const targetText = "회원탈퇴하기"; // 탈퇴 확인용 매직 텍스트

    // 회원 탈퇴 핸들러 (Mock Logic)
    const handleWithdraw = async () => {
        try {
            // TODO: 실제 API 연동 시 주석 해제
            // await axios.delete(`/api/member/withdraw/${memberInfo.uid}`);
            
            alert("탈퇴 처리가 완료되었습니다. 그동안 이용해주셔서 감사합니다.");
            
            // 세션 정리 및 메인 리다이렉트
            localStorage.clear();
            navigate('/');
            window.location.reload();
        } catch (error) {
            alert("탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <>
            {/* [Layout Strategy]
                - fixed: 스크롤 시에도 좌측에 고정
                - top-16: Global Header 높이(약 64px)만큼 상단 여백 확보
                - h-[calc]: 화면 전체 높이에서 헤더를 뺀 나머지 영역만 차지
            */}
            <aside className="fixed top-16 left-0 w-72 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-64px)] z-40 shadow-sm">

                {/* 1. 프로필 요약 영역 */}
                <div className="p-8 flex flex-col items-center bg-slate-50 border-b border-gray-100">
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden mb-4">
                        {/* 이미지 렌더링 우선순위: 1.수정중인 미리보기 -> 2.기존 프로필 -> 3.기본 이모지 */}
                        {(isEditing && previewIcon) ? (
                            <img src={previewIcon} alt="프사" className="w-full h-full object-cover" />
                        ) : (
                            memberInfo.icon ? <img src={memberInfo.icon} alt="프사" className="w-full h-full object-cover" /> : <span className="text-4xl">😎</span>
                        )}
                    </div>
                    
                    <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                        {memberInfo.nickname}
                    </h2>
                    
                    {/* 역할(Role) 배지 */}
                    <span className="mt-1 px-3 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                        {memberInfo.role || 'USER'}
                    </span>
                </div>

                {/* 2. 활동 통계 (Solved / Interview) */}
                <div className="flex border-b border-gray-100 divide-x divide-gray-100 bg-white">
                    <div className="flex-1 py-4 text-center">
                        <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Solved</div>
                        <div className="text-lg font-black text-blue-600">{examCount || 0}</div>
                    </div>
                    <div className="flex-1 py-4 text-center">
                        <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Interview</div>
                        <div className="text-lg font-black text-green-600">{interviewCount || 0}</div>
                    </div>
                </div>

                {/* 3. 네비게이션 메뉴 (가변 높이, 스크롤 가능) */}
                <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
                    <MenuButton
                        active={activeMenu === 'profile'}
                        onClick={() => onMenuClick('profile')}
                        label="내 정보 관리"
                        icon="👤" // 아이콘 추가
                    />
                    <MenuButton
                        active={activeMenu === 'exam'}
                        onClick={() => onMenuClick('exam')}
                        label="코딩 테스트 기록"
                        icon="💻"
                    />
                    <MenuButton
                        active={activeMenu === 'interview'}
                        onClick={() => onMenuClick('interview')}
                        label="면접 연습 기록"
                        icon="🎤"
                    />
                </nav>

                {/* 4. 하단 고정 영역 (회원 탈퇴) */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 mt-auto">
                    <button
                        onClick={() => setIsWithdrawModalOpen(true)}
                        className="w-full px-4 py-3 text-xs font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-2 border border-transparent hover:border-red-100"
                    >
                        🚪 회원 탈퇴하기
                    </button>
                </div>
            </aside>

            {/* 회원 탈퇴 확인 모달 */}
            <Modal
                isOpen={isWithdrawModalOpen}
                title="정말 탈퇴하시겠습니까?"
                confirmText="탈퇴하기"
                isConfirmDisabled={confirmInput !== targetText} // 입력 문구가 정확해야 버튼 활성화
                onClose={() => {
                    setIsWithdrawModalOpen(false);
                    setConfirmInput('');
                }}
                onConfirm={handleWithdraw}
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 leading-relaxed">
                        탈퇴 시 모든 학습 기록이 삭제되며 <span className="text-red-600 font-bold underline">복구가 불가능합니다.</span>
                    </p>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <p className="text-[10px] text-red-400 font-bold mb-2 uppercase tracking-tight">확인을 위해 아래 문구를 입력해주세요</p>
                        <p className="text-lg font-black text-red-600 mb-3 select-none">"{targetText}"</p>
                        <input
                            type="text"
                            placeholder="문구를 정확히 입력하세요"
                            value={confirmInput}
                            onChange={(e) => setConfirmInput(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 outline-none transition-all font-bold"
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

// [Sub Component] 메뉴 버튼 UI
const MenuButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`w-full px-4 py-3 rounded-xl flex items-center gap-4 transition-all duration-200 group ${active
            ? 'bg-blue-600 text-white shadow-blue-200 shadow-lg' // Active State
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900' // Inactive State
            }`}
    >
        <span className={`text-xl ${active ? 'scale-110' : 'opacity-70 group-hover:opacity-100'}`}>{icon}</span>
        <span className="font-bold text-sm">{label}</span>
    </button>
);

export default Sidebar;