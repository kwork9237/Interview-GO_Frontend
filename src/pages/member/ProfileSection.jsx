import React from 'react';
import Input from '../../components/common/Input';

/**
 * 프로필 정보 섹션 컴포넌트
 * - 프로필 이미지 표시 및 변경
 * - 사용자 기본 정보 조회 / 수정
 */
const ProfileSection = ({ isEditing, memberInfo, editForm, setEditForm, fileInputRef, previewIcon, setPreviewIcon }) => {

    // 텍스트 입력값 변경 핸들러 (닉네임, 전화번호, 비밀번호 확인)
    const handleChange = (e) => {
        const { name, value } = e.target;
        // 기존 editForm을 유지하면서 변경된 필드만 업데이트
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    // 프로필 이미지 파일 선택 시 미리보기 처리
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        // 파일이 있을 경우 ObjectURL을 이용해 미리보기 이미지 생성
        if (file) setPreviewIcon(URL.createObjectURL(file));
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fade-in">
            {/* ===================== */}
            {/* 프로필 이미지 영역 */}
            {/* ===================== */}
            <div className="flex items-center gap-8 mb-8 pb-8 border-b border-gray-100">
                <div className="relative">
                    {/* 프로필 이미지 컨테이너 */}
                    <div className="w-24 h-24 rounded-full bg-gray-50 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                        {/* 수정 모드일 경우 미리보기 이미지, 아닐 경우 저장된 이미지 표시 */}
                        {(isEditing ? previewIcon : memberInfo.icon) ? (
                            <img
                                src={isEditing ? previewIcon : memberInfo.icon}
                                className="w-full h-full object-cover"
                                alt="프사"
                            />
                        ) : (
                            // 프로필 이미지가 없을 경우 기본 이모지 표시
                            <span className="text-4xl">😎</span>
                        )}
                    </div>

                    {/* 수정 모드일 때만 이미지 변경 버튼 노출 */}
                    {isEditing && (
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full text-xs"
                        >
                            📷
                        </button>
                    )}

                    {/* 실제 파일 input (숨김 처리) */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                {/* 프로필 이미지 설명 */}
                <div>
                    <h3 className="font-bold text-gray-800">프로필 사진</h3>
                    <p className="text-sm text-gray-400">이미지를 클릭하여 변경하세요.</p>
                </div>
            </div>

            {/* ===================== */}
            {/* 사용자 정보 입력 필드 */}
            {/* ===================== */}
            <div className="space-y-2">
                {/* 아이디 (수정 불가) */}
                <Input
                    label="아이디"
                    value={memberInfo.username}
                    disabled={true}
                />

                {/* 닉네임 (수정 모드일 때만 변경 가능) */}
                <Input
                    label="닉네임"
                    name="nickname"
                    value={isEditing ? editForm.nickname : memberInfo.nickname}
                    onChange={handleChange}
                    disabled={!isEditing}
                />

                {/* 전화번호 (수정 모드일 때만 변경 가능) */}
                <Input
                    label="전화번호"
                    name="pnumber"
                    value={isEditing ? editForm.pnumber : memberInfo.pnumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                />

                {/* 가입일 (수정 불가) */}
                <Input
                    label="가입일"
                    value={memberInfo.joinDate}
                    disabled={true}
                />

                {/* ===================== */}
                {/* 비밀번호 확인 (수정 모드에서만 표시) */}
                {/* ===================== */}
                {isEditing && (
                    <div className="pt-6 mt-6 border-t border-dashed border-red-100">
                        <Input
                            label="비밀번호 확인"
                            type="password"
                            name="checkPassword"
                            value={editForm.checkPassword}
                            onChange={handleChange}
                            placeholder="현재 비밀번호를 입력하세요"
                            error={editForm.checkPassword === '' ? "필수 입력" : ""}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSection;
