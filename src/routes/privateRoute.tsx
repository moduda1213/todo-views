import type{ ReactElement } from "react";
import { Navigate } from "react-router-dom";

// children 프로퍼티를 받도록 타입을 정의
interface PrivateRouteProps{
    children : ReactElement;
}

const PrivateRoute = ({children} : PrivateRouteProps) => {
    // !! : 기능: 어떤 값을 순수한 `true` 또는 `false` 불리언(boolean) 값으로 변환합니다. 
    // 코드를 명확하게 만들고 싶을 때 아주 유용하게 사용됩니다.
    const isLoggin = !!localStorage.getItem('jwt_token');
    return isLoggin ? children : <Navigate to ="/login"/>
}

export default PrivateRoute;