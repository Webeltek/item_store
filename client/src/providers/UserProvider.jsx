import usePersistedState from "../hooks/usePersitedState";
import { UserContext } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function UserProvider({
    children
}){
    const [authData, setAuthData] = usePersistedState('auth', {});
    const [ errorMessage, setErrorMessage] = useState('');
    const location = useLocation();
    
      const userLoginHandler = (resultData) => {
        setAuthData(resultData);
      }
    
      const userLogoutHandler = () =>{
        setAuthData({})
      }

      const showErrorMsg = (errMsg)=> {
        setErrorMessage(errMsg);
      }

      useEffect(() => {
        return () => {
          showErrorMsg(''); // clear error msg when navigate away - on unmount
        };
      }, [location.pathname]); // Runs when pathname changes


    return (
        // 
        <UserContext.Provider value={ {errorMessage, showErrorMsg , ...authData, userLoginHandler, userLogoutHandler } }>
            { children }
        </UserContext.Provider>
    )
}