
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/home/Home'
import Catalog from './components/catalog/Catalog'
import About from './components/about/About'
import Login from './components/login/Login'
import Register from './components/register/Register'
import { useState } from 'react'
import AddItem from './components/add-item/AddItem'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const loginHandler = (user) => {
    if(!user){
      return;
    }

    setIsAuthenticated(user);
  }
  return (
    <Routes>
      <Route path='/' element={ <Layout isAuth={isAuthenticated} className='app' />}>
          <Route index element={ <Home />} />
          <Route path="/items" element={ <Catalog />} />
          <Route path="/about" element={ <About />} />
          <Route path="/login" element={ <Login onLogin={loginHandler}/>} />
          <Route path="/register" element={ <Register />} />
          <Route path="/add-item" element={ <AddItem />} />
          <Route path="/catalog" element={ <Catalog />}  />
      </Route>
    </Routes>
  )
}

export default App
