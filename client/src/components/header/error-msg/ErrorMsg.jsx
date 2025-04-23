import { useCallback, useContext, useEffect } from 'react';
import './ErrorMsg.css'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';
import { toast, ToastContainer, Zoom} from 'react-toastify';

export default function ErrorMsg() {
    const navigate = useNavigate();
    const { userLogoutHandler, errorMessage, showErrorMsg } = useContext(UserContext);

    const isSessionInvalid = useCallback( ()=>{
        const isInValidSession = errorMessage === "Session expired, please login again!"
        || errorMessage === "Invalid session, please login again!";
        if(isInValidSession){
            return true;
        }
        return false;
    },[ errorMessage] )
    
    const loginHandler = useCallback( ()=> {
        //call userLogoutHandler from UserProvider to clear authData from state and localStorage to enable GuestGuard to allow navigate to 'login' route
        userLogoutHandler();
        navigate('/login');
    } ,[navigate, userLogoutHandler])

    useEffect(()=>{
        if( errorMessage){
            toast( (toastProps)=> {
                return (
                    <ErrorContent 
                        errorMsg={errorMessage} 
                        sessionInValid={isSessionInvalid()} 
                        handler={loginHandler}
                    />
                )
            },{
                autoClose: false,
                transition: Zoom,
                position: 'bottom-right',
                type: 'warning'
            });
            //reset errorMessage after showing
            showErrorMsg('');
        }
    },[errorMessage, isSessionInvalid, loginHandler, showErrorMsg])
    
    return (
        <ToastContainer />
    );
}

function ErrorContent({
    errorMsg,
    sessionInValid,
    handler
}) {

    return (
        
    <p className="">
        <span>{errorMsg}</span>
        { sessionInValid && 
        <button className="error-msg-btn" onClick={handler}>Login
        </button>
        }
    </p>
    )
}