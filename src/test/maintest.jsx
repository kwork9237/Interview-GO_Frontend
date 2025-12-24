import logo from '../logo.svg';

const Main = () => {
    return (
        // 기존 메인페이지 데이터를 다른 곳으로 옮겼습니다.
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                    <p>
                    Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                      Learn React
                </a>
            </header>
        </div>
    );
}

export default Main;