import { useAuth } from '@/context/AuthContext'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function () {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />
}
