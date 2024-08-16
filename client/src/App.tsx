import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import { useThemeMode } from 'flowbite-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc, trpcClient } from './trpc'
import { AuthProvider } from './context/AuthContext'
import PrivateRouteGuard from './routes/PrivateRouteGuard'
import AuthPage from './pages/AuthPage'
import Home from './pages/Home'
import CreatePortfolio from './components/CreatePortfolio'

function App() {
  const { mode } = useThemeMode()
  const queryClient = new QueryClient()

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className={`${mode === 'dark' ? 'dark' : ''} app `}>
            <Header></Header>
            <div className="h-5/6">
              <Routes>
                <Route element={<PrivateRouteGuard />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/create-portfolio" element={<CreatePortfolio />} />
                </Route>
                <Route path="/login" element={<AuthPage mode="login" />} />
                <Route path="/signup" element={<AuthPage mode="signup" />} />
              </Routes>
            </div>
          </div>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}
export default App
