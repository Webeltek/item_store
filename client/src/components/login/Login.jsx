import { useContext, useState } from "react"
import { Link, useNavigate } from 'react-router'
import './Login.css'
import { useLogin } from "../../api/authApi";
import { UserContext } from "../../contexts/UserContext";
import { useLoginValidation } from "./useLoginValidation";

export default function Login(){
    const [errorMsg, setErrorMsg] = useState();
    const { userLoginHandler } = useContext(UserContext);
    let navigate = useNavigate();
    const { login } = useLogin();
    const {errors, handleBlur, validateField} = useLoginValidation();
    const [pending, setPending] = useState();

    const loginHandler = async (formData) =>{
        const data = Object.fromEntries(formData)
        // Validate all fields before submitting
        Object.keys(data).forEach((key) => {
            validateField(key, data[key]);
        });
        

        if (Object.values(errors).some((error) => error)) {
            // form is automatically reset since loginHandler is client action
            return;
        }
        
        try {
            setPending(true);
            const authData = await login(data.email, data.password);
            // console.log(authData);
            setPending(false);
            userLoginHandler(authData);
            navigate('/items');
        } catch (err) {
            setPending(false);
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
                        name="email"
                        onBlur={handleBlur} />
                    </div>
                    {errors.email &&
                        <div>
                                <p className="error">{errors.email}</p>
                        </div>
                    }
                    
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                        type="password" 
                        id="password" 
                        name="password"
                        onBlur={handleBlur} />
                    </div>
                    {errors.password &&
                        <div>
                                <p className="error">{errors.password}</p>
                        </div>
                    }
                    
                    <button disabled={pending} 
                        className="btn" 
                        style={ {backgroundColor: pending ? 'grey':'#0073e6' }}
                        >Login
                    </button>
                    <p>Don&apos;t have an account? <Link to="/register">Register</Link></p>
                </form>
            </div>
        </section>
        </>
    )
}