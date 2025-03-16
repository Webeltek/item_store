import { useState } from "react"
import { Link, useNavigate } from 'react-router'
import SubmitBtn from "./SubmitBtn";
import userService from "../../services/userService";
import './Login.css'

export default function Login({
    onLogin
}){
    const [errorMsg, setErrorMsg] = useState();
    let navigate = useNavigate();

    const loginHandler = async (formData) =>{
        const { email, password } = Object.fromEntries(formData)
        
        try {
            const user =  await userService.login(email, password);
            // console.log({user});
            navigate('/items');
            onLogin(user)
        } catch (err) {
            console.error(err.message);
            
        }
    
    }

    return (
        <>
        { errorMsg && (
            <p className="notification error-message">{errorMsg}</p>
        )}
        <section className="login-hero">
            <div className="container">
                <h2>Login to Your Account</h2>
                <p>Access your order history, track orders, and more.</p>
            </div>
        </section>

        <section className="login-form">
            <div className="container">
                <form  action={loginHandler}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                        type="email" 
                        id="email" 
                        name="email" />
                    </div>
                        <div>
                                <p className="error">
                                    Email is required!
                                </p>
                                <p className="error">
                                    Email is not valid!
                                </p>
                        </div>
                    
                    
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                        type="password" 
                        id="password" 
                        name="password" />
                    </div>
                        <div>
                                <p className="error">
                                    Password is required!
                                </p>
                                <p className="error">
                                    Password must be at least 5 characters!
                                </p>
                                <p className="error">
                                    Password must contains only latin letters and digits!
                                </p>
                        </div>
                    
                    <SubmitBtn />
                    <p>Don&apos;t have an account? <Link to="/register">Register</Link></p>
                </form>
            </div>
        </section>
        </>
    )
}