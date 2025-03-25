import { Navigate } from "react-router";
import { useLogout } from "../../api/authApi";
import Loader from "../shared/Loader";
import './Logout.css'

export default function Logout() {
    const { isLoggedOut } = useLogout();

    return (
        <>
           { isLoggedOut ? 
                <Navigate to="/" />
                : 
                <div className="loader-container">
                    <Loader />
                </div>
            }
        </>
    )
}