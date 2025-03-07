import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Catalog from './components/Catalog.jsx'
import About from './components/About.jsx'
import Login from './components/Login/Login.jsx'
import Register from './components/Register/Register.jsx'
import Home from './components/Home.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <App className='app' />}>
            <Route path='home' element={ <Home />} />
            <Route index element={ <Home />} />
            <Route path='items' element={ <Catalog />} />
            <Route path='about' element={ <About />} />
            <Route path='login' element={ <Login />} />
            <Route path='register' element={ <Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
)
