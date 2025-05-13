import usePersistedState from "../hooks/usePersitedState";
import { UserContext } from "../contexts/UserContext";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { readErrorMessage } from "../hooks/useAuth";
import { getAuth, signOut } from "firebase/auth";


export default function UserProvider({
    children
}){
    const [authData, setAuthData] = usePersistedState('auth', {});
    const [ errorMessage, setErrorMessage] = useState('');
    const location = useLocation();
    
    const userLoginHandler = (resultData) => {
      setAuthData(resultData);
    }

    const auth = getAuth();
  
    const userLogoutHandler = async () =>{
      // try to logout firebase user if logged in as firebase user
      try {
        await signOut(auth);
        console.log('Firebase User signed out');
      } catch (error) {
        console.error('Firebase Error signing out:', error);
      }
      setAuthData({})
    }

    const showErrorMsg = useCallback((errMsg)=> {
      const userMessage = readErrorMessage(errMsg);
      setErrorMessage(userMessage);
    },[])

    useEffect(() => {
      return () => {
        showErrorMsg(''); // clear error msg when navigate away - on unmount
      };
    }, [location.pathname, showErrorMsg]); // Runs when pathname changes


    return (
        // 
        <UserContext.Provider value={ {errorMessage, showErrorMsg , ...authData, userLoginHandler, userLogoutHandler } }>
            { children }
        </UserContext.Provider>
    )
}