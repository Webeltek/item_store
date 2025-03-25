
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/home/Home'
import Catalog from './components/catalog/Catalog'
import About from './components/about/About'
import Login from './components/login/Login'
import Register from './components/register/Register'
import AddItem from './components/add-item/AddItem'
import Profile from './components/profile/Profile'
import Footer from './components/footer/Footer'
import Header from './components/header/Header'
import Logout from './components/logout/Logout'
import ItemDetails from './components/item-details/ItemDetails'
import EditItem from './components/edit-item/EditItem'
import UserProvider from './providers/UserProvider'
import AuthGuard from './components/guards/AuthGuard'

function App() {
  

  return (
    <UserProvider>
    
      <Header  />
      <Routes>
        
            <Route index element={ <Home />} />
            <Route path="/items" element={ <Catalog />} />
            <Route path="/items/:itemId/details" element={ <ItemDetails />} />
            <Route element={ <AuthGuard />}>
              <Route path="/items/:itemId/edit" element={ <EditItem />} />
              <Route path="/logout" element={ <Logout /> }  />
              <Route path="/add-item" element={ <AddItem />} />
              <Route path="/profile" element={ <Profile />}  />
            </Route>
            <Route path="/about" element={ <About />} />
            <Route path="/login" element={ <Login />} />
            <Route path="/register" element={ <Register />} />
            <Route path="/catalog" element={ <Catalog />}  />
      </Routes>

      <Footer />
    </UserProvider>
  )
}

export default App
