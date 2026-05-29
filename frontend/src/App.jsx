import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import ScanProvider from './context/ScanContext'

function App() {
  return (
    <ScanProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard/:sessionId" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ScanProvider>
  )
}

export default App