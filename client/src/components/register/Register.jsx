import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Register.css'
import { useRegister } from "../../api/authApi";
import { UserContext } from "../../contexts/UserContext";
import { useRegisterValidation } from "./useRegisterValidation";


export default function Register() {
    const [errorMsg, setErrorMsg] = useState();
    const [pending , setPending] = useState();
    
    
    const navigate = useNavigate();
    const { register } = useRegister();
    const { userLoginHandler } = useContext(UserContext);
    const { errors, setErrors, handleBlur, validateField, values, setValues } = useRegisterValidation();
        
        
    const registerHandler = async (e)=> {
        e.preventDefault();
        
        // Validate all fields before submitting
        Object.keys(values).forEach((key) => {
            validateField(key, values[key]);
        });
        
        if (Object.values(errors).some((error) => error)) {
            return;
        }
        
        const { username, email , password , rePassword} = values;
        try {
            setPending(true);
            const authData =  await register(username, email, password, rePassword);
            setPending(false);
            userLoginHandler(authData);
            navigate('/items');
            
        } catch (err) {
            setPending(false);
            setValues({
                username: '',
                email: '',
                password: '',
                rePassword: ''
            });
            setErrorMsg(err.message);
            
        }
    }
    
    const changeHandler = (e) =>{
        //clear errors
        setErrors({ 
            username: '', 
            email: '', 
            password: '', 
            rePassword: ''});
        setValues( state => ( {...state, [e.target.name] : e.target.value}))
    }
        
         

    return (
        <>
        { errorMsg && 
            <p className="notification error-message">{errorMsg}</p>
        }

        <section className="register-hero">
            <div className="container">
                <h2>Create Your Account</h2>
                <p>Join us to get the best deals on TVs and accessories.</p>
            </div>
        </section>

        <section className="register-form">
            <div className="container">
                <form  onSubmit={registerHandler}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input 
                         type="text" 
                         id="username" 
                         name="username" 
                         value={values.username} 
                         onChange={changeHandler}
                         onBlur={handleBlur} />
                    </div>
                        {errors.username &&  
                        <div>
                            <p className="error">{errors.username}</p>
                        </div>
                        }
                    
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                        type="email" 
                        id="email" 
                        name="email" 
                        value={values.email} 
                        onChange={changeHandler}
                        onBlur={handleBlur}/>
                    </div>
                    {errors.email &&  
                        <div>
                            <p className="error">{errors.email}</p>
                        </div>
                    }
                    {/* <!--password--> */}
                    <div >
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                            type="password" 
                            id="password" 
                            name="password" 
                            value={values.password} 
                            onChange={changeHandler} 
                            onBlur={handleBlur}/>
                        </div>
                        {errors.password &&  
                            <div>
                                <p className="error">{errors.password}</p>
                            </div>
                        }
                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm Password:</label>
                            <input
                            type="password" 
                            id="confirm-password" 
                            name="rePassword" 
                            value={values.rePassword} 
                            onChange={changeHandler}
                            onBlur={handleBlur} />
                        </div>
                        {errors.rePassword &&  
                            <div>
                                <p className="error">{errors.rePassword}</p>
                            </div>
                        }
                    </div>
                    <button 
                    className="btn" 
                    disabled={pending} 
                    style={ {backgroundColor: pending ? 'grey':'#0073e6' }}
                    >Register</button>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </form>
            </div>
        </section>

        </>
    );
}