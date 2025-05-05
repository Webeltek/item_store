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
  const [emailLinkError, setEmailLinkError] = useState('');
  const [emailToUse, setEmailToUse] = useState('');
  const { userLoginHandler, firebaseLogin } = useFirebaseLogin();
  const navigate = useNavigate();

  // 1. On mount, check for email in localStorage or show prompt
  useEffect(() => {
    if (isSignInWithEmailLink(firebase.auth, window.location.href)) {
      const storedEmail = window.localStorage.getItem('emailForSignIn');
      if (storedEmail) {
        setEmailToUse(storedEmail);
      } else {
        setOpened(true); // show prompt
      }
    }
  }, []);

  // 2. Sign in when email is ready
  useEffect(() => {
    const completeSignIn = async () => {
      if (!emailToUse || !isSignInWithEmailLink(firebase.auth, window.location.href)) return;

      try {
        const result = await signInWithEmailLink(firebase.auth, emailToUse, window.location.href);
        console.log('Successfully signed in:', result.user);
        window.localStorage.removeItem('emailForSignIn');
        const idToken = await result.user.getIdToken();
        const authData = await firebaseLogin(idToken);
        userLoginHandler(authData);
        navigate('/items');
      } catch (error) {
        setEmailLinkError("This link may have expired, already been used or opened in a different browser/device.")
        console.error('Error signing in:', error);
      }
    };

    completeSignIn();
  }, [emailToUse,firebaseLogin,navigate,userLoginHandler]); // Only runs when we have an email

  const handleConfirm = (value) => {
    setEmailToUse(value);
    setOpened(false);
  };

  return (
  <>
  <EmailPrompt isOpen={opened} confirmHandler={handleConfirm}/>
  {emailToUse && <p>You entered: {emailToUse}</p>}
  <p  className="mt-[280px] text-2xl font-semibold text-center text-gray-700 mb-4">{ emailLinkError ? emailLinkError :  "Completing sign-in..."}</p>;
  </>
  )
}