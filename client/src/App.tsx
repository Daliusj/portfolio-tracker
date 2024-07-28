import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header'
import { useThemeMode } from 'flowbite-react'
import { AuthProvider } from './context/AuthContext'
import { Login } from './pages/Login'

function App() {
  const { mode } = useThemeMode()
  return (
    <div className={`${mode === 'dark' ? 'dark' : ''} app`}>
      <AuthProvider>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </div>
  )
}
export default App
