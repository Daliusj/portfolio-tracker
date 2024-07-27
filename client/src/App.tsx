import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Header from './layouts/Header'
import { useThemeMode } from 'flowbite-react'

function App() {
  const { themeMode } = useThemeMode()
  return (
    <div className={`${themeMode === 'dark' ? 'dark' : ''} app`}>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}
export default App
