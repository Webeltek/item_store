import {  getRedirectResult, onAuthStateChanged, signInWithRedirect } from "firebase/auth";
import { useCallback, useEffect, useRef } from "react";
import firebase from "../../../../utils/firebaseAuthentication";
import { toast} from "react-toastify";
import { useFirebaseLogin } from "../../../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function useFacebook(setPending){
    let navigate = useNavigate();
    const { userLoginHandler, firebaseLogin } = useFirebaseLogin();
    const tokenSentRef = useRef(false); // prevent duplicate sends

    const sendTokenToBackend = useCallback( async (idToken) => {
        try {
            const authData = await firebaseLogin(idToken);
            userLoginHandler(authData);
            navigate('/items');
            
        } catch (error)  {
            console.error('Backend error:', error);
        };
    },[firebaseLogin,navigate, userLoginHandler])

    const handleUser = useCallback(async (user) => {
        if (user && !tokenSentRef.current) {
            tokenSentRef.current = true; // mark as sent
            const idToken = await user.getIdToken();
            await sendTokenToBackend(idToken);
        }
        },[sendTokenToBackend]) 
      
      
      useEffect(() => {
          const checkRedirect = async () => {
              try {
                  const result = await getRedirectResult(firebase.auth);
                  await handleUser(result?.user || firebase.auth.currentUser);
                } catch (error) {
                    console.error('Redirect result error:', error);
                } finally {
                    setPending(state=> ({...state, facebook: false}));
                }
            };
            
            checkRedirect();
            
            // Also listen to auth state changes (covers other sign-in flows)
            const unsubscribe = onAuthStateChanged(firebase.auth, async (user) => {
                handleUser(user);
            });
            
            return () => unsubscribe();
        }, [handleUser, setPending]);

        const handleFacebookLogin = async ()=> {
            setPending(state=> ({...state, facebook: true}));
            signInWithRedirect(firebase.auth, firebase.facebookProvider);
        }
        return {
            handleFacebookLogin
        }
}