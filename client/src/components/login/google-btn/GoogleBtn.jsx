import { toast, Zoom} from "react-toastify";

import { signOut, signInWithPopup , getRedirectResult, onAuthStateChanged} from "firebase/auth";
import firebase from "../../../utils/firebaseAuthentication";
import { useGoogleLogin } from "../../../api/authApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleBtn() {
    const { googleLogin, userLoginHandler } = useGoogleLogin();
    const [pending, setPending] = useState(false);
    let navigate = useNavigate();

    console.log(pending);
    

    const handleSignIn = async () => {
        try {
          const result = await signInWithPopup(firebase.auth, firebase.provider);
          console.log('User:', result.user);
          const idToken = await result.user.getIdToken();
          setPending(true);
          const authData = await googleLogin(idToken);
          setPending(false);
          userLoginHandler(authData);
          //navigate to previous route after login
          // navigate(-1);
          navigate('/items');
        
    } catch (error) {
        setPending(false);
          toast("Google sign-in error", {
            autoClose: false,
            transition: Zoom,
            position: 'bottom-right',
            type: 'warning'
        } )  
          console.error("Google sign-in error", error);
        }
      };  

    return (
        <>
        <button
            onClick={handleSignIn}
            disabled={pending}
            style={{
                width: "60%",
                margin: "0.3em auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 24px",
                borderRadius: "4px",
                border: "1px solid #dadce0",
                backgroundColor: `${pending} ? 'gray' : '#fff'`,
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
            Sign in with Google
            </button>
        </>
        );
}