import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Header from './layouts/Header'

function App() {
  return (
    <div className="app">
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}
export default App
