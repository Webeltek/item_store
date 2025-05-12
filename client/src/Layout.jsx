import { Route, Routes } from 'react-router-dom'
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
import AuthGuard from './components/guards/AuthGuard'
import GuestGuard from './components/guards/GuestGuard'
import PrivacyPolicy from './components/privacy-policy/PrivacyPolicy'
import FinishSignIn from './components/login/finish-signin/FinishSignIn'
import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import Navbar from './components/navbar/Navbar'
import { useClickOutside } from '@mantine/hooks';
import { useRef, useState } from 'react'

export default function Layout() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const isMobile = useMediaQuery('(max-width: 48em)');
  const [navbar, setNavbar] = useState()
  const [headerWithBurger, setHeaderWithBurger]= useState();
  
  //trigger on click outside navbar and header
  const ref = useClickOutside(()=> {
    if(mobileOpened){ 
      toggleMobile()
    }
  },['mousedown','touchstart'],[navbar,headerWithBurger]);
  const isNavbarExpanded = mobileOpened || desktopOpened; 

    return (
        <AppShell
        withBorder={false}
        header={{
            height: "90"
        }}
        navbar={{
            width: 200,
            breakpoint: 'sm',
            collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },

        }}>
            <AppShell.Header>
              <div className='h-full' ref={setHeaderWithBurger}>
                <Header
                    isMobile={isMobile}
                    isNavbarOpened={isNavbarExpanded} 
                    mobOpened={mobileOpened} 
                    deskOpened={desktopOpened} 
                    toggleMob={toggleMobile} 
                    toggleDesk={toggleDesktop}  
                />
              </div>
            </AppShell.Header>
            <AppShell.Navbar
            style={{
              width: isNavbarExpanded ? 200 : 0, //only width: 0 doesn't hide it fully
              overflow: 'hidden',
            }}
            >
              <Navbar ref={setNavbar} toggleMobile={toggleMobile} />
            </AppShell.Navbar>
            <AppShell.Main>
              <Routes>
                    <Route index element={ <Home />} />
                    <Route path="/items" element={ <Catalog />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/items/:itemId/details" element={ <ItemDetails />} />
                    <Route element={ <AuthGuard />}>
                      <Route path="/add-item" element={ <AddItem />} />
                      <Route path="/items/:itemId/edit" element={ <EditItem />} />
                      <Route path="/profile" element={ <Profile />}  />
                      <Route path="/logout" element={ <Logout /> }  />
                    </Route>
                    <Route element={ <GuestGuard />}>
                      <Route path="/login" element={ <Login />} />
                      <Route path="/register" element={ <Register />} />
                      <Route path="/finish-signin" element={ <FinishSignIn />} />
                    </Route>
                    <Route path="/about" element={ <About />} />
              </Routes>
              <Footer />
            </AppShell.Main>  
            <AppShell.Footer p="0">
            </AppShell.Footer>
          </AppShell>
    );
}