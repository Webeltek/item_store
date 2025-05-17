import { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate } from 'react-router'
import './Login.css'
import { useLogin } from "../../api/authApi";
import { UserContext } from "../../contexts/UserContext";
import { useLoginValidation } from "./useLoginValidation";
import FirebaseBtns from "./firebase-btns/FirebaseBtns";


export default function Login(){
    const { userLoginHandler, showErrorMsg } = useContext(UserContext);
    let navigate = useNavigate();
    const { login } = useLogin();
    const {errors, handleBlur, validateField} = useLoginValidation();
    const [pending, setPending] = useState();
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [pendingFormData, setPendingFormData] = useState(false) 
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
                    const authData = await login(pendingFormData.email, pendingFormData.password);
                    userLoginHandler(authData);
                    navigate('/items');
                } catch (err) {
                    showErrorMsg(err.message);
                } finally {
                    setPending(false);
                    setShowCaptcha(false);
                    setPendingFormData(null);
                    recaptchaRendered.current = false;
                    // optionally reset recaptcha here if needed
                }
                },
            });
        });
    }
    }, [showCaptcha, login, navigate, pendingFormData, userLoginHandler, showErrorMsg]);


    const loginHandler = async (formData) =>{
        const data = Object.fromEntries(formData);

        // stop submitting if form untouched
        const areAllFieldsEmpty = Object.values(data).some( val => val === '');
        if(areAllFieldsEmpty){
            return;
        }

        // Validate all fields before submitting
        Object.keys(data).forEach((key) => {
            validateField(key, data[key]);
        });
        
        // stop submitting if errors
        if (Object.values(errors).some((error) => error)) {
            // form is automatically reset since loginHandler is client action
            return;
        }

        // Show reCAPTCHA widget
        setPendingFormData(data);
        setShowCaptcha(true); // show the widget
    }

    return (
      <>
        <section className="login-hero">
          <div className="container">
            <h2>Login to Your Account</h2>
            <p>Access your order history, track orders, and more.</p>
          </div>
        </section>
       
        <section className="login-form">
          <div className="container">
            <form action={loginHandler}>
                { showCaptcha ? (
                <div style={{
                    textAlign: 'center'
                }}>
                    <div ref={recaptchaRef} style={{
                        display:'inline-block'
                    }} />
                </div>
                ) :
                    <>   
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                        className={errors.email ? 'input-error' : ''}
                        type="email"
                        id="email"
                        name="email"
                        onBlur={handleBlur}
                        />
                    </div>
                    {errors.email && (
                        <div>
                        <p className="error">{errors.email}</p>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                        className={errors.password ? 'input-error' : ''}
                        type="password"
                        id="password"
                        name="password"
                        onBlur={handleBlur}
                        />
                    </div>
                    {errors.password && (
                        <div>
                        <p className="error">{errors.password}</p>
                        </div>
                    )}

                    <button
                        disabled={pending}
                        className="btn"
                        style={{ backgroundColor: pending ? 'grey' : '#0073e6' }}
                    >
                        Login
                    </button>
                    <FirebaseBtns />
                    <p>
                        Don&apos;t have an account? <Link to="/register">Register</Link>
                    </p>
                    </>
                }
            </form>
          </div>
        </section>
      </>
    
    );
}