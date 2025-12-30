import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../../components/layout/Sidebar';
import ProfileSection from './ProfileSection';
import HistoryCodingTest from './HistoryCodingTest';
import HistoryInterview from './HistoryInterview';

/**
 * 마이페이지 메인 컴포넌트
 * - 프로필 관리
 * - 코딩 테스트 이력
 * - 면접 연습 이력
 */
const MyPage = () => {
    // 1. 상태 관리 -------------------------------------------------

    // 현재 선택된 사이드바 메뉴 (profile / exam / interview)
    const [activeMenu, setActiveMenu] = useState('profile');

    // 프로필 수정 모드 여부
    const [isEditing, setIsEditing] = useState(false);

    // 초기 데이터 로딩 상태
    const [loading, setLoading] = useState(true);

    // 원본 유저 정보 (DB에서 내려온 값)
    const [memberInfo, setMemberInfo] = useState({
        nickname: '', username: '', joinDate: '', role: 'USER', pnumber: '', icon: null
    });

    // 수정 중인 입력값을 담는 임시 폼 상태
    const [editForm, setEditForm] = useState({ nickname: '', pnumber: '', checkPassword: '' });

    // 프로필 이미지 미리보기
    const [previewIcon, setPreviewIcon] = useState(null);

    // 코딩 테스트 / 면접 이력 데이터
    const [examHistory, setExamHistory] = useState([]);
    const [interviewHistory, setInterviewHistory] = useState([]);

    // 파일 input DOM 접근용 ref
    const fileInputRef = useRef(null);

    // 2. 초기 데이터 로드 ------------------------------------------
    useEffect(() => {
        const fetchData = async () => {
            try {
                const myUid = 1; // 임시 UID (추후 로그인 유저 UID로 교체)

                // 시험 이력 / 면접 이력 병렬 호출
                const [exam, interview] = await Promise.all([
                    axios.get(`http://localhost:8080/api/mypage/exam-history?mb_uid=${myUid}`),
                    axios.get(`http://localhost:8080/api/mypage/interview-history?mb_uid=${myUid}`)
                ]);

                setExamHistory(exam.data);
                setInterviewHistory(interview.data);

                // 초기 유저 정보 세팅 (현재는 더미 데이터)
                const userData = {
                    nickname: '코딩왕', username: 'testuser',
                    joinDate: '2025-12-30', role: 'GOLD',
                    pnumber: '010-1234-5678', icon: null
                };

                setMemberInfo(userData);

                // 수정 폼 초기값 세팅
                setEditForm({
                    nickname: userData.nickname,
                    pnumber: userData.pnumber,
                    checkPassword: ''
                });
            } finally {
                // 로딩 종료
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 3. 메뉴 변경 핸들러 ------------------------------------------
    const handleMenuChange = (menu) => {
        setActiveMenu(menu);

        // 메뉴 이동 시 수정 모드 해제
        setIsEditing(false);

        // 수정 중이던 값들을 원본 데이터로 되돌림
        setEditForm({
            nickname: memberInfo.nickname,
            pnumber: memberInfo.pnumber,
            checkPassword: ''
        });

        // 프로필 이미지 미리보기 초기화
        setPreviewIcon(null);
    };

    // 4. 정보 저장 로직 -------------------------------------------
    const handleSave = async () => {
        // 비밀번호 미입력 시 저장 불가
        if (!editForm.checkPassword) return alert("비밀번호를 입력하세요!");

        try {
            // 실제 API 호출 로직은 추후 구현
            alert("정보가 성공적으로 수정되었습니다.");

            // 저장 성공 시 원본 정보 갱신
            setMemberInfo(prev => ({
                ...prev,
                ...editForm,
                icon: previewIcon || prev.icon
            }));

            // 수정 모드 종료
            setIsEditing(false);
        } catch (e) {
            alert("비밀번호가 일치하지 않거나 오류가 발생했습니다.");
        }
    };

    // 로딩 중일 경우 로딩 화면 표시
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center font-bold text-gray-400">
                LOADING...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F9FAFB]">
            {/* 사이드바 영역 (고정) */}
            <Sidebar
                // 수정 중일 때는 사이드바에 수정된 닉네임 반영
                memberInfo={isEditing ? { ...memberInfo, nickname: editForm.nickname } : memberInfo}
                activeMenu={activeMenu}
                onMenuClick={handleMenuChange}
                examCount={examHistory.length}
                interviewCount={interviewHistory.length}
                isEditing={isEditing}
                previewIcon={previewIcon}
            />

            {/* 메인 콘텐츠 영역 */}
            {/* 사이드바 너비만큼 왼쪽 패딩(pl-72) */}
            <main className="flex-1 pl-72 p-12 overflow-y-auto">
                <div className="max-w-5xl mx-auto w-full">

                    {/* 상단 헤더 */}
                    <header className="flex justify-between items-center mb-10">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                            {activeMenu === 'profile'
                                ? 'Account Settings'
                                : `${activeMenu} History`}
                        </h1>

                        {/* 프로필 메뉴일 때만 수정/저장 버튼 노출 */}
                        {activeMenu === 'profile' && (
                            <button
                                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                                className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${
                                    isEditing
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {isEditing ? '변경사항 저장' : '내 정보 수정'}
                            </button>
                        )}
                    </header>

                    {/* 메뉴별 콘텐츠 영역 */}
                    <section className="w-full">
                        {activeMenu === 'profile' && (
                            <ProfileSection
                                isEditing={isEditing}
                                memberInfo={memberInfo}
                                editForm={editForm}
                                setEditForm={setEditForm}
                                fileInputRef={fileInputRef}
                                previewIcon={previewIcon}
                                setPreviewIcon={setPreviewIcon}
                            />
                        )}

                        {/* 코딩 테스트 이력 */}
                        {activeMenu === 'exam' && (
                            <HistoryCodingTest data={examHistory} />
                        )}

                        {/* 면접 연습 이력 */}
                        {activeMenu === 'interview' && (
                            <HistoryInterview data={interviewHistory} />
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default MyPage;
