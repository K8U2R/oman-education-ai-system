import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

interface AuthLayoutProps {
  children?: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { t } = useTranslation()
  return (
    <div className="auth-layout">
      <div className="auth-layout__container">{children ? children : <Outlet />}</div>
    </div>
  )
}

export default AuthLayout
