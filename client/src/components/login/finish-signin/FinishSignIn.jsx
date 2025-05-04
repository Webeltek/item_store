import React, { useEffect, useState } from 'react';
import firebase from "../../../utils/firebaseAuthentication";
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { useFirebaseLogin } from '../../../api/authApi';
import { useNavigate } from 'react-router-dom';
import EmailPrompt from './email-prompt/EmailPrompt';

export default function FinishSignIn() {
  const [opened, setOpened] = useState(false);
  const [promptEmail, setPromptEmail] = useState('');

  console.log("Opened state", opened)

  const handleConfirm = (value) => {
    setPromptEmail(value);
    setOpened(false);
  };
  
  const { userLoginHandler, firebaseLogin } = useFirebaseLogin();
  let navigate = useNavigate();
  useEffect(() => {
    const completeSignIn = async () => {
      if (isSignInWithEmailLink(firebase.auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        console.log("email from local storage",email);
        
        if (!email) {
          setOpened(true);
          email = promptEmail;
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
  }, [firebaseLogin,navigate,userLoginHandler,promptEmail]);

  return (
  <>
  <EmailPrompt isOpen={opened} confirmHandler={handleConfirm}/>
  {promptEmail && <p>You entered: {promptEmail}</p>}
  <p  className="mt-[280px] text-2xl font-semibold text-center text-gray-700 mb-4">Completing sign-in...</p>;
  </>
  )
}