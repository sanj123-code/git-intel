import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Commits from './pages/Commits'
import Graph from './pages/Graph'
import Health from './pages/Health'
import Evolution from './pages/Evolution'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />}      />
        <Route path="/commits"   element={<Commits />}   />
        <Route path="/graph"     element={<Graph />}     />
        <Route path="/health"    element={<Health />}    />
        <Route path="/evolution" element={<Evolution />} />
      </Routes>
    </div>
  )
}

export default App