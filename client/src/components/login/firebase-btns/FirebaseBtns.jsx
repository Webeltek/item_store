import { toast, Zoom} from "react-toastify";

import {  signInWithPopup } from "firebase/auth";
import firebase from "../../../utils/firebaseAuthentication";
import { useFirebaseLogin } from "../../../api/authApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './FirebaseBtns.css'

export default function FirebaseBtns() {
    const { userLoginHandler, firebaseLogin } = useFirebaseLogin();
    const [pending, setPending] = useState({google: false,facebook: false});
    let navigate = useNavigate();


    const handleGoogleSignIn = async () => {
        try {
            setPending(state=> ({...state, google: true}) );
            const result = await signInWithPopup(firebase.auth, firebase.googleProvider);
            console.log('User:', result.user);
            const idToken = await result.user.getIdToken();
            const authData = await firebaseLogin(idToken);
            setPending(false);
            userLoginHandler(authData);
            navigate('/items');
        
        } catch (error) {
            setPending(state=> ({...state, google: false}));
            toast.warn("Google sign-in error")  
        }
        };

    const handleFacebookLogin = async ()=> {
        try {
            setPending(state=> ({...state, facebook: true}));
            const result = await signInWithPopup(firebase.auth, firebase.facebookProvider);
            const user = result.user;
            console.log(user);
            
            const idToken = await result.user.getIdToken();
            const authData = await firebaseLogin(idToken);
            setPending(false);
            userLoginHandler(authData);
            navigate('/items');
            
        } catch (error) {
            console.log(error);
            
            toast.warn("Facebook Login Error:")
        } finally {
            setPending(prev => ({ ...prev, facebook: false }));
          }
    }    

    return (
        <>
        <button
            onClick={handleGoogleSignIn}
            disabled={pending.google}
            style={{
                width: "60%",
                margin: "0.3em auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 24px",
                borderRadius: "4px",
                border: "1px solid #dadce0",
                backgroundColor: `${pending.google ? 'gray' : '#fff'}`,
                color: "#3c4043",
                fontSize: "12px",
                fontWeight: 500,
                fontFamily: "Roboto, sans-serif",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                transition: "box-shadow 0.2s ease-in-out",
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(60,64,67,.3)";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";
            }}
            >
            <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                style={{ height: 18, marginRight: 10 }}
            />
            Login with Google
            </button>
            <button 
                className="facebook-btn" 
                onClick={handleFacebookLogin}
                disabled={pending.facebook}
                style={{
                    width: "60%",
                    margin: "0.3em auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 24px",
                    borderRadius: "4px",
                    border: "1px solid #dadce0",
                    backgroundColor: `${pending.facebook ? 'gray' : '#fff'}`,
                    color: "#3c4043",
                    fontSize: "12px",
                    fontWeight: 500,
                    fontFamily: "Roboto, sans-serif",
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    transition: "box-shadow 0.2s ease-in-out",
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(60,64,67,.3)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";
                }}>
                
                <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" 
                alt="Facebook Logo"
                style={{ height: 18, marginRight: 10 }}
                />
                Login with Facebook
            </button>
        </>
        );
}