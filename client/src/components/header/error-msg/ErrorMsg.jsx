import { useCallback, useContext, useEffect, useRef } from 'react';
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
    
    const loginHandler = useCallback( async ()=> {
        //call userLogoutHandler from UserProvider to clear authData from state and localStorage to enable GuestGuard to allow navigate to 'login' route
        await userLogoutHandler();
        navigate('/login');
    } ,[navigate, userLogoutHandler])

    const toastId = useRef(null);

    useEffect(()=>{
        if( errorMessage){
            if(!toast.isActive(toastId.current)){
                if(isSessionInvalid()){
                    loginHandler();
                    toastId.current = toast(({ closeToast })=>{
                        return (
                            <ErrorContent
                                errorMsg={errorMessage} 
                            />
                        )
                    },{
                        type: 'warning',
                        autoClose: 3000
                    });
                } else {
                    toastId.current = toast(({ closeToast })=>{
                        return (
                            <ErrorContent
                                errorMsg={errorMessage} 
                            />
                        )
                    },{
                        type: 'warning',
                        autoClose: false
                    });
                }
            }
            //reset errorMessage after showing
            showErrorMsg('');
        }
    },[errorMessage, isSessionInvalid, loginHandler, showErrorMsg])
    
    return (
        <ToastContainer 
            transition={Zoom} 
            position={'bottom-right'}
            />
    );
}

function ErrorContent({
    errorMsg
}) {
    return (
    <p className="">
        <span>{errorMsg}</span>
    </p>
    )
}