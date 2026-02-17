import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './components/home/Home'
import Catalog from './components/catalog/Catalog'
import About from './components/about/About'
import Login from './components/login/Login'
import Register from './components/register/Register'
import AddItem from './components/add-item/AddItem'
import Footer from './components/footer/Footer'
import Header from './components/header/Header'
import Logout from './components/logout/Logout'
import ItemDetails from './components/item-details/ItemDetails'
import EditItem from './components/edit-item/EditItem'
import AuthGuard from './components/guards/AuthGuard'
import GuestGuard from './components/guards/GuestGuard'
import PrivacyPolicy from './components/privacy-policy/PrivacyPolicy'
import FinishSignIn from './components/login/finish-signin/FinishSignIn'
import { AppShell, Burger, Group, Stack, rem } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import Navbar from './components/navbar/Navbar'
import { useClickOutside } from '@mantine/hooks';
import { useContext, useEffect, useState } from 'react'
import EditProfile from './components/profile/edit-profile/EditProfile'
import ProfileProducts from './components/profile/profile-products/ProfileProducts'
import ProfileOrders from './components/profile/profile-orders/ProfileOrders'
import classes from './Layout.module.css'
import { useQuery } from 'urql'
import { UserContext } from './contexts/UserContext'

export default function Layout() {
  const { userLogoutHandler, showErrorMsg } = useContext(UserContext);
  const [burgerOpened, { toggle: toggleBurger }] = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 48em)');
  const [navbar, setNavbar] = useState()
  const [headerWithBurger, setHeaderWithBurger]= useState();
  const GetUserStateQuery = `
  query getUserState {
    userState {
        isLogged
      }
    }
  `;
  const [result] = useQuery({
      query: GetUserStateQuery,
    });
  
  const { data, fetching, error } = result;
  useEffect(() => {
    if (data && data.userState && !data.userState.isLogged) {
      userLogoutHandler();
    }
    if (error ) {
      if(error.networkError){
        //unused: handle 401/403 (redirect to login, show message...)
        // error.networkError happens before responce is parced if server unreachable or responce is not json, so we can not rely on error code or message from server, but we can show generic message
        const status = (error.networkError).status || (error.networkError).statusCode;
        showErrorMsg(error.networkError.message);
      }
      if (error.graphQLErrors?.length) {
        showErrorMsg(error.graphQLErrors[0].message);
      }
    }
  }, [data, userLogoutHandler, showErrorMsg, error]);    
  
  //trigger on click outside navbar and header
  const ref = useClickOutside(()=> {
    if(burgerOpened && isMobile){ 
      toggleBurger()
    }
  },['mousedown','touchstart'],[navbar,headerWithBurger]);

    return (
        <AppShell
        classNames={{
          header: classes.root
        }}
        withBorder={false}
        header={{
            height: 120,
        }}
        navbar={{
            width: 250,
            breakpoint: 'sm',
            collapsed: { mobile: !burgerOpened, desktop: !burgerOpened },

        }}>
            <AppShell.Header>
              <div className='h-full' ref={setHeaderWithBurger}>
                <Header
                className=" "
                    isMobile={isMobile}
                    burgerOpened={burgerOpened} 
                    toggleBurger={toggleBurger} 
                />
              </div>
            </AppShell.Header>
            <AppShell.Navbar
            style={{
              width: burgerOpened ? rem(250) : 0, //only width: 0 doesn't hide it fully
              overflow: 'hidden',
            }}
            >
              <Navbar ref={setNavbar} toggleBurger={toggleBurger} />
            </AppShell.Navbar>
            <AppShell.Main  >
              <div className='flex flex-col h-dvh mx-auto max-w-[1200px] px-[1rem] md:px-[3rem]'>
              <Routes>
                    <Route index element={ <Home />} />
                    <Route path="/items" element={ <Catalog />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/items/:itemId/details" element={ <ItemDetails />} />
                    <Route element={ <AuthGuard />}>
                      <Route path="/add-item" element={ <AddItem />} />
                      <Route path="/items/:itemId/edit" element={ <EditItem />} />
                      <Route path="/profile">
                        <Route index element={ <EditProfile />} />
                        <Route path="products" element={ <ProfileProducts />} />
                        <Route path='orders' element={ <ProfileOrders />} />
                      </Route>
                      <Route path="/logout" element={ <Logout /> }  />
                    </Route>
                    <Route element={ <GuestGuard />}>
                      <Route path="/login" element={ <Login />} />
                      <Route path="/register" element={ <Register />} />
                      <Route path="/finish-signin" element={ <FinishSignIn />} />
                    </Route>
                    <Route path="/about" element={ <About />} />
                    <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              <Footer />
              </div> 
            </AppShell.Main> 
            <AppShell.Footer p="0">
            </AppShell.Footer>
          </AppShell>
    );
}