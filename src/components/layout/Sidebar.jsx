import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '../common/Modal'; 

/**
 * [Layout Component] 마이페이지 사이드바
 */
const Sidebar = ({
    memberInfo,
    examCount,
    interviewCount,
    activeMenu,
    onMenuClick
}) => {
    const navigate = useNavigate();
    const SERVER_URL = "http://localhost:8080";

    // 회원 탈퇴 모달 상태
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [confirmInput, setConfirmInput] = useState('');
    const [withdrawPassword, setWithdrawPassword] = useState('');

    const targetText = "회원탈퇴하기";

    /**
     * 회원 탈퇴 API 호출
     */
    const handleWithdraw = async () => {
        try {
            await axios.delete(`${SERVER_URL}/api/mypage/withdraw`, {
                data: {
                    mb_uid: memberInfo.mb_uid,      // 🌟 필드명 mb_uid로 통일
                    mb_password: withdrawPassword
                }
            });

            alert("탈퇴 처리가 완료되었습니다. 그동안 이용해주셔서 감사합니다.");
            localStorage.clear();
            navigate('/');
            window.location.reload();

        } catch (error) {
            alert("비밀번호가 일치하지 않거나 탈퇴 처리 중 오류가 발생했습니다.");
        }
    };

    return (
        <>
            <aside className="fixed top-16 left-0 w-72 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-64px)] z-40 shadow-sm">

                {/* 프로필 요약 */}
                <div className="p-8 flex flex-col items-center bg-slate-50 border-b border-gray-100">
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden mb-4">
                        {/* 🌟 렌더링 로직: DB에 저장된 경로가 있으면 서버 URL과 조합, 없으면 default 캐릭터 표시 */}
                        {memberInfo.mb_icon ? (
                            <img 
                                src={`${SERVER_URL}${memberInfo.mb_icon}`} 
                                alt="프로필" 
                                className="w-full h-full object-cover" 
                                onError={(e) => { e.target.src = `${SERVER_URL}/images/default.png`; }}
                            />
                        ) : (
                            <img 
                                src={`${SERVER_URL}/images/default.png`} 
                                alt="기본프로필" 
                                className="w-full h-full object-cover" 
                            />
                        )}
                    </div>

                    <h2 className="text-lg font-bold text-gray-800">
                        {memberInfo.mb_nickname || '사용자'} 
                    </h2>

                    <span className="mt-1 px-3 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                        {memberInfo.role || 'USER'}
                    </span>
                </div>

                {/* 활동 통계 */}
                <div className="flex border-b border-gray-100 divide-x divide-gray-100">
                    <div className="flex-1 py-4 text-center">
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Solved</div>
                        <div className="text-lg font-black text-blue-600">{examCount || 0}</div>
                    </div>
                    <div className="flex-1 py-4 text-center">
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Interview</div>
                        <div className="text-lg font-black text-green-600">{interviewCount || 0}</div>
                    </div>
                </div>

                {/* 네비게이션 메뉴 */}
                <nav className="flex-1 p-4 space-y-2 mt-4">
                    <MenuButton active={activeMenu === 'profile'} onClick={() => onMenuClick('profile')} icon="👤" label="내 정보 관리" />
                    <MenuButton active={activeMenu === 'exam'} onClick={() => onMenuClick('exam')} icon="💻" label="코딩 테스트 기록" />
                    <MenuButton active={activeMenu === 'interview'} onClick={() => onMenuClick('interview')} icon="🎤" label="면접 연습 기록" />
                </nav>

                {/* 하단 탈퇴 버튼 */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={() => setIsWithdrawModalOpen(true)}
                        className="w-full py-3 text-xs font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                        🚪 회원 탈퇴하기
                    </button>
                </div>
            </aside>

            {/* 회원 탈퇴 모달 */}
            <Modal
                isOpen={isWithdrawModalOpen}
                title="정말 탈퇴하시겠습니까?"
                confirmText="탈퇴하기"
                isConfirmDisabled={confirmInput !== targetText || withdrawPassword === ''}
                onClose={() => {
                    setIsWithdrawModalOpen(false);
                    setConfirmInput('');
                    setWithdrawPassword('');
                }}
                onConfirm={handleWithdraw}
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 leading-relaxed">
                        탈퇴 시 모든 학습 기록이 삭제되며 <span className="text-red-600 font-bold underline">복구가 불가능</span>합니다.
                    </p>

                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <p className="text-[10px] font-bold text-red-400 mb-1 uppercase">
                            안전한 탈퇴를 위해 아래 문구를 입력하세요
                        </p>
                        <p className="font-black text-red-600 mb-2">"{targetText}"</p>
                        <input
                            type="text"
                            value={confirmInput}
                            onChange={(e) => setConfirmInput(e.target.value)}
                            placeholder="문구를 입력해주세요"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-300 transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500">비밀번호 확인</label>
                        <input
                            type="password"
                            value={withdrawPassword}
                            onChange={(e) => setWithdrawPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 transition-all"
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

/** 메뉴 버튼 서브 컴포넌트 */
const MenuButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`w-full px-4 py-3 rounded-xl flex items-center gap-4 font-bold transition-all ${
            active
                ? 'bg-blue-600 text-white shadow-lg translate-x-1'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
        }`}
    >
        <span className="text-xl">{icon}</span>
        <span className="text-sm">{label}</span>
    </button>
);

export default Sidebar;