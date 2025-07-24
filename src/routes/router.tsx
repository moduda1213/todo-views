import { createBrowserRouter, RouterProvider } from 'react-router'
import DefaultLayout from './layouts/default'
import Home from './page/home'
import About from './page/login'
import PrivateRoute from './privateRoute'

const router = createBrowserRouter([
  {
    path:'/',
    element : <DefaultLayout />,
    children : [
      {
        index : true, /** 부모경로의 기본 경로*/
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        )
        
      },
      {
        path: '/login',
        element: <About />
      }
    ]
  }
])

// <RouterProvider> 컴포넌트는 router 속성으로 라우터 객체를 전달받아, 프로젝트의 라우팅을 처리하고 화면에 렌더링합니다.
export default function Router() {
  return <RouterProvider router={router} />
}