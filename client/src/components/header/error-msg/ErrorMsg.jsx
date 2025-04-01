import { useEffect } from 'react'
import './ErrorMsg.css'
import { useNavigate } from 'react-router-dom';
import usePersistedState from '../../../hooks/usePersitedState';
export default function ErrorMsg({
    errorMsg,
}) {
    const navigate = useNavigate();
    const [ setPersistedState] = usePersistedState();
    function isSessionInvalid(){
        return errorMsg === "Session expired, please login again!"
        || errorMsg === "Invalid session, please login again!";
    }
    return (
        <>
        { errorMsg && (
            <p className="notification error-message">
                <span>{errorMsg}</span>
                { isSessionInvalid() && 
                <button className="error-msg-btn" onClick={()=> navigate('/login')}>Login
                    </button>
                }
            </p>
        )}
        </>
    );
}