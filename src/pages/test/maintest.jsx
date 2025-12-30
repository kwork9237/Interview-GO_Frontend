import React from 'react';
import MainHeader from '../../components/layout/MainHeader';
import Button from '../../components/common/Button';
const Main = () => {
    return (
        <>
            {/* 3. 헤더를 맨 위에 배치 (여백 없이 꽉 차게) */}
            {/* 테스트를 위해 isLoggedIn={true} 또는 {false}로 바꿔보세요 */}
            <MainHeader isLoggedIn={false} /> 

            {/* 기존 내용은 그대로 유지 (여기에 p-10이 있어서 내용물만 안으로 들어감) */}
            <div className="min-h-screen bg-bg-base p-10 flex flex-col gap-10 mt-16"> 
            {/* mt-16 추가: 헤더가 fixed라서 내용이 가려지는 걸 방지하기 위해 헤더 높이만큼 띄움 */}
            {/* 1. 타이틀 영역 */}
            <section>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview-GO 디자인 시스템</h1>
                <p className="text-secondary text-lg">
                    설정된 테마(Colors, Shadows, Fonts)가 잘 적용되는지 확인합니다.
                </p>
            </section>

            {/* 2. 컬러 팔레트 확인 */}
            <section>
                <h2 className="text-2xl font-bold mb-4">🎨 Colors Check</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Primary */}
                    <div className="flex flex-col gap-2">
                        <div className="h-20 w-full rounded-xl bg-primary flex items-center justify-center text-white font-bold shadow-lg">
                            Primary
                        </div>
                        <span className="text-sm text-center text-gray-500">var(--color-primary)</span>
                    </div>
                    
                    {/* Primary Hover (보통 버튼 호버 시) */}
                    <div className="flex flex-col gap-2">
                        <div className="h-20 w-full rounded-xl bg-primary-hover flex items-center justify-center text-white font-bold shadow-lg">
                            Hover
                        </div>
                        <span className="text-sm text-center text-gray-500">var(--color-primary-hover)</span>
                    </div>

                    {/* Danger (로그아웃 등) */}
                    <div className="flex flex-col gap-2">
                        <div className="h-20 w-full rounded-xl bg-danger flex items-center justify-center text-white font-bold shadow-lg">
                            Danger
                        </div>
                        <span className="text-sm text-center text-gray-500">var(--color-danger)</span>
                    </div>

                    {/* Background Base */}
                    <div className="flex flex-col gap-2">
                        <div className="h-20 w-full rounded-xl bg-bg-base border border-gray-300 flex items-center justify-center text-gray-700 font-bold">
                            Base BG
                        </div>
                        <span className="text-sm text-center text-gray-500">var(--color-bg-base)</span>
                    </div>
                </div>
            </section>

            {/* 3. 그림자 & 카드 스타일 확인 */}
            <section>
                <h2 className="text-2xl font-bold mb-4">📦 Shadows & Radius</h2>
                <div className="flex flex-wrap gap-8">
                    {/* 일반 카드 */}
                    <div className="w-64 h-40 bg-surface rounded-xl shadow-card flex flex-col items-center justify-center border border-gray-100 p-4 text-center">
                        <span className="font-bold text-gray-800">기본 카드</span>
                        <span className="text-sm text-gray-500 mt-2">shadow-card<br/>rounded-xl</span>
                    </div>

                    {/* 붕 떠있는 카드 (강조) */}
                    <div className="w-64 h-40 bg-surface rounded-xl shadow-floating flex flex-col items-center justify-center border border-primary/20 p-4 text-center">
                        <span className="font-bold text-primary">강조 카드</span>
                        <span className="text-sm text-gray-500 mt-2">shadow-floating<br/>border-primary/20</span>
                    </div>
                </div>
            </section>

            {/* 4. 버튼 컴포넌트 미리보기 */}
            <section>
                <h2 className="text-2xl font-bold mb-4">🔘 Buttons Check</h2>
                <div className="flex gap-4 items-center">
                    
                    {/* 1. 기본 버튼 */}
                    <Button onClick={() => alert("면접 시작!")}>
                        면접 시작하기
                    </Button>
                    
                    {/* 2. 아웃라인 버튼 */}
                    <Button variant="outline">
                        취소
                    </Button>

                    {/* 3. 위험 버튼 */}
                    <Button variant="danger">
                        로그아웃
                    </Button>

                    {/* 4. 비활성 버튼 (테스트용) */}
                    <Button disabled>
                        입력 전
                    </Button>
                    
                    {/* 5. 작은 버튼 (테스트용) */}
                    <Button variant="ghost" size="small">
                        자세히 보기
                    </Button>
                </div>
            </section>
        </div>
    </>
    );
}

export default Main;