import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import Sidebar from '../../components/layout/Sidebar';
import ProfileSection from './ProfileSection';
import HistoryCodingTest from './HistoryCodingTest';
import HistoryInterview from './HistoryInterview';

// 전화번호 포맷팅 유틸리티 함수
const formatPhoneNumber = (value) => {
    if (!value) return "";
    const cleanVal = value.toString().replace(/[^0-9]/g, ""); 
    if (cleanVal.length < 4) return cleanVal;
    if (cleanVal.length < 7) return cleanVal.replace(/(\d{3})(\d{1})/, "$1-$2");
    if (cleanVal.length < 11) return cleanVal.replace(/(\d{3})(\d{3})(\d{1})/, "$1-$2-$3");
    return cleanVal.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
};

const MyPage = () => {
    const navigate = useNavigate(); 

    // 1. 상태 관리 변수 선언
    const [activeMenu, setActiveMenu] = useState('profile'); 
    const [isEditing, setIsEditing] = useState(false);       
    const [loading, setLoading] = useState(true);            

    // 서버에서 받아온 원본 회원 정보 저장
    const [memberInfo, setMemberInfo] = useState({
        mb_uid: '', username: '', mb_nickname: '', mb_date: '', role: '', mb_pnumber: '', mb_icon: '/images/default.png'
    });

    // 수정 시 사용할 임시 입력 데이터 저장
    const [editForm, setEditForm] = useState({ 
        nickname: '', 
        pnumber: '', 
        check_password: '', 
        mb_icon: '' 
    });

    // 활동 기록 데이터 저장 (내 기능: examHistory 추가)
    const [examHistory, setExamHistory] = useState([]);
    const [interviewHistory, setInterviewHistory] = useState([]);

    // 2. 초기 데이터 로드 (컴포넌트 마운트 시 실행)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const storedUserInfo = localStorage.getItem('userInfo');

                if (!token || !storedUserInfo) {
                    alert("로그인이 필요한 서비스입니다.");
                    navigate('/login');
                    return;
                }

                const currentUser = JSON.parse(storedUserInfo);
                const myUid = currentUser.mb_uid; 

                if (!myUid) {
                    console.error("UID를 찾을 수 없습니다.");
                    navigate('/login');
                    return;
                }

                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                // ✅ 내 기능(exam-history) 요청을 추가하여 병렬 처리
                const [profileRes, examRes, interviewRes] = await Promise.all([
                    axios.get(`/api/mypage/profile?mb_uid=${myUid}`, config),
                    axios.get(`/api/mypage/exam-history?mb_uid=${myUid}`, config),
                    axios.get(`/api/mypage/interview-history?mb_uid=${myUid}`, config)
                ]);

                const rawData = profileRes.data;

                // 받아온 데이터를 상태에 업데이트
                setMemberInfo(rawData);
                setExamHistory(examRes.data || []); // 내 담당 데이터 저장
                setInterviewHistory(interviewRes.data || []); // 조원 데이터 유지

                setEditForm({
                    nickname: rawData.mb_nickname,
                    pnumber: formatPhoneNumber(rawData.mb_pnumber),
                    mb_icon: rawData.mb_icon || '/images/default.png',
                    check_password: ''
                });

            } catch (error) {
                console.error("데이터 로딩 실패:", error);
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userInfo');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    // 3. 사이드바 메뉴 변경 핸들러
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

    // 4. 회원 정보 수정 저장 핸들러
    const handleSave = async () => {
        if (!editForm.check_password) return alert("현재 비밀번호를 입력하세요!");

        try {
            const token = localStorage.getItem('accessToken');
            const updateData = {
                mb_uid: memberInfo.mb_uid,
                nickname: editForm.nickname,
                pnumber: editForm.pnumber.replace(/-/g, ""), 
                check_password: editForm.check_password,
                mb_icon: editForm.mb_icon
            };

            await axios.put('/api/mypage/update', updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("정보가 성공적으로 수정되었습니다.");

            setMemberInfo(prev => ({
                ...prev,
                mb_nickname: editForm.nickname,
                mb_pnumber: updateData.pnumber,
                mb_icon: editForm.mb_icon
            }));

            setIsEditing(false);

            const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (storedUserInfo) {
                storedUserInfo.mb_nickname = editForm.nickname;
                storedUserInfo.mb_icon = editForm.mb_icon;
                localStorage.setItem('userInfo', JSON.stringify(storedUserInfo));
            }

        } catch (e) {
            console.error(e);
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
                        
                        {/* 코딩 테스트 기록 데이터 전달 */}
                        {activeMenu === 'exam' && <HistoryCodingTest data={examHistory} />}
                        
                        
                        {activeMenu === 'interview' && <HistoryInterview data={interviewHistory} />}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default MyPage;