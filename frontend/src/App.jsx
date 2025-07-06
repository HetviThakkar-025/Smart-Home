import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Footer from './components/Fotter'
import Metaverse from './pages/Metaverse'

function App() {

  return (
    <div className="font-sans bg-white text-gray-900">
      <Navbar />
      <div className=" w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/Metaverse' element={<Metaverse/>}></Route>
        </Routes>
      </div>
      <Footer/>
    </div>
  )
}

export default App
