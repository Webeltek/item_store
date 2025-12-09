import { toast} from "react-toastify";

import {  sendSignInLinkToEmail, signInWithPopup } from "firebase/auth";
import firebase from "../../../utils/firebaseAuthentication";
import { useFirebaseLogin } from "../../../api/authApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { ConfigProvider, Input } from "antd";
import { Input, Button, Stack, Text, Notification, Divider } from '@mantine/core';
import styles from "./FirebaseBtns.module.css"

export default function FirebaseBtns() {
    const [pending, setPending] = useState({google: false,facebook: false});
    const { userLoginHandler, firebaseLogin } = useFirebaseLogin();

    let navigate = useNavigate();
    // const { Search } = Input;
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleSignIn = async () => {
        try {
            setPending(state=> ({...state, google: true}) );
            const result = await signInWithPopup(firebase.auth, firebase.googleProvider);
            //console.log('User:', result.user);
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
            //console.log(user);
            
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

    const handleSendLink = async () => {
        try {
          await sendSignInLinkToEmail(firebase.auth, email, firebase.actionCodeSettings);
          window.localStorage.setItem('emailForSignIn', email);
          setSent(true);
          setError('');
        } catch (err) {
          setError(err.message);
          console.log(err.message);
          
          setSent(false);
        }
      };

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
                className={styles["facebook-btn"]} 
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
            <Stack align="center" justify="center" p="0" gap="0.3em">
                <Divider size="md" label="or sign in with email" 
                labelPosition="center"
                className={styles.myDivider}
                w="80%"
                m="0.3em 0"
                 />

                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    placeholder="Enter your email"
                    style={{
                        width: '80%',
                        padding: '0',
                        }}
                    size="md"
                />

                <Button
                    onClick={handleSendLink}
                    variant="filled"
                    color="teal"
                    size="md"
                    w="80%"
                    m="0 auto"
                >
                    Send Sign-in Link
                </Button>

                {sent && <Notification
                            w="60%" 
                            color="green" 
                            title="Success"
                            onClose={()=> setSent(false)}>Email link sent! <br /> Check your email!
                        </Notification>}
                {error && <Notification 
                            color="red" 
                            title="Error"
                            onClose={()=> setError(false)}>Error sending link!</Notification>}
            </Stack>
        </>
        );
}