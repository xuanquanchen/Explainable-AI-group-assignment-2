// src/pages/Home.tsx
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Experiment Selection</h1>
      <nav style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        <Link to="/ai"><button>AI Only</button></Link>
        <Link to="/human"><button>Human Only</button></Link>
        <Link to="/hybrid"><button>Human + AI</button></Link>
      </nav>
    </div>
  )
}