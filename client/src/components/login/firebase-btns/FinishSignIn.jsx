import React, { useEffect } from 'react';
import firebase from "../../../utils/firebaseAuthentication";
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { useFirebaseLogin } from '../../../api/authApi';
import { useNavigate } from 'react-router-dom';

export default function FinishSignIn() {
  const { userLoginHandler, firebaseLogin } = useFirebaseLogin();
  let navigate = useNavigate();
  useEffect(() => {
    const completeSignIn = async () => {
      if (isSignInWithEmailLink(firebase.auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please enter your email');
        }

        try {
          const result = await signInWithEmailLink(firebase.auth, email, window.location.href);
          console.log('Successfully signed in:', result.user);
          window.localStorage.removeItem('emailForSignIn');
          const idToken = await result.user.getIdToken();
          const authData = await firebaseLogin(idToken);
          userLoginHandler(authData);
          navigate('/items');
        } catch (error) {
          console.error('Error signing in:', error);
        }
      }
    };

    completeSignIn();
  }, [firebaseLogin,navigate]);

  return <p>Completing sign-in...</p>;
}