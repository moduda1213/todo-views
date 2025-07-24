import { Outlet, ScrollRestoration  } from 'react-router'
import Header from '@/components/header'

export default function DefaultLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <ScrollRestoration />{/* 사용자가 뒤로 혹은 앞으로 가기를 할 때 페이지의 스크롤 위치를 복원하거나, 새로운 페이지의 스크롤 위치를 최상단으로 이동시킵니다. */}
    </>
  )
}