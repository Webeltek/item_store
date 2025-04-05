import { useContext } from 'react';
import './ErrorMsg.css'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';
export default function ErrorMsg({
    errorMsg,
}) {
    const navigate = useNavigate();
    const { userLogoutHandler } = useContext(UserContext);

    function isSessionInvalid(){
        const isInValidSession = errorMsg === "Session expired, please login again!"
        || errorMsg === "Invalid session, please login again!";
        if(isInValidSession){
            return true;
        }
        return false;
    }
    
    const loginHandler = ()=> {
        //call userLogoutHandler from UserProvider to clear authData from state and localStorage to enable GuestGuard to allow navigate to 'login' route
        userLogoutHandler();
        navigate('/login');
    }
    return (
        <>
        { errorMsg && (
            <p className="notification error-message">
                <span>{errorMsg}</span>
                { isSessionInvalid() && 
                <button className="error-msg-btn" onClick={loginHandler}>Login
                    </button>
                }
            </p>
        )}
        </>
    );
}