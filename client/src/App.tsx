import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import { useThemeMode } from 'flowbite-react'
import { AuthProvider } from './context/AuthContext'
import PrivateRouteGuard from './routes/PrivateRouteGuard'
import AuthPage from './pages/AuthPage'
import Home from './pages/Home'
import CreatePortfolio from './components/CreatePortfolio'
import MessageBar from './components/MessageBar'
import { MessageProvider } from './context/MessageContext'
import AppProvider from './context/TrpcClientContext'

function App() {
  const { mode } = useThemeMode()

  return (
    <MessageProvider>
      <AppProvider>
        <AuthProvider>
          <div className={`${mode === 'dark' ? 'dark' : ''} app `}>
            <Header></Header>
            <div className="mb-10 flex w-full justify-center">
              <MessageBar />
            </div>
            <div className="h-fit">
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
      </AppProvider>
    </MessageProvider>
  )
}
export default App
