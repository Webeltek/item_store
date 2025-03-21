import { useContext, useState } from "react"
import { Link, useNavigate } from 'react-router'
import SubmitBtn from "./SubmitBtn";
import userService from "../../services/userService";
import './Login.css'
import { useLogin } from "../../api/authApi";
import { UserContext } from "../../contexts/UserContext";

export default function Login(){
    const [errorMsg, setErrorMsg] = useState();
    const { userLoginHandler } = useContext(UserContext);
    let navigate = useNavigate();
    const { login } = useLogin();

    const loginHandler = async (formData) =>{
        const { email, password } = Object.fromEntries(formData)
        
        try {
            const authData = await login(email, password);
            // console.log(authData);
            userLoginHandler(authData);
            navigate('/items');
        } catch (err) {
            setErrorMsg(err.message);
            
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