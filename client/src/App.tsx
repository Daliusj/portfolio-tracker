import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Header from './layouts/Header'
import { useThemeMode } from 'flowbite-react'
import { AuthProvider } from './context/AuthContext'

function App() {
  const { themeMode } = useThemeMode()
  return (
    <div className={`${themeMode === 'dark' ? 'dark' : ''} app`}>
      <AuthProvider>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </AuthProvider>
    </div>
  )
}
export default App
