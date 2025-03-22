
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/home/Home'
import Catalog from './components/catalog/Catalog'
import About from './components/about/About'
import Login from './components/login/Login'
import Register from './components/register/Register'
import { useState } from 'react'
import AddItem from './components/add-item/AddItem'
import Profile from './components/profile/Profile'
import Footer from './components/footer/Footer'
import Header from './components/header/Header'
import { UserContext } from './contexts/UserContext'
import Logout from './components/logout/Logout'
import ItemDetails from './components/item-details/ItemDetails'

function App() {
  const [authData, setAuthData] = useState({});

  const userLoginHandler = (resultData) => {
    setAuthData(resultData);
  }

  const userLogoutHandler = () =>{
    setAuthData({})
  }

  return (
    <UserContext.Provider value={ {...authData, userLoginHandler, userLogoutHandler} }>

    
    <Header  />
    <Routes>
      
          <Route index element={ <Home />} />
          <Route path="/items" element={ <Catalog />} />
          <Route path="/items/:itemId/details" element={ <ItemDetails />} />
          <Route path="/about" element={ <About />} />
          <Route path="/login" element={ <Login />} />
          <Route path="/logout" element={ <Logout /> }  />
          <Route path="/register" element={ <Register />} />
          <Route path="/add-item" element={ <AddItem />} />
          <Route path="/catalog" element={ <Catalog />}  />
          <Route path="/profile" element={ <Profile />}  />
    </Routes>

    <Footer />
    </UserContext.Provider>
  )
}

export default App
