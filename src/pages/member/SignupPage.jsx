import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();

    // 상태 관리 변수
    const [formData, setFormData] = useState({
        username: '',
        mb_password: '',
        mb_password_confirm: '', // ✨ 추가: 비밀번호 확인용 상태
        mb_nickname: '',
        mb_pnumber: '',
    });

    // 중복 검사 통과 여부 상태
    const [isIdChecked, setIsIdChecked] = useState(false);
    // ✨ 추가: 약관 동의 상태
    const [isTermChecked, setIsTermChecked] = useState(false);

    // 비밀번호 보이기/숨기기 상태 (각각 따로 관리)
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // ✨ 추가

    const { username, mb_password, mb_password_confirm, mb_nickname, mb_pnumber } = formData;

    // 일반 입력 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // ID가 변경되면 중복 검사 초기화
        if (name === 'username') {
            setIsIdChecked(false);
        }
    };

    // 전화번호 포맷팅 핸들러
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        let formattedPhone = '';
        if (value.length <= 3) formattedPhone = value;
        else if (value.length <= 7) formattedPhone = `${value.slice(0, 3)}-${value.slice(3)}`;
        else formattedPhone = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;

        if (formattedPhone.length <= 13) {
            setFormData((prev) => ({ ...prev, mb_pnumber: formattedPhone }));
        }
    };

    // 중복 검사 핸들러
    const handleCheckDuplicate = async () => {
        if (!username) { alert('ID(이메일)를 입력해주세요.'); return; }
        try {
            const response = await axios.get(`http://localhost:8080/check-id`, { params: { username } });
            if (response.status === 200 && response.data === true) {
                alert('사용 가능한 ID입니다.'); setIsIdChecked(true);
            } else {
                alert('이미 사용 중인 ID입니다.'); setIsIdChecked(false);
            }
        } catch (error) {
            const msg = error.response?.data?.message || '이미 사용 중인 ID입니다.';
            alert(msg); setIsIdChecked(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isIdChecked) { alert('ID 중복 검사를 진행해주세요.'); return; }
        
        // ✨ 추가: 비밀번호 일치 검사
        if (mb_password !== mb_password_confirm) {
            alert('비밀번호가 일치하지 않습니다.'); return;
        }

        // ✨ 추가: 약관 동의 검사
        if (!isTermChecked) {
            alert('서비스 이용약관에 동의해주세요.'); return;
        }

        const phoneNumeric = mb_pnumber.replace(/-/g, '');
        if (phoneNumeric.length < 10) { alert('전화번호를 정확히 입력해주세요.'); return; }

        // 전송할 데이터 (비밀번호 확인용 필드는 제외하고 전송)
        const submitData = {
            username,
            mb_password,
            mb_nickname,
            mb_pnumber
        };

        try {
            const response = await axios.post('http://localhost:8080/join', submitData);
            if (response.status === 200 || response.status === 201) {
                alert(`${mb_nickname}님 회원가입이 완료되었습니다!`);
                navigate('/login');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
            alert(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="w-full h-20 bg-white border-b border-gray-200 flex items-center px-8 md:px-20 shrink-0">
                <div className="text-indigo-600 text-2xl font-bold cursor-pointer select-none" onClick={() => navigate('/')}>
                    TEAM LOGO
                </div>
            </header>

            <div className="flex-1 flex justify-center items-center p-4 my-8">
                <div className="w-full max-w-sm flex flex-col gap-8 bg-transparent">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">회원가입</h1>
                        <p className="text-gray-500">새로운 계정을 생성하세요.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* 1. 아이디 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">아이디 (Email)</label>
                            <div className="flex gap-2">
                                <input type="email" name="username" value={username} onChange={handleChange} className="flex-1 h-12 px-4 rounded-xl border border-gray-300 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all bg-white" placeholder="이메일을 입력해주세요" required />
                                <button type="button" onClick={handleCheckDuplicate} className="w-24 h-12 bg-gray-600 text-white text-sm font-bold rounded-xl hover:bg-gray-700 transition-colors shadow-sm">중복확인</button>
                            </div>
                            {username && <p className={`text-xs ml-1 ${isIdChecked ? 'text-green-600' : 'text-red-500'}`}>{isIdChecked ? '사용 가능한 아이디입니다.' : '중복 검사가 필요합니다.'}</p>}
                        </div>

                        {/* 2. 비밀번호 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">비밀번호</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} name="mb_password" value={mb_password} onChange={handleChange} className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-300 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all bg-white" placeholder="비밀번호를 입력하세요" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 focus:outline-none">
                                    {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.059 10.059 0 013.999-5.42m3.714-2.172a9.994 9.994 0 018.625 1.564m-6.427 3.443a3 3 0 014.243 4.242" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>}
                                </button>
                            </div>
                        </div>

                        {/* ✨ 추가: 비밀번호 확인 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">비밀번호 확인</label>
                            <div className="relative">
                                <input 
                                    type={showPasswordConfirm ? "text" : "password"} 
                                    name="mb_password_confirm" 
                                    value={mb_password_confirm} 
                                    onChange={handleChange} 
                                    className={`w-full h-12 px-4 pr-12 rounded-xl border text-base outline-none focus:ring-2 transition-all bg-white ${
                                        mb_password_confirm && mb_password !== mb_password_confirm 
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
                                        : 'border-gray-300 focus:border-indigo-600 focus:ring-indigo-100'
                                    }`}
                                    placeholder="비밀번호를 한 번 더 입력하세요" 
                                    required 
                                />
                                <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 focus:outline-none">
                                    {showPasswordConfirm ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.059 10.059 0 013.999-5.42m3.714-2.172a9.994 9.994 0 018.625 1.564m-6.427 3.443a3 3 0 014.243 4.242" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>}
                                </button>
                            </div>
                            {/* 일치 여부 메시지 */}
                            {mb_password_confirm && (
                                <p className={`text-xs ml-1 ${mb_password === mb_password_confirm ? 'text-green-600' : 'text-red-500'}`}>
                                    {mb_password === mb_password_confirm ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                                </p>
                            )}
                        </div>

                        {/* 3. 닉네임 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">닉네임</label>
                            <input type="text" name="mb_nickname" value={mb_nickname} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-gray-300 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all bg-white" placeholder="사용하실 닉네임을 입력하세요" required />
                        </div>

                        {/* 4. 전화번호 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">전화번호</label>
                            <input type="tel" name="mb_pnumber" value={mb_pnumber} onChange={handlePhoneChange} className="w-full h-12 px-4 rounded-xl border border-gray-300 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all bg-white" placeholder="010-0000-0000" maxLength={13} required />
                        </div>

                        {/* ✨ 추가: 약관 동의 체크박스 */}
                        <div className="flex items-center gap-2 mt-2 px-1">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                checked={isTermChecked} 
                                onChange={(e) => setIsTermChecked(e.target.checked)} 
                                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer select-none">
                                <span className="text-indigo-600 font-bold">[필수]</span> 서비스 이용약관에 동의합니다.
                            </label>
                        </div>

                        {/* 가입 버튼 */}
                        <button type="submit" className={`w-full h-14 mt-2 text-white rounded-xl text-lg font-bold transition-all shadow-sm ${isIdChecked && isTermChecked ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer' : 'bg-indigo-400 cursor-not-allowed'}`}>
                            가입하기
                        </button>

                        <div className="text-center mt-2">
                            <button type="button" className="text-sm text-gray-500 hover:text-indigo-600 hover:underline transition-colors font-medium bg-transparent border-none cursor-pointer" onClick={() => navigate('/login')}>
                                이미 계정이 있으신가요? 로그인
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;