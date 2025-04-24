import { toast, Zoom} from "react-toastify";

import { signOut, signInWithRedirect , getRedirectResult, onAuthStateChanged} from "firebase/auth";
import firebase from "../../../utils/firebaseAuthentication";
import { useEffect } from "react";

export default function GoogleBtn() {

    const handleSignIn = async () => {
        try {
          await signInWithRedirect(firebase.auth, firebase.provider);
        } catch (error) {
          toast("Google sign-in error", {
            autoClose: false,
            transition: Zoom,
            position: 'bottom-right',
            type: 'warning'
        } )  
          console.error("Google sign-in error", error);
        }
      };

    useEffect(()=>{
        getRedirectResult(firebase.auth)
        .then((result) => {
            const user = result;
            console.log("getRedirectResult Signed in user:", user);
            })
            .catch((error) => {
            console.error(error);
        });

        const unsubscribe = onAuthStateChanged(firebase.auth, (user) => {
            if (user) {
              console.log("onAuthStateChanged Signed in user:", user);
            }
          });
         return ()=> unsubscribe(); 
    },[]);  

    const handleSignOut = ()=> {
         signOut(firebase.auth)
        .then(() => {
            console.log("Signed out successfully");
        })
        .catch((error) => {
            console.error("Sign out error:", error);
        });
    }

    return (
        <>
        <button onClick={handleSignOut}>SignOut</button>
        <button
            onClick={handleSignIn}
            style={{
                width: "50%",
                margin: "0.3em auto",
                display: "flex",
                alignItems: "center",
                padding: "10px 24px",
                borderRadius: "4px",
                border: "1px solid #dadce0",
                backgroundColor: "#fff",
                color: "#3c4043",
                fontSize: "14px",
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