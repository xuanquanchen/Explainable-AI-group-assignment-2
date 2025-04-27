import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AIOnly from './pages/AIOnly'
import HumanOnly from './pages/HumanOnly'
import Teaming from './pages/Teaming'

export function Router() {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<AIOnly />} />
        <Route path="/human" element={<HumanOnly />} />
        <Route path="/hybrid" element={<Teaming />} />
      </Routes>
    )
  }