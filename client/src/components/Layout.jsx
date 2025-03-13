import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import '../App.css'


export default function Layout({
  isAuth
}) {
    return (
    <>
      <Header isAuthenticated={isAuth} />
      <Outlet />
      <Footer />
    </>
    );
}