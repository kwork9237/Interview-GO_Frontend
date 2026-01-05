import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import Sidebar from '../../components/layout/Sidebar';
import ProfileSection from './ProfileSection';
import HistoryCodingTest from './HistoryCodingTest';
import HistoryInterview from './HistoryInterview';

// 전화번호 포맷팅 유틸리티 함수
// 입력된 숫자 문자열을 000-0000-0000 형식으로 변환하여 반환
const formatPhoneNumber = (value) => {
    if (!value) return "";
    const cleanVal = value.toString().replace(/[^0-9]/g, ""); // 숫자 이외의 문자 제거
    if (cleanVal.length < 4) return cleanVal;
    if (cleanVal.length < 7) return cleanVal.replace(/(\d{3})(\d{1})/, "$1-$2");
    if (cleanVal.length < 11) return cleanVal.replace(/(\d{3})(\d{3})(\d{1})/, "$1-$2-$3");
    return cleanVal.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
};

const MyPage = () => {
    const navigate = useNavigate(); 

    // 1. 상태 관리 변수 선언
    const [activeMenu, setActiveMenu] = useState('profile'); // 현재 활성화된 메뉴 (기본값: 프로필)
    const [isEditing, setIsEditing] = useState(false);       // 수정 모드 활성화 여부
    const [loading, setLoading] = useState(true);            // 데이터 로딩 상태

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

    // 활동 기록 데이터 저장
    const [examHistory, setExamHistory] = useState([]);
    const [interviewHistory, setInterviewHistory] = useState([]);

    // 2. 초기 데이터 로드 (컴포넌트 마운트 시 실행)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 로컬 스토리지에서 인증 토큰과 사용자 정보 확인
                const token = localStorage.getItem('accessToken');
                const storedUserInfo = localStorage.getItem('userInfo');

                // 인증 정보가 없으면 로그인 페이지로 리다이렉트
                if (!token || !storedUserInfo) {
                    alert("로그인이 필요한 서비스입니다.");
                    navigate('/login');
                    return;
                }

                // 저장된 사용자 정보 파싱 및 UID 추출
                const currentUser = JSON.parse(storedUserInfo);
                const myUid = currentUser.mb_uid; 

                // UID가 유효하지 않을 경우 예외 처리
                if (!myUid) {
                    console.error("UID를 찾을 수 없습니다.");
                    navigate('/login');
                    return;
                }

                // API 요청 헤더 설정 (Bearer Token 포함)
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                // 프로필, 시험 기록, 면접 기록 데이터를 병렬로 요청
                const [profileRes, examRes, interviewRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/mypage/profile?mb_uid=${myUid}`, config),
                    axios.get(`http://localhost:8080/api/mypage/exam-history?mb_uid=${myUid}`, config),
                    axios.get(`http://localhost:8080/api/mypage/interview-history?mb_uid=${myUid}`, config)
                ]);

                const rawData = profileRes.data;

                // 받아온 데이터를 상태에 업데이트
                setMemberInfo(rawData);
                setExamHistory(examRes.data);
                setInterviewHistory(interviewRes.data);

                // 수정 폼의 초기값을 현재 회원 정보로 설정
                setEditForm({
                    nickname: rawData.mb_nickname,
                    pnumber: formatPhoneNumber(rawData.mb_pnumber),
                    mb_icon: rawData.mb_icon || '/images/default.png',
                    check_password: ''
                });

            } catch (error) {
                console.error("데이터 로딩 실패:", error);
                
                // 인증 실패(401) 또는 권한 없음(403) 에러 발생 시 로그아웃 처리
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userInfo');
                    navigate('/login');
                }
            } finally {
                setLoading(false); // 로딩 상태 해제
            }
        };

        fetchData();
    }, [navigate]);

    // 3. 사이드바 메뉴 변경 핸들러
    const handleMenuChange = (menu) => {
        setActiveMenu(menu);
        setIsEditing(false); // 메뉴 변경 시 수정 모드 종료
        
        // 수정 폼 데이터를 다시 원본 데이터로 초기화
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
        // 비밀번호 입력 유효성 검사
        if (!editForm.check_password) return alert("현재 비밀번호를 입력하세요!");

        try {
            const token = localStorage.getItem('accessToken');
            
            // 서버로 전송할 데이터 객체 생성 (전화번호 하이픈 제거)
            const updateData = {
                mb_uid: memberInfo.mb_uid,
                nickname: editForm.nickname,
                pnumber: editForm.pnumber.replace(/-/g, ""), 
                check_password: editForm.check_password,
                mb_icon: editForm.mb_icon
            };

            // 회원 정보 수정 API 요청 (PUT)
            await axios.put('http://localhost:8080/api/mypage/update', updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("정보가 성공적으로 수정되었습니다.");

            // 화면에 표시되는 회원 정보 갱신
            setMemberInfo(prev => ({
                ...prev,
                mb_nickname: editForm.nickname,
                mb_pnumber: updateData.pnumber,
                mb_icon: editForm.mb_icon
            }));

            setIsEditing(false); // 수정 모드 종료

            // 로컬 스토리지의 사용자 정보도 동기화 (새로고침 시 반영 유지)
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

    // 로딩 중일 때 표시할 화면
    if (loading) return <div className="h-screen flex items-center justify-center font-bold text-gray-400">LOADING...</div>;

    return (
        <div className="flex min-h-screen bg-[#F9FAFB]">
            {/* 좌측 사이드바 컴포넌트 */}
            <Sidebar
                memberInfo={isEditing ? { ...memberInfo, mb_nickname: editForm.nickname, mb_icon: editForm.mb_icon } : memberInfo}
                activeMenu={activeMenu}
                onMenuClick={handleMenuChange}
                examCount={examHistory.length}
                interviewCount={interviewHistory.length}
            />

            {/* 우측 메인 콘텐츠 영역 */}
            <main className="flex-1 pl-72 p-12 overflow-y-auto">
                <div className="max-w-5xl mx-auto w-full">
                    {/* 상단 헤더: 타이틀 및 수정/저장 버튼 */}
                    <header className="flex justify-between items-center mb-10">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                            {activeMenu === 'profile' ? 'Account Settings' : `${activeMenu} History`}
                        </h1>
                        {/* 프로필 메뉴일 경우에만 수정/저장 버튼 표시 */}
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

                    {/* 선택된 메뉴에 따른 콘텐츠 렌더링 */}
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