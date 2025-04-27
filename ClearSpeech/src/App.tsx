import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './utils/firebase'
import Home from './pages/Home'
import AIOnly from './pages/AIOnly'
import HumanOnly from './pages/HumanOnly'
import Teaming from './pages/Teaming'
import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<AIOnly />} />
        <Route path="/human" element={<HumanOnly />} />
        <Route path="/teaming" element={<Teaming />} />
      </Routes>
      
    </>
  )
}

export default App
