import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Input from '../../components/common/Input';
import Card from '../../components/common/Card'; 
import CommonModal from '../../components/common/Modal'; 

const PasswordChangeModal = ({ isOpen, onClose, memberInfo }) => {
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [validation, setValidation] = useState({ isMatch: false, isLengthOk: false, message: '' });

    useEffect(() => {
        if (isOpen) {
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setValidation({ isMatch: false, isLengthOk: false, message: '' });
        }
    }, [isOpen]);

    useEffect(() => {
        const { newPassword, confirmPassword } = form;
        
        if (!newPassword && !confirmPassword) {
            setValidation({ isMatch: false, isLengthOk: false, message: '' });
            return;
        }
        const isLengthOk = newPassword.length >= 4;
        const isMatch = newPassword === confirmPassword;
        let message = '';
        if (!isLengthOk) message = '4자 이상 입력해주세요.';
        else if (!isMatch) message = '비밀번호가 일치하지 않습니다.';
        else message = '사용 가능한 비밀번호입니다.';
        setValidation({ isMatch, isLengthOk, message });
    }, [form]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.put('http://localhost:8080/api/mypage/password', {
                mb_uid: memberInfo.mb_uid,
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
            localStorage.clear();
            window.location.href = '/login';
        } catch (error) {
            alert(error.response?.data || "비밀번호 변경 실패");
        }
    };

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title="비밀번호 변경"
            onConfirm={handleSubmit}
            confirmText="변경하기"
            cancelText="취소"
            isConfirmDisabled={!validation.isMatch || !validation.isLengthOk || !form.currentPassword}
            size="small"
        >
            <div className="space-y-4 py-2">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">현재 비밀번호</label>
                    <input 
                        type="password" name="currentPassword" 
                        value={form.currentPassword} onChange={handleChange} 
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-indigo-500 outline-none transition-colors" 
                        placeholder="현재 비밀번호 입력" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500">새 비밀번호</label>
                    <input 
                        type="password" name="newPassword" 
                        value={form.newPassword} onChange={handleChange} 
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-indigo-500 outline-none transition-colors" 
                        placeholder="새 비밀번호 (4자 이상)" 
                    />
                    <input 
                        type="password" name="confirmPassword" 
                        value={form.confirmPassword} onChange={handleChange} 
                        className={`w-full p-3 bg-gray-50 rounded-xl border outline-none transition-colors ${
                            !validation.isMatch && form.confirmPassword ? 'border-red-300 bg-red-50' : 
                            (validation.isMatch && form.confirmPassword ? 'border-green-300 bg-green-50' : 'border-gray-200 focus:bg-white focus:border-indigo-500')
                        }`} 
                        placeholder="새 비밀번호 확인" 
                    />
                    {(form.newPassword || form.confirmPassword) && (
                        <p className={`text-xs font-bold text-right ${validation.isMatch && validation.isLengthOk ? 'text-green-600' : 'text-red-500'}`}>
                            {validation.message}
                        </p>
                    )}
                </div>
            </div>
        </CommonModal>
    );
};

// ==========================================
// 2. [메인 컴포넌트] 프로필 섹션
// ==========================================
const ProfileSection = ({ isEditing, memberInfo, editForm, setEditForm }) => {
    
    const [showPwModal, setShowPwModal] = useState(false);
    const [iconList, setIconList] = useState([]); 

    useEffect(() => {
        const fetchIcons = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const res = await axios.get('http://localhost:8080/api/mypage/default-icons', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.status === 200) setIconList(res.data);
            } catch (error) { console.error(error); }
        };
        fetchIcons();
    }, []);

    const handleChange = (e) => setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleIconSelect = (iconName) => setEditForm(prev => ({ ...prev, mb_icon: `/images/${iconName}` }));
    
    const getIconPath = (path) => {
        if (!path) return "/images/default.png";
        if (path.startsWith("http")) return path;
        return `http://localhost:8080${path}`;
    };

    // 🌟 [추가됨] 전화번호 하이픈(-) 자동 포맷팅 함수
    const formatPhoneNumber = (value) => {
        if (!value) return "";
        // 숫자만 추출
        const cleanVal = value.replace(/[^0-9]/g, ""); 
        // 010-1234-5678 형식으로 변환
        return cleanVal.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
    };

    return (
        <Card padding="large" className="relative h-full"> 
            
            {/* 비밀번호 변경 버튼 */}
            {!isEditing && (
                <div className="absolute top-6 right-6 z-10">
                    <button 
                        onClick={() => setShowPwModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 text-xs font-bold rounded-lg border border-gray-200 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                    >
                        비밀번호 변경
                    </button>
                </div>
            )}

            {/* --- 프로필 이미지 & 기본 정보 --- */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="shrink-0 flex justify-center md:justify-start">
                    <div className="w-28 h-28 rounded-full bg-gray-50 border-4 border-white shadow-lg overflow-hidden relative group">
                        <img
                            src={getIconPath(isEditing ? editForm.mb_icon : memberInfo.mb_icon)}
                            className="w-full h-full object-cover"
                            alt="프로필"
                            onError={(e) => e.target.src = "/images/default.png"}
                        />
                    </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    {isEditing ? (
                        <div className="animate-fade-in-up">
                            <label className="text-xs font-bold text-gray-500 mb-2 block">프로필 아이콘 선택</label>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-indigo-100 p-1">
                                {iconList.map((iconName, idx) => {
                                    const isSelected = editForm.mb_icon === `/images/${iconName}`;
                                    return (
                                        <img key={idx} src={`http://localhost:8080/images/${iconName}`} alt="icon"
                                            onClick={() => handleIconSelect(iconName)}
                                            className={`w-12 h-12 rounded-full cursor-pointer object-cover border-2 transition-all hover:scale-110 ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-100 scale-105' : 'border-transparent hover:border-indigo-200'}`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-2">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-bold text-gray-900">{memberInfo.mb_nickname}</h2>
                            </div>
                            <p className="text-gray-400 text-sm">{memberInfo.username}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- 입력 필드들 --- */}
            <div className="space-y-4 mb-2">
                <Input label="아이디" value={memberInfo.username || ''} disabled={true} />
                <Input label="가입일" value={memberInfo.mb_date ? new Date(memberInfo.mb_date).toLocaleDateString() : '-'} disabled={true} />
                <Input label="닉네임" name="nickname" value={isEditing ? editForm.nickname : (memberInfo.mb_nickname || '')} onChange={handleChange} disabled={!isEditing} />
                
                {/* 🌟 [수정됨] formatPhoneNumber 함수 적용 */}
                <Input 
                    label="전화번호" 
                    name="pnumber" 
                    value={formatPhoneNumber(isEditing ? editForm.pnumber : (memberInfo.mb_pnumber || ''))} 
                    onChange={handleChange} 
                    disabled={!isEditing} 
                />
            </div>

            {/* --- [필수] 수정 모드 시 저장용 확인 --- */}
            {isEditing && (
                <div className="mt-8 pt-6 border-t border-gray-100 animate-fade-in">
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex gap-4 items-center">
                        <span className="text-xl">⚠️</span>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-red-500 mb-1">정보 수정 확인 (필수)</label>
                            <input
                                type="password"
                                name="check_password"
                                value={editForm.check_password}
                                onChange={handleChange}
                                placeholder="현재 비밀번호를 입력해야 정보가 저장됩니다"
                                className="w-full bg-white border border-red-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* 모달 */}
            <PasswordChangeModal 
                isOpen={showPwModal} 
                onClose={() => setShowPwModal(false)} 
                memberInfo={memberInfo} 
            />
        </Card>
    );
};

export default ProfileSection;