// 면접 페이지 구조 선언입니다.
// <Header/>은 페이지 헤드 부분 (로고, 다른 페이지 이동, 마이페이지, 로그아웃 등) 을 출력합니다.
// main의 Outlet는 각자 만든 페이지를 출력하는 (html의 body 부분입니다.)
// 푸터 (footer) 이 필요할 경우 </main> 밑에 넣으시면 됩니다.

import { Outlet } from "react-router-dom";
import Header from './InterviewHeader';

const Layout = () => {
    return(
        <>
            <Header/>
            <main>
                {/* Outlet 부분에 각 페이지 내용이 출력됨
                    
                    만약 App.js에서 <Route path="/" element={<TestMain/>} /> 이렇게 선언되면
                    Header 출력 > Outlet 자리에 TestMain 페이지 데이터가 출력된다.
                 */}
                <Outlet/> 
            </main>
        </>
    );
}

export default Layout;