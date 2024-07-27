// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react'
import { trpc } from '../trpc'
import {
  clearStoredAccessToken,
  getStoredAccessToken,
  getUserIdFromToken,
  storeAccessToken,
} from '../utils/auth'

type AuthContextType = {
  authUserId: number | null
  isLoggedIn: boolean
  login: (userLogin: { email: string; password: string }) => Promise<void>
  logout: () => void
  signup: (userSignup: {
    email: string
    userName: string
    password: string
  }) => Promise<{ id: number }>
}

type AuthProviderProps = {
  children: ReactNode
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authToken, setAuthToken] = useState(getStoredAccessToken(localStorage))

  useEffect(() => {
    if (authToken) {
      storeAccessToken(localStorage, authToken)
    } else {
      clearStoredAccessToken(localStorage)
    }
  }, [authToken])

  const login = async (userLogin: { email: string; password: string }) => {
    const { accessToken } = await trpc.user.login.mutate(userLogin)
    setAuthToken(accessToken)
  }

  const logout = () => {
    setAuthToken(null)
  }

  const signup = async (userSignup: { email: string; userName: string; password: string }) => {
    return await trpc.user.signup.mutate(userSignup)
  }

  const authUserId = authToken ? getUserIdFromToken(authToken) : null
  const isLoggedIn = !!authToken

  return (
    <AuthContext.Provider value={{ authUserId, isLoggedIn, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext)
}