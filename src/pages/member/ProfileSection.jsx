import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Input from '../../components/common/Input';

/**
 * [유틸리티] 전화번호 포맷팅 함수
 * 입력된 숫자를 010-0000-0000 형식으로 변환하여 반환
 */
const formatPhoneNumber = (value) => {
    if (!value) return "";
    const cleanVal = value.toString().replace(/[^0-9]/g, "");
    
    if (cleanVal.length < 4) return cleanVal;
    if (cleanVal.length < 7) return cleanVal.replace(/(\d{3})(\d{1})/, "$1-$2");
    if (cleanVal.length < 11) return cleanVal.replace(/(\d{3})(\d{3})(\d{1})/, "$1-$2-$3");
    return cleanVal.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
};

/**
 * [컴포넌트] 프로필 정보 조회 및 수정 섹션
 * - 프로필 이미지(서버 제공 아이콘) 선택 기능
 * - 닉네임, 전화번호, 비밀번호 확인 기능 제공
 */
const ProfileSection = ({ isEditing, memberInfo, editForm, setEditForm }) => {
    const SERVER_URL = "http://localhost:8080";
    
    // 서버에서 받아온 기본 아이콘 목록 상태
    const [iconList, setIconList] = useState([]);

    /**
     * [초기화] 컴포넌트 마운트 시 서버에 저장된 기본 아이콘 목록 조회
     * - static/images 폴더 내의 파일 리스트를 자동으로 가져옴
     */
    useEffect(() => {
        const fetchIcons = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/api/mypage/default-icons`);
                setIconList(response.data);
            } catch (error) {
                console.error("아이콘 목록 로드 실패:", error);
                // API 호출 실패 시 기본 아이콘 하나만 설정 (Fallback)
                setIconList(['default.png']);
            }
        };

        fetchIcons();
    }, []);

    /**
     * [핸들러] 입력 필드 변경
     * - 전화번호 필드일 경우 자동 포맷팅 적용
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;

        if (name === 'pnumber') {
            finalValue = formatPhoneNumber(value);
        }

        setEditForm(prev => ({ ...prev, [name]: finalValue }));
    };

    /**
     * [핸들러] 프로필 아이콘 선택
     * - 선택한 파일명을 기반으로 이미지 경로 설정 (/images/filename.png)
     */
    const handleIconSelect = (iconName) => {
        const iconPath = `/images/${iconName}`;
        setEditForm(prev => ({ ...prev, mb_icon: iconPath }));
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fade-in">
            
            {/* 1. 프로필 이미지 및 아이콘 선택 영역 */}
            <div className="flex flex-col gap-6 mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-8">
                    {/* 현재 선택된 이미지 미리보기 */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gray-50 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                            <img
                                src={`${SERVER_URL}${isEditing ? (editForm.mb_icon || '/images/default.png') : (memberInfo.mb_icon || '/images/default.png')}`}
                                className="w-full h-full object-cover"
                                alt="프로필"
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">프로필 캐릭터</h3>
                        <p className="text-sm text-gray-400">나를 표현할 아이콘을 선택하세요.</p>
                    </div>
                </div>

                {/* [UI] 아이콘 선택 리스트 (수정 모드에서만 표시) */}
                {isEditing && (
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl overflow-x-auto custom-scrollbar">
                        {iconList.map((icon) => (
                            <button
                                key={icon}
                                type="button"
                                onClick={() => handleIconSelect(icon)}
                                className={`flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${
                                    editForm.mb_icon === `/images/${icon}` ? 'border-blue-500 scale-110 shadow-lg' : 'border-transparent'
                                }`}
                            >
                                <img src={`${SERVER_URL}/images/${icon}`} alt={icon} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 2. 정보 입력 필드 영역 */}
            <div className="space-y-2">
                <Input label="아이디" value={memberInfo.username} disabled={true} />

                <Input
                    label="닉네임"
                    name="nickname"
                    value={isEditing ? editForm.nickname : memberInfo.mb_nickname}
                    onChange={handleChange}
                    disabled={!isEditing}
                />

                <Input
                    label="전화번호"
                    name="pnumber"
                    value={isEditing ? editForm.pnumber : memberInfo.mb_pnumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="숫자만 입력하세요"
                    maxLength={13}
                />

                <Input label="가입일" value={memberInfo.mb_date} disabled={true} />

                {/* [UI] 비밀번호 확인 필드 (수정 모드에서만 표시) */}
                {isEditing && (
                    <div className="pt-6 mt-6 border-t border-dashed border-red-100">
                        <Input
                            label="비밀번호 확인"
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