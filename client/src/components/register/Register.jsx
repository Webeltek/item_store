import { useState } from "react";
import { Link } from "react-router-dom";
import classes from '../login/Login.module.css'
import { useRegister } from "../../api/authApi";
import { useRegisterValidation } from "./useRegisterValidation";
import { Paper } from "@mantine/core";
import useRecapchta from "../../hooks/useRecaptcha";


export default function Register() {
    
    const { register } = useRegister();
    const { errors, handleBlur, validateField, values, setValues } = useRegisterValidation();
    const [pendingFormData, setPendingFormData] = useState(false);
    const {pending, recaptchaRef,setShowCaptcha,showCaptcha} = useRecapchta(
            pendingFormData,
            register);
        
        
    const registerHandler = async (e)=> {
        e.preventDefault();
        
        // stop submitting if form untouched
        const areAllFieldsEmpty = Object.values(values).some( val => val === '');
        if(areAllFieldsEmpty){
            return;
        }
        
        // Validate all fields before submitting
        Object.keys(values).forEach((key) => {
            validateField(key, values[key]);
        });
        
        // stop submitting if errors
        if (Object.values(errors).some((error) => error)) {
            console.log(errors);
            return;
        }
        
        
        
        setPendingFormData(values);
        setShowCaptcha(true);
        // try {
        //     setPending(true);
        //     const authData =  await register(username, email, password, rePassword);
        //     setPending(false);
        //     userLoginHandler(authData);
        //     navigate('/items');
            
        // } catch (err) {
        //     setPending(false);
        //     setValues({
        //         username: '',
        //         email: '',
        //         password: '',
        //         rePassword: ''
        //     });
            
        // }
    }
    
    const changeHandler = (e) =>{
        //clear errors
        // setErrors({ 
        //     username: '', 
        //     email: '', 
        //     password: '', 
        //     rePassword: ''});
        setValues( state => ( {...state, [e.target.name] : e.target.value}))
    }
        
         

    return (
        <>

        <section className={classes.loginHero}>
                <h2 className={classes.loginHeroH2}>Create Your Account</h2>
                <p className={classes.loginHeroP}>Join us to get the best deals on TVs and accessories.</p>
        </section>

        <Paper shadow="md" withBorder p="1em" radius="md" maw={400} m="1em auto" w="100%"
                styles={{
                    root: {
                        // backgroundColor: "var(--mantine-color-gray-0)"
                    }
                }}>
                <form  onSubmit={registerHandler}>
                { showCaptcha ? (
                    <div ref={recaptchaRef} style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} />
                ) :
                    <>
                    <div className={classes.formGroup}>
                        <label className={classes.label} htmlFor="username">Username:</label>
                        <input
                         className={errors.username ? classes.inputError : classes.formGroupInput} 
                         type="text" 
                         id="username" 
                         name="username" 
                         value={values.username} 
                         onChange={changeHandler}
                         onBlur={handleBlur} />
                        {errors.username &&  
                        <p className={classes.error}>{errors.username}</p>
                        }
                    </div>
                    
                    <div className={classes.formGroup}>
                        <label className={classes.label} htmlFor="email">Email:</label>
                        <input
                            className={ errors.email ? classes.inputError : classes.formGroupInput}
                            type="email" 
                            id="email" 
                            name="email" 
                            value={values.email} 
                            onChange={changeHandler}
                            onBlur={handleBlur}/>
                        {errors.email &&  
                                <p className="error">{errors.email}</p>
                        }
                    </div>
                    {/* <!--password--> */}
                        <div className={classes.formGroup}>
                            <label className={classes.label} htmlFor="password">Password:</label>
                            <input
                                className={errors.password ? classes.inputError : classes.formGroupInput}
                                type="password" 
                                id="password" 
                                name="password" 
                                value={values.password} 
                                onChange={changeHandler} 
                                onBlur={handleBlur}/>
                            {errors.password &&  
                                    <p className={classes.error}>{errors.password}</p>
                            }
                        </div>
                        <div className={classes.formGroup}>
                            <label className={classes.label} htmlFor="confirm-password">Confirm Password:</label>
                            <input
                            className={errors.rePassword ? classes.inputError : classes.formGroupInput}
                            type="password" 
                            id="confirm-password" 
                            name="rePassword" 
                            value={values.rePassword} 
                            onChange={changeHandler}
                            onBlur={handleBlur} />
                        </div>
                        {errors.rePassword &&  
                                <p className={classes.error}>{errors.rePassword}</p>
                        }
                    <button 
                    className={classes.btn} 
                    disabled={pending} 
                    style={ {backgroundColor: pending ? 'grey':'#0073e6' }}
                    >Register</button>
                    <p className={classes.registerP}>
                        Already have an account? <Link className={classes.registerPA} to="/login">Login</Link></p>
                    </>
                }
                </form>
        </Paper>                
        </>
    );
}