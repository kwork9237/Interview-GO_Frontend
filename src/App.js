import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import InterviewLayout from './components/layout/InterviewLayout';

// 메인 페이지
import Main from './pages/MainPage';

// 로그인 및 회원가입
import Login from './pages/member/LoginPage';
import Signup from './pages/member/SignupPage';
import MyPage from './pages/member/MyPage';


// 취업 동향
import NewsPage from './pages/add-ons/NewsPage';

// 면접 (헤드 사용)
import InterviewSetting from './pages/interview/InterviewSettingPage';
import InterviewFeedback from './pages/interview/InterviewFeedbackPage';

// 면접 (면접 전용 헤드 사용)
import TextInterview from './pages/interview/TextInterviewPage';
import VoiceInterview from './pages/interview/VoiceInterviewPage';

// 코딩 테스트
import CodingTestMain from './pages/codingTest/CodingTestPage';
import CodingTestResult from './pages/codingTest/CodingTestResultPage';

// 테스트용 페이지
import DesignGuidePage from './pages/test/DesignGuidePage';
import PreviewInterview from './pages/test/PreviewInterviewPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 로그인 및 회원가입 */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        {/* 헤드를 사용하는 페이지 */}
        <Route element={<MainLayout />}>

          {/* 메인 페이지 (임시)*/}
          <Route path='/' element={<Main />} />

          {/*마이 페이지 */}
          <Route path='/mypage' element={<MyPage />} />

          {/* 뉴스 */}
          <Route path='/news' element={<NewsPage />} />

          {/* 코딩 테스트 */}
          <Route path='/codingtest/main' element={<CodingTestMain />} />
          <Route path='/codingtest/result' element={<CodingTestResult />} />

          {/* 면접 */}
          <Route path='/interview/setting' element={<InterviewSetting />} />
          <Route path='/interview/feedback' element={<InterviewFeedback />} />
        </Route>

        {/* 면접 전용 헤드 사용 */}
        <Route element={<InterviewLayout />}>
          <Route path='/interview/chat' element={<TextInterview />} />
          <Route path='/interview/voice' element={<VoiceInterview />} />
        </Route>

        {/* 테스트용 페이지 */}
        <Route path="/design" element={<DesignGuidePage />} />
        <Route path="/test-sidebar" element={<PreviewInterview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;