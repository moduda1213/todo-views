import { useEffect } from 'react'
import { Outlet, ScrollRestoration  } from 'react-router'
import { useAuthStore } from "@/stores/authStore"
import apiAxios from '@/lib/apiAxios'

import Header from '@/components/header'


/**
 *  왜 DefaultLayout이 토큰 인증 요청을 하기 가장 좋은 위치인가?

  DefaultLayout은 사용자가 로그인 후 마주하는 대부분의 페이지를 감싸는 "껍데기" 역할을 합니다. 여기에 인증
  로직을 두면 다음과 같은 장점이 있습니다.

   1. 한 번만 실행 (효율성): 사용자가 웹사이트에 처음 접속하거나 새로고침했을 때, DefaultLayout이 렌더링되면서
      단 한 번만 /me API를 호출합니다. 여기서 얻은 사용자 정보는 전역 상태(Global State)에 저장해두고, 다른
      모든 컴포넌트는 이 정보를 재사용하면 됩니다.
   2. 중앙 관리 (유지보수성): 인증 확인 로직이 한곳에 모여있어 코드를 관리하기 편합니다.
   3. 전역 상태 설정: /me 호출 결과를 Header나 다른 자식 컴포넌트(Outlet을 통해 렌더링되는 페이지들)에 쉽게
      전달하거나, Zustand/Redux 같은 전역 상태 관리 라이브러리에 저장할 수 있습니다.
 */
export default function DefaultLayout() {
  const { setUser, setLoading } = useAuthStore();
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 앱 로드 시 /me를 호출하여 사용자 인증 상태를 확인
        const response = await apiAxios.get('/auth/me');
        // 성공하면, 응답으로 받은 사용자 정보를 전역 상태에 저장
        setUser(response.data);
      } catch (error) {
        // 실패하면 (401 등), 로그아웃 처리
        console.error("Authentication check failed:", error);
        setUser(null)
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };
  
    checkAuthStatus();
  }, [setUser, setLoading]); // 의존성 배열 수정
  return (
    <>
      <Header />
      <Outlet />
      <ScrollRestoration />{/* 사용자가 뒤로 혹은 앞으로 가기를 할 때 페이지의 스크롤 위치를 복원하거나, 새로운 페이지의 스크롤 위치를 최상단으로 이동시킵니다. */}
    </>
  )
}