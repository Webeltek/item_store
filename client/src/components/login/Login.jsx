import {  useState } from "react"
import { Link } from 'react-router'
import { useLogin } from "../../api/authApi";
import { useLoginValidation } from "./useLoginValidation";
import FirebaseBtns from "./firebase-btns/FirebaseBtns";
import useRecapchta from "../../hooks/useRecaptcha";
import classes from './Login.module.css'
import { Paper } from "@mantine/core";


export default function Login(){
    const {errors, handleBlur, validateField} = useLoginValidation();
    const [pendingFormData, setPendingFormData] = useState(false);
    const { login } = useLogin();
    const {pending, recaptchaRef,setShowCaptcha,showCaptcha} = useRecapchta(
        pendingFormData,
        login);


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
        <section className={classes.loginHero}>
            <h2 className={classes.loginHeroH2}>Login to Your Account</h2>
            <p className={classes.loginHeroP}>Access your order history, track orders, and more.</p>
        </section>
       
        <Paper shadow="md" withBorder p="1em" radius="md" maw={400} m="1em auto" w="100%"
        styles={{
            root: {
                // backgroundColor: "var(--mantine-color-gray-0)"
            }
        }}>
            <form action={loginHandler}>
                { showCaptcha ? (
                    <div>
                        <div ref={recaptchaRef} style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }} />
                    </div>
                ) :
                    <>   
                    <div className={classes.formGroup}>
                        <label className={classes.label} htmlFor="email">Email:</label>
                        <input
                        className={errors.email ? classes.inputError : classes.formGroupInput}
                        type="email"
                        id="email"
                        name="email"
                        onBlur={handleBlur}
                        />
                        {errors.email && (
                            <p className={classes.error}>{errors.email}</p>
                        )}
                    </div>

                    <div className={classes.formGroup}>
                        <label className={classes.label} htmlFor="password">Password:</label>
                        <input
                        className={errors.password ? classes.inputError : classes.formGroupInput}
                        type="password"
                        autoComplete="current-password"
                        id="password"
                        name="password"
                        onBlur={handleBlur}
                        />
                        {errors.password && (
                            <p className={classes.error}>{errors.password}</p>
                        )}
                    </div>

                    <button
                        disabled={pending}
                        className={classes.btn}
                        style={{ backgroundColor: pending ? 'grey' : '#0073e6' }}
                    >
                        Login
                    </button>
                    <FirebaseBtns />
                    <p className={classes.registerP}>
                        Don&apos;t have an account? <Link className={classes.registerPA} to="/register">Register</Link>
                    </p>
                    </>
                }
            </form>
            </Paper>
      </>
    
    );
}