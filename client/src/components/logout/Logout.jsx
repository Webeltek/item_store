import { Navigate } from "react-router";
import { useLogout } from "../../api/authApi";
import Loader from "../shared/Loader";
import './Logout.css'

export default function Logout() {
    const { isLoggedIn } = useLogout();
    

    return (
        <div className="loader-container">
        {
            isLoggedIn 
           ? <Loader />
           : <Navigate to="/" />
        }
        </div>
    )
}