import React from 'react'
import { Routes, Route, redirect } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header/Header'
import { useThemeMode } from 'flowbite-react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc, trpcClient } from './trpc'
import { AuthProvider } from './context/AuthContext'

function App() {
  const { mode } = useThemeMode()
  const queryClient = new QueryClient()

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className={`${mode === 'dark' ? 'dark' : ''} app`}>
            <Header></Header>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}
export default App
