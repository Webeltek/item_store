import { toast, Zoom} from "react-toastify";

import {  sendSignInLinkToEmail, signInWithPopup } from "firebase/auth";
import firebase from "../../../utils/firebaseAuthentication";
import { useFirebaseLogin } from "../../../api/authApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfigProvider, Input } from "antd";
import styles from "./FirebaseBtns.module.css"

export default function FirebaseBtns() {
    const { userLoginHandler, firebaseLogin } = useFirebaseLogin();
    const [pending, setPending] = useState({google: false,facebook: false});
    let navigate = useNavigate();
    const { Search } = Input;

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
            
            toast.warn("Facebook Login Error")
        } finally {
            setPending(prev => ({ ...prev, facebook: false }));
          }
    }
    
    const onSendLink = async (value, _e, info)=>{
        const email = value;
        const source = info.source;
        if(source === "input"){
            try {
                await sendSignInLinkToEmail(firebase.auth, email, firebase.actionCodeSettings);
                window.localStorage.setItem('emailForSignIn', email);
                alert('Check your email for the sign-in link.');
              } catch (error) {
                console.error('Error sending link:', error);
            }
        }
    }

    return (
        <>
            <button
            onClick={handleGoogleSignIn}
            disabled={pending.google}
            className={styles["google-btn"]}
            style={{
                backgroundColor: `${pending.google ? 'gray' : '#fff'}`
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
                className={styles["google-btn"]} 
                onClick={handleFacebookLogin}
                disabled={pending.facebook}
                style={{
                    backgroundColor: `${pending.facebook ? 'gray' : '#fff'}`,
                }}>
                
                <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" 
                alt="Facebook Logo"
                style={{ height: 18, marginRight: 10 }}
                />
                Login with Facebook
            </button>
            <Search
            style={{
                display: "block",
                width: "60%",
                margin: "0.3em auto"
            }}
            classNames={{
            input: 'my-input',
            }}
            styles={{
            input: { 
                color: '',
                },
            }}
            placeholder="input email"
            allowClear
            enterButton="Send Link"
            size="large"
            onSearch={onSendLink}
            onClear={()=> ''}
            />
        </>
        );
}