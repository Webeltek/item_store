import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function useRecapchta(
    pendingFormData,
    apiCallMethod){
    const { userLoginHandler, showErrorMsg } = useContext(UserContext);
    let navigate = useNavigate();
    
    const [pending, setPending] = useState();
    const [showCaptcha, setShowCaptcha] = useState(false);
     
    const recaptchaRef = useRef(null);
    const recaptchaRendered = useRef(false);

  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  },[]);

    // Callback to render reCAPTCHA
    useEffect(() => {
    // Render captcha only when showCaptcha becomes true AND DOM has updated
    if (showCaptcha && window.grecaptcha && recaptchaRef.current && !recaptchaRendered.current) {
        window.grecaptcha.ready(() => {
            recaptchaRendered.current = true;
            window.grecaptcha.render(recaptchaRef.current, {
                sitekey: import.meta.env.VITE_RECAPTCHA_SITEKEY,
                callback: async (token) => {
                try {
                    setPending(true);
                    const paramsArr = Object.values(pendingFormData);
                    const authData = await apiCallMethod(...paramsArr,token);
                    userLoginHandler(authData);
                    navigate('/items');
                } catch (err) {
                    showErrorMsg(err.message);
                } finally {
                    setPending(false);
                    setShowCaptcha(false);
                    // setPendingFormData(null);
                    recaptchaRendered.current = false;
                    // optionally reset recaptcha here if needed
                }
                },
            });
        });
    }
    }, [showCaptcha, apiCallMethod, navigate, pendingFormData, userLoginHandler, showErrorMsg]);

    return {
        // setPendingFormData,
        setShowCaptcha,
        showCaptcha,
        recaptchaRef,
        pending
    }
}