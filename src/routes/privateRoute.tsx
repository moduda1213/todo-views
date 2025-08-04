import type{ ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

// children 프로퍼티를 받도록 타입을 정의
interface PrivateRouteProps{
    children : ReactElement;
}

const PrivateRoute = ({children} : PrivateRouteProps) => {
    const { isAuthenticated, isLoading } = useAuthStore();
    // 1. 인증 상태를 확인하는 중(로딩 중)이면, 로딩 스피너 등을 보여줍니다.
    if (isLoading) {
        return <div>Loading...</div>; // 또는 스켈레톤 UI, 스피너 컴포넌트
    }
    // 2. 로딩이 끝났고, 인증되었다면 자식 컴포넌트를 보여줍니다.
    if (isAuthenticated) {
        return children;
    }
    // 3. 로딩이 끝났지만, 인증되지 않았다면 로그인 페이지로 리디렉션합니다.
    return <Navigate to="/login" replace />;
}

export default PrivateRoute;