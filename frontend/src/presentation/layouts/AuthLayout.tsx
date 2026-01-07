import React from 'react'
import { Outlet } from 'react-router-dom'
import './AuthLayout.scss'

interface AuthLayoutProps {
  children?: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-layout__container">{children ? children : <Outlet />}</div>
    </div>
  )
}

export default AuthLayout
