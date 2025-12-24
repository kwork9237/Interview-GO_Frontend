import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './global/MainLayout';
import InterviewLayout from './global/InterviewLayout';

// 메인 페이지
import Main from './global/MainPage';

// 로그인 및 회원가입
import Login from './member/LoginPage';
import Signup from './member/SignupPage';
import MyPage from './member/MyPage';

// 취업 동향
import NewsPage from './add-ons/NewsPage';

// 면접 (헤드 사용)
import InterviewSetting from './interview/InterviewSettingPage';
import InterviewFeedback from './interview/InterviewFeedbackPage';

// 면접 (면접 전용 헤드 사용)
import TextInterview from './interview/TextInterviewPage';
import VoiceInterview from './interview/VoiceInterviewPage';

// 코딩 테스트
import CodingTestMain from './codingTest/CodingTestPage';
import CodingTestResult from './codingTest/CodingTestResultPage';

// 테스트용 페이지
import TestMain from './test/maintest'; 


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 페이지 (임시)*/}
        <Route path='/' element={Main}/>

        {/* 로그인 및 회원가입 */}
        <Route path='/login' element={Login}/>
        <Route path='/signup' element={Signup}/>
        <Route path='/mypage' element={MyPage}/>
        
        {/* 헤드를 사용하는 페이지 */}
        <Route element={<MainLayout/>}>
          {/* 뉴스 */}
          <Route path='/news' element={NewsPage}/>

          {/* 코딩 테스트 */}
          <Route path='/codingtest/main' element={CodingTestMain}/>
          <Route path='/codingtest/result' element={CodingTestResult}/>

          {/* 면접 */}
          <Route path='/interview/setting' element={InterviewSetting}/>
          <Route path='/interview/feedback' element={InterviewFeedback}/>
        </Route>

        {/* 면접 전용 헤드 사용 */}
        <Route element={<InterviewLayout/>}>
          <Route path='/interview/chat' element={TextInterview}/>
          <Route path='/interview/voice' element={VoiceInterview}/>
        </Route>


        {/* 아래처럼 지정하면 처음 Layout 출력 > Route 된 경로 안의 페이지 데이터 출력된다.
            element를 지정하지 않을 경우는 그냥 Route Path만 지정하면 된다.
         */}
        <Route element={<MainLayout/>}>
          <Route path='/test1' element={<TestMain/>} />
        </Route>
        <Route path='/test2' element={<TestMain/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
