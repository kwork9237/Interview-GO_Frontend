import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 1. 리다이렉트용 훅 추가
import axios from 'axios';
import Sidebar from '../../components/layout/Sidebar';
import ProfileSection from './ProfileSection';
import HistoryCodingTest from './HistoryCodingTest';
import HistoryInterview from './HistoryInterview';

// ✅ [유틸] 전화번호 포맷팅 함수
const formatPhoneNumber = (value) => {
    if (!value) return "";
    const cleanVal = value.toString().replace(/[^0-9]/g, "");
    if (cleanVal.length < 4) return cleanVal;
    if (cleanVal.length < 7) return cleanVal.replace(/(\d{3})(\d{1})/, "$1-$2");
    if (cleanVal.length < 11) return cleanVal.replace(/(\d{3})(\d{3})(\d{1})/, "$1-$2-$3");
    return cleanVal.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
};

const MyPage = () => {
    const navigate = useNavigate(); // 👈 2. 네비게이션 훅 초기화

    // 1. 상태 관리
    const [activeMenu, setActiveMenu] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // 원본 유저 정보
    const [memberInfo, setMemberInfo] = useState({
        mb_uid: '', username: '', mb_nickname: '', mb_date: '', role: '', mb_pnumber: '', mb_icon: '/images/default.png'
    });

    // 수정 폼 상태
    const [editForm, setEditForm] = useState({ 
        nickname: '', 
        pnumber: '', 
        check_password: '', 
        mb_icon: '' 
    });

    const [examHistory, setExamHistory] = useState([]);
    const [interviewHistory, setInterviewHistory] = useState([]);

    // 2. 초기 데이터 로드 (로그인 정보 확인 포함)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // -------------------------------------------------------------
                // 🌟 [핵심 변경] 로컬 스토리지에서 로그인 정보 가져오기
                // -------------------------------------------------------------
                // 🚨 주의: 팀원이 저장한 키 값이 'user'가 아니라면 수정해야 함 (예: 'userInfo', 'member' 등)
                const storedUser = localStorage.getItem('user');

                if (!storedUser) {
                    alert("로그인이 필요한 서비스입니다.");
                    navigate('/login'); // 로그인 안 되어 있으면 로그인 페이지로 이동
                    return;
                }

                const currentUser = JSON.parse(storedUser);
                const myUid = currentUser.mb_uid; // 🚨 객체 내부 필드명이 mb_uid인지 확인 필요

                if (!myUid) {
                    console.error("UID를 찾을 수 없습니다.");
                    navigate('/login');
                    return;
                }

                // -------------------------------------------------------------
                // 🌟 실제 UID로 서버 데이터 요청
                // -------------------------------------------------------------
                const [profileRes, examRes, interviewRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/mypage/profile?mb_uid=${myUid}`),
                    axios.get(`http://localhost:8080/api/mypage/exam-history?mb_uid=${myUid}`),
                    axios.get(`http://localhost:8080/api/mypage/interview-history?mb_uid=${myUid}`)
                ]);

                const rawData = profileRes.data;

                // 백엔드 DTO -> 프론트 State 매핑
                setMemberInfo(rawData);
                setExamHistory(examRes.data);
                setInterviewHistory(interviewRes.data);

                // 수정 폼 초기값 설정
                setEditForm({
                    nickname: rawData.mb_nickname,
                    pnumber: formatPhoneNumber(rawData.mb_pnumber),
                    mb_icon: rawData.mb_icon || '/images/default.png',
                    check_password: ''
                });

            } catch (error) {
                console.error("데이터 로딩 실패:", error);
                
                // 401(인증 실패) 에러 등의 경우 로그인 페이지로 보낼 수도 있음
                if (error.response && error.response.status === 401) {
                    alert("세션이 만료되었습니다.");
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]); // navigate 의존성 추가

    // 3. 메뉴 변경 핸들러
    const handleMenuChange = (menu) => {
        setActiveMenu(menu);
        setIsEditing(false);
        setEditForm(prev => ({
            ...prev,
            nickname: memberInfo.mb_nickname,
            pnumber: formatPhoneNumber(memberInfo.mb_pnumber),
            mb_icon: memberInfo.mb_icon,
            check_password: ''
        }));
    };

    // 4. 정보 저장 핸들러
    const handleSave = async () => {
        if (!editForm.check_password) return alert("현재 비밀번호를 입력하세요!");

        try {
            const updateData = {
                mb_uid: memberInfo.mb_uid, // 위에서 불러온 mb_uid 사용
                nickname: editForm.nickname,
                pnumber: editForm.pnumber.replace(/-/g, ""),
                check_password: editForm.check_password,
                mb_icon: editForm.mb_icon
            };

            await axios.put('http://localhost:8080/api/mypage/update', updateData);

            alert("정보가 성공적으로 수정되었습니다.");

            // 화면 갱신
            setMemberInfo(prev => ({
                ...prev,
                mb_nickname: editForm.nickname,
                mb_pnumber: updateData.pnumber,
                mb_icon: editForm.mb_icon
            }));

            setIsEditing(false);

            // (선택 사항) 로컬 스토리지 정보도 갱신해주면 좋음
            // const currentUser = JSON.parse(localStorage.getItem('user'));
            // currentUser.mb_nickname = editForm.nickname;
            // localStorage.setItem('user', JSON.stringify(currentUser));

        } catch (e) {
            alert(e.response?.data || "비밀번호가 일치하지 않거나 오류가 발생했습니다.");
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center font-bold text-gray-400">LOADING...</div>;

    return (
        <div className="flex min-h-screen bg-[#F9FAFB]">
            <Sidebar
                memberInfo={isEditing ? { ...memberInfo, mb_nickname: editForm.nickname, mb_icon: editForm.mb_icon } : memberInfo}
                activeMenu={activeMenu}
                onMenuClick={handleMenuChange}
                examCount={examHistory.length}
                interviewCount={interviewHistory.length}
            />

            <main className="flex-1 pl-72 p-12 overflow-y-auto">
                <div className="max-w-5xl mx-auto w-full">
                    <header className="flex justify-between items-center mb-10">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                            {activeMenu === 'profile' ? 'Account Settings' : `${activeMenu} History`}
                        </h1>
                        {activeMenu === 'profile' && (
                            <button
                                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                                className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${
                                    isEditing ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {isEditing ? '변경사항 저장' : '내 정보 수정'}
                            </button>
                        )}
                    </header>

                    <section className="w-full">
                        {activeMenu === 'profile' && (
                            <ProfileSection
                                isEditing={isEditing}
                                memberInfo={memberInfo}
                                editForm={editForm}
                                setEditForm={setEditForm}
                            />
                        )}
                        {activeMenu === 'exam' && <HistoryCodingTest data={examHistory} />}
                        {activeMenu === 'interview' && <HistoryInterview data={interviewHistory} />}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default MyPage;