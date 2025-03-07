import { useState } from "react";
import userService from "../../services/userService";
import { Link, useNavigate } from "react-router-dom";
import './Register.css'

export default function Register() {
    const [errorMsg, setErrorMsg] = useState();
    const [pending , setPending] = useState();
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        rePassword: ''
    })
    let navigate = useNavigate();


    const registerHandler = async (e)=> {
        e.preventDefault();
        setPending(true);
        const { username, email , password , rePassword} = values;
                try {
                    const user =  await userService.register(username, email, password, rePassword);
                    console.log({user});
                    setPending(false);
                    navigate('/items');
                    
                } catch (err) {
                    //e.target.reset();
                    console.error(err.message);
                    
                }
    }

    const changeHandler = (e) =>{
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
                <p>Join us to get the best deals on phones and accessories.</p>
            </div>
        </section>

        <section className="register-form">
            <div className="container">
                <form  onSubmit={registerHandler}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input 
                         type="text" id="username" name="username" value={values.username} onChange={changeHandler} />
                    </div>
                        <div>
                                <p className="error">
                                    Username is required!
                                </p>
                                <p className="error">
                                    Username must be at least 5 characters!
                                </p>
                                <p className="error">
                                    Username must contain only latin letters and digits!
                                </p>
                        </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                        type="email" id="email" name="email" value={values.email} onChange={changeHandler}/>
                    </div>
                        <div>
                                <p className="error">
                                    Email is required!
                                </p>
                            
                                <p className="error">
                                    Email is not valid!
                                </p>
                        </div>
                    {/* <!--password--> */}
                    <div >
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                            type="password" id="password" name="password" value={values.password} onChange={changeHandler} />
                        </div>
                            <div>
                                    <p className="error">
                                        Password is required!
                                    </p>
                                    <p className="error">
                                        Password must be at least 5 characters!
                                    </p>
                                    <p className="error">
                                        Password must contain only latin letters and digits!
                                    </p>
                            </div>
                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm Password:</label>
                            <input
                            type="password" id="confirm-password" name="rePassword" value={values.rePassword} onChange={changeHandler} />
                        </div>
                            <div>
                                    <p className="error">
                                        Repeat Password does not match password!
                                    </p>
                            </div>
                    </div>
                    <button className="btn" disabled={pending} >Register</button>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </form>
            </div>
        </section>

        </>
    );
}