import React from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Posture from './pages/Posture'
import Result from './pages/Result'
import Tutorial from './pages/Tutorial'
import Community from './pages/Community'
import CreatePost from './pages/CreatePost'
import Buddy from './pages/Buddy'
import Profile from './pages/Profile' // 导入终章真实页面组件
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import './styles/layout.css'

const AppMainLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
      <Navbar />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppMainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/posture', element: <Posture /> },
      { path: '/posture/result/:id', element: <Result /> },
      { path: '/tutorial', element: <Tutorial /> },
      { path: '/community', element: <Community /> },
      { path: '/community/create', element: <CreatePost /> },
      { path: '/buddy', element: '/buddy' && <Buddy /> },
      { path: '/profile', element: <Profile /> }, // 核心路由终极大闭环
    ]
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
])