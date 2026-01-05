import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Input from '../../components/common/Input';

const ProfileSection = ({ isEditing, memberInfo, editForm, setEditForm }) => {
    
    // 서버에서 가져온 기본 아이콘 파일명 목록을 저장하는 상태
    const [iconList, setIconList] = useState([]); 

    // 1. 컴포넌트 마운트 시 실행되는 효과
    // 서버로부터 기본 프로필 아이콘 목록을 비동기로 요청하여 가져옴
    useEffect(() => {
        const fetchIcons = async () => {
            try {
                // API 요청을 위해 로컬 스토리지에서 인증 토큰 획득
                const token = localStorage.getItem('accessToken');
                
                // 아이콘 목록 조회 API 호출 (인증 헤더 포함)
                const response = await axios.get('http://localhost:8080/api/mypage/default-icons', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // 응답 성공 시 상태 업데이트
                if (response.status === 200) {
                    setIconList(response.data);
                }
            } catch (error) {
                console.error("아이콘 목록 로드 실패:", error);
            }
        };
        fetchIcons();
    }, []);

    // 2. 텍스트 입력 필드 변경 핸들러
    // 닉네임, 전화번호, 비밀번호 등 텍스트 기반 입력값의 변경 사항을 상태에 반영
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    // 3. 아이콘 선택 핸들러
    // 사용자가 목록에서 아이콘을 클릭했을 때 해당 이미지 경로를 수정 폼 상태에 반영
    const handleIconSelect = (iconName) => {
        const fullPath = `/images/${iconName}`;
        setEditForm(prev => ({ ...prev, mb_icon: fullPath }));
    };

    // 4. 이미지 경로 처리 유틸리티 함수
    // 상대 경로인 경우 서버 도메인을 붙여주고, 이미지가 없으면 기본 이미지를 반환
    const getIconPath = (path) => {
        if (!path) return "/images/default.png";
        if (path.startsWith("http")) return path; // 이미 전체 URL인 경우 그대로 반환
        return `http://localhost:8080${path}`;   // 상대 경로인 경우 서버 주소 추가
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fade-in">
            
            {/* ===================== */}
            {/* 프로필 이미지 표시 및 선택 영역 */}
            {/* ===================== */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8 pb-8 border-b border-gray-100">
                
                {/* 1. 좌측: 현재 선택된 이미지 미리보기 */}
                <div className="shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gray-50 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                        <img
                            // 수정 모드일 때는 선택 중인 아이콘, 아니면 기존 회원 아이콘 표시
                            src={getIconPath(isEditing ? editForm.mb_icon : memberInfo.mb_icon)}
                            className="w-full h-full object-cover transition-all duration-300"
                            alt="프로필"
                            // 이미지 로드 실패 시 기본 이미지로 대체
                            onError={(e) => e.target.src = "/images/default.png"}
                        />
                    </div>
                </div>

                {/* 2. 우측: 상태에 따른 콘텐츠 표시 (수정 모드 vs 조회 모드) */}
                <div className="flex-1 w-full overflow-hidden">
                    {isEditing ? (
                        // [수정 모드] 가로 스크롤 가능한 아이콘 선택 목록 표시
                        <div className="flex flex-col gap-3 animate-fade-in-up">
                            <label className="text-sm font-bold text-gray-700">프로필 아이콘 선택</label>
                            
                            {/* 가로 스크롤 영역 컨테이너 */}
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent p-1">
                                {iconList.map((iconName, index) => {
                                    const iconPath = `/images/${iconName}`;
                                    // 현재 선택된 아이콘인지 확인하여 스타일 차별화
                                    const isSelected = editForm.mb_icon === iconPath;

                                    return (
                                        <img
                                            key={index}
                                            src={`http://localhost:8080/images/${iconName}`}
                                            alt="icon"
                                            onClick={() => handleIconSelect(iconName)}
                                            // 선택된 아이콘은 보라색 테두리와 확대 효과 적용
                                            className={`w-14 h-14 rounded-full cursor-pointer border-2 transition-all duration-200 hover:scale-110 flex-shrink-0 object-cover ${
                                                isSelected 
                                                ? 'border-indigo-600 ring-2 ring-indigo-200 scale-110' 
                                                : 'border-gray-100 hover:border-indigo-300'
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        // [조회 모드] 단순 안내 텍스트 표시
                        <div className="h-24 flex flex-col justify-center">
                            <h3 className="font-bold text-gray-800 text-lg">프로필 사진</h3>
                            <p className="text-sm text-gray-400 mt-1">
                                '내 정보 수정' 버튼을 누르면 아이콘을 변경할 수 있습니다.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ===================== */}
            {/* 사용자 정보 입력 필드 영역 */}
            {/* ===================== */}
            <div className="space-y-4">
                {/* 아이디 (수정 불가능) */}
                <Input
                    label="아이디"
                    value={memberInfo.username || ''}
                    disabled={true}
                />

                {/* 닉네임 (수정 모드 시 활성화) */}
                <Input
                    label="닉네임"
                    name="nickname"
                    value={isEditing ? editForm.nickname : (memberInfo.mb_nickname || '')}
                    onChange={handleChange}
                    disabled={!isEditing}
                />

                {/* 전화번호 (수정 모드 시 활성화) */}
                <Input
                    label="전화번호"
                    name="pnumber"
                    value={isEditing ? editForm.pnumber : (memberInfo.mb_pnumber || '')}
                    onChange={handleChange}
                    disabled={!isEditing}
                />

                {/* 가입일 (수정 불가능, 날짜 포맷 적용) */}
                <Input
                    label="가입일"
                    value={memberInfo.mb_date ? new Date(memberInfo.mb_date).toLocaleDateString() : '-'}
                    disabled={true}
                />

                {/* 비밀번호 확인 (수정 모드일 때만 표시되는 필수 입력 필드) */}
                {isEditing && (
                    <div className="pt-6 mt-6 border-t border-dashed border-red-100 animate-fade-in">
                        <Input
                            label="비밀번호 확인 (필수)"
                            type="password"
                            name="check_password"
                            value={editForm.check_password}
                            onChange={handleChange}
                            placeholder="현재 비밀번호를 입력하세요"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSection;