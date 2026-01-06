import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // 로컬 스토리지에 저장된 토큰이 있는지 확인
    const token = localStorage.getItem('accessToken');
    const location = useLocation();

    if (!token) {
        console.log("유효하지 않은 토큰으로 접근 시도");

        // 토큰이 없으면 메인 페이지로 강제 이동
        // 현재 가려던 주소(pathname)를 'from'에 저장해서 보냄
        return <Navigate to="/" state={{ from: location.pathname }} replace />;
    }

    // 토큰이 있으면 가려던 페이지를 보여줌
    return children;
};

export default PrivateRoute;