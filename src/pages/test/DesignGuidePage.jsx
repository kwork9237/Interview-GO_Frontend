import React, { useState } from 'react';
// 컴포넌트들 가져오기
import MainHeader from '../../components/layout/MainHeader';
import Footer from '../../components/layout/Footer';
import InterviewHeader from '../../components/layout/InterviewHeader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

const DesignGuidePage = () => {
  // 독립적인 모달 테스트를 위한 상태
  const [showTestModal, setShowTestModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 pb-40">

      {/* 타이틀 영역 */}
      <div className="p-10 bg-white shadow-sm mb-10 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">🎨 UI 디자인 상황실</h1>
        <p className="text-gray-500 mt-2">
          프로젝트의 모든 컴포넌트, 색상, 동작을 이곳에서 테스트합니다.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-20">

        {/* -------------------------------------------------------------
            1. 컬러 팔레트 (새로 추가됨) 
           ------------------------------------------------------------- */}
        <section>
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-primary pl-3 flex items-center gap-2">
            1. 컬러 팔레트 <span className="text-sm font-normal text-gray-500">(tailwind.config.js 설정)</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Primary */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="h-24 bg-primary rounded-lg mb-3 shadow-lg flex items-center justify-center text-white font-bold">Primary</div>
              <p className="font-bold text-gray-800">Indigo 600</p>
              <p className="text-xs text-gray-500">var(--color-primary)</p>
            </div>

            {/* Primary Hover */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="h-24 bg-primary-hover rounded-lg mb-3 shadow-lg flex items-center justify-center text-white font-bold">Hover</div>
              <p className="font-bold text-gray-800">Indigo 700</p>
              <p className="text-xs text-gray-500">var(--color-primary-hover)</p>
            </div>

            {/* Danger */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="h-24 bg-danger rounded-lg mb-3 shadow-lg flex items-center justify-center text-white font-bold">Danger</div>
              <p className="font-bold text-gray-800">Rose 500</p>
              <p className="text-xs text-gray-500">var(--color-danger)</p>
            </div>

            {/* Surface & Text */}
            <div className="bg-bg-base p-4 rounded-xl shadow-inner border border-gray-200">
              <div className="h-24 bg-surface rounded-lg mb-3 shadow-sm flex items-center justify-center text-gray-800 font-bold border">Surface</div>
              <p className="font-bold text-gray-800">White / Slate 50</p>
              <p className="text-xs text-gray-500">배경 및 카드 색상</p>
            </div>
          </div>
        </section>


        {/* -------------------------------------------------------------
            2. 헤더 디자인 (면접 헤더 추가됨)
           ------------------------------------------------------------- */}
        <section>
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-primary pl-3">2. 헤더 (Header)</h2>
          <div className="space-y-10">

            {/* A. 메인 - 비회원 */}
            <div>
              <p className="mb-2 font-semibold text-gray-600">A. 메인 헤더 (비회원)</p>
              {/* 부모 박스: relative (기준점) */}
              <div className="relative h-20 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white">
                {/* ✨ 자식 헤더: absolute (박스 안에 갇힘) */}
                <MainHeader isLoggedIn={false} className="absolute" />
              </div>
            </div>

            {/* B. 메인 - 회원 */}
            <div>
              <p className="mb-2 font-semibold text-gray-600">B. 메인 헤더 (로그인 완료)</p>
              <div className="relative h-20 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white">
                {/* ✨ 자식 헤더: absolute */}
                <MainHeader isLoggedIn={true} className="absolute" />
              </div>
            </div>

            {/* C. 면접 헤더 */}
            <div>
              <p className="mb-2 font-semibold text-gray-600 flex items-center gap-2">
                C. 면접 헤더 <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">New</span>
              </p>
              <div className="relative h-20 border-2 border-dashed border-red-200 rounded-lg overflow-hidden bg-white">
                {/* ✨ 자식 헤더: absolute */}
                <InterviewHeader className="absolute" />
              </div>
            </div>

          </div>
        </section>


        {/* -------------------------------------------------------------
            3. 버튼 디자인
           ------------------------------------------------------------- */}
        <section>
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-primary pl-3">3. 버튼 (Buttons)</h2>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 grid gap-8">

            {/* 크기별 */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <span className="w-24 text-gray-400 font-bold uppercase text-sm">Size</span>
              <div className="flex items-center gap-4">
                <Button size="small">Small</Button>
                <Button size="medium">Medium</Button>
                <Button size="large">Large</Button>
              </div>
            </div>
            <div className="border-b border-gray-100"></div>

            {/* 종류별 */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <span className="w-24 text-gray-400 font-bold uppercase text-sm">Variant</span>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
            <div className="border-b border-gray-100"></div>

            {/* 상태별 */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <span className="w-24 text-gray-400 font-bold uppercase text-sm">Disabled</span>
              <div className="flex items-center gap-4">
                <Button disabled>기본 비활성</Button>
                <Button variant="danger" disabled>위험 비활성</Button>
                <Button variant="outline" disabled>외곽선 비활성</Button>
              </div>
            </div>

          </div>

        </section>
        {/* -------------------------------------------------------------
            4. 배지
           ------------------------------------------------------------- */}
        <section>
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-primary pl-3">4. 배지 (Badges)</h2>
          <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-xl border border-gray-100">

            {/* 면접 상태 예시 */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-gray-400 font-mono">면접 상태</p>
              <div className="flex gap-2">
                <Badge variant="primary">면접 진행 중</Badge>
                <Badge variant="success">면접 완료</Badge>
                <Badge variant="warning">대기 중</Badge>
              </div>
            </div>

            {/* 면접 상태 예시 */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-gray-400 font-mono">문제 상태</p>
              <div className="flex gap-2">
                <Badge variant="success">Solved</Badge>
                <Badge variant="gray">Unsolved</Badge>
              </div>
            </div>

            {/* 기타 상태 예시 */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-gray-400 font-mono">Others</p>
              <Badge variant="gray">미응시</Badge>
            </div>

          </div>
        </section>
        {/* -------------------------------------------------------------
            5. 카드
           ------------------------------------------------------------- */}
        <section>
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-primary pl-3">5. 카드 (Cards)</h2>

          <div className="space-y-10">
            {/* A. Large 사이즈 - 메인 하단용 (2열 배치) */}
            <div>
              <p className="mb-4 font-semibold text-gray-600 underline decoration-primary decoration-2 underline-offset-4">
                A. Large Size (메인 하단 2열 구성 예시)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="유튜브 API 카드" subtitle="size='large'" size="large">
                  <div className="aspect-video bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                    <span className="text-gray-400">YouTube Player Area</span>
                  </div>
                  <p className="text-gray-600 text-sm">Large 카드는 메인 페이지 하단에서 큼직하게 컨텐츠를 강조할 때 사용합니다.</p>
                </Card>

                <Card title="뉴스 API 카드" subtitle="size='large'" size="large">
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="border-b pb-2 last:border-0">
                        <h4 className="font-bold text-sm">실시간 취업 뉴스 제목 {i}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">뉴스의 요약 내용이 이곳에 표시됩니다.</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button variant="outline" size="small">더보기</Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* B. Medium & Small 사이즈 - 뉴스 페이지용 (3열 배치) */}
            <div>
              <p className="mb-4 font-semibold text-gray-600 underline decoration-primary decoration-2 underline-offset-4">
                B. Medium & Small Size (뉴스 리스트용 3열 구성 예시)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Medium 카드" subtitle="기본 사이즈" size="medium">
                  <p className="text-sm text-gray-600 text-sm">뉴스 페이지 리스트에서 가장 많이 쓰이는 표준 사이즈입니다.</p>
                </Card>

                <Card title="Small 카드" subtitle="size='small'" size="small">
                  <p className="text-sm text-gray-600">작은 정보를 밀도있게 보여줄 때 적합합니다.</p>
                </Card>

                <Card title="Interaction" size="medium" className="bg-primary/5 border-primary/20">
                  <p className="text-sm text-primary font-medium">배경색을 직접 커스텀한 카드 예시입니다.</p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------
            6. 스피너
           ------------------------------------------------------------- */}
        <section>
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-primary pl-3">로딩 스피너 (Spinners)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-xl border border-gray-100">

            {/* 기본형 */}
            <div className="flex flex-col items-center">
              <p className="text-xs text-gray-400 mb-4">Default (Medium)</p>
              <Spinner />
            </div>

            {/* 텍스트 결합형 */}
            <div className="flex flex-col items-center">
              <p className="text-xs text-gray-400 mb-4">With Text (Large)</p>
              <Spinner size="large" text="잠시만 기다려주세요" />
            </div>

            {/* 어두운 배경용 (Primary 배경 위) */}
            <div className="flex flex-col items-center bg-primary rounded-xl p-4">
              <p className="text-xs text-white/60 mb-4">white (small)</p>
              <Spinner color="white" size="small" />
            </div>

          </div>
        </section>
        {/* -------------------------------------------------------------
            7. 모달
           ------------------------------------------------------------- */}
        <section>
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-primary pl-3">7. 모달 (Modal)</h2>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-4">
              버튼을 클릭하여 공통 모달 컴포넌트가 어떻게 뜨는지 확인하세요.
            </p>

            <Button onClick={() => setShowTestModal(true)}>
              모달 띄우기 테스트 🔔
            </Button>
          </div>

          {/* 테스트용 모달 컴포넌트 */}
          <Modal
            isOpen={showTestModal}
            onClose={() => setShowTestModal(false)}
            onConfirm={() => {
              alert("확인 버튼이 클릭되었습니다!");
              setShowTestModal(false);
            }}
            title="테스트 모달입니다"
            confirmText="좋아요"
            cancelText="닫기"
          >
            [Image of modal design]
            이곳에는 어떤 내용이든 들어갈 수 있습니다.<br />
            <span className="text-primary font-bold">HTML 태그</span>나 다른 컴포넌트도 포함 가능합니다.
          </Modal>
        </section>

        {/* -------------------------------------------------------------
            8. 푸터 디자인 (Footer)
           ------------------------------------------------------------- */}
        <section>
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-primary pl-3">8. 푸터 (Footer)</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            <Footer />
          </div>
          <p className="text-sm text-gray-400 mt-2 text-center">※ 실제 페이지 하단에 고정되어 나타납니다.</p>
        </section>

      </div>
    </div>
  );
};

export default DesignGuidePage;