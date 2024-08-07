// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react'
import { trpc } from '../trpc'
import {
  clearStoredAccessToken,
  getStoredAccessToken,
  getUserIdFromToken,
  storeAccessToken,
} from '../utils/auth'
import { useNavigate } from 'react-router-dom'

type AuthContextType = {
  authUserId: number | null
  isLoggedIn: boolean
  login: (userLogin: { email: string; password: string }) => Promise<void>
  logout: () => void
  signup: (userSignup: { email: string; userName: string; password: string }) => Promise<void>
}

type AuthProviderProps = {
  children: ReactNode
}

const defaultAuthContext: AuthContextType = {
  authUserId: null,
  isLoggedIn: false,
  login: () => {
    throw new Error('login function not initialized')
  },
  logout: () => {
    throw new Error('logout function not initialized')
  },
  signup: () => {
    throw new Error('signup function not initialized')
  },
}

const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authToken, setAuthToken] = useState(getStoredAccessToken(localStorage))

  useEffect(() => {
    if (authToken) {
      storeAccessToken(localStorage, authToken)
    } else {
      clearStoredAccessToken(localStorage)
    }
  }, [authToken])

  const loginMutation = trpc.user.login.useMutation()

  const navigate = useNavigate()

  const login = async (userLogin: { email: string; password: string }) => {
    loginMutation.mutate(userLogin, {
      onSuccess: (data) => {
        const { accessToken } = data
        setAuthToken(accessToken)
        navigate('/')
      },
      onError: (error) => {
        console.error('Login failed', error)
      },
    })
  }

  const logout = () => {
    setAuthToken(null)
  }

  const signupMutation = trpc.user.signup.useMutation()

  const signup = async (userSignup: { email: string; userName: string; password: string }) => {
    signupMutation.mutate(userSignup, {
      onSuccess: () => {
        navigate('/login')
      },
      onError: (error) => {
        console.error('Signup failed', error)
      },
    })
  }

  const authUserId = authToken ? getUserIdFromToken(authToken) : null
  const isLoggedIn = !!authToken

  return (
    <AuthContext.Provider value={{ authUserId, isLoggedIn, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
