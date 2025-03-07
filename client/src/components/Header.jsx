import { useState } from 'react';
import { NavLink } from 'react-router';
import './Header.css'

export default function Header(){
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const logoutHandler = () => {

    }

    return (
        <header>
            <div className="container-header">
                <nav>
                    <span>Tv Store</span>
                    <div className='profile-menu'>
                        <i className="fa-solid fa-user"></i>
                        { isAuthenticated ? 
                        <NavLink className='profile' to="/profile">Username: {'get username!!!'}</NavLink>
                        :
                        <NavLink className='profile-guest' to="/login">Profile</NavLink>
                        }
                        {/* <i className="fa-solid fa-bars"></i> */}
                    </div>


                </nav>
                <nav>
                    <ul>
                        <li><NavLink to="/home" className={( { isActive })=>
                            isActive ? 'active-link' : ''}>Home</NavLink></li>
                        <li><NavLink to="/items" className={( { isActive })=>
                            isActive ? 'active-link' : ''}>Catalog</NavLink></li>
                        <li><NavLink to="/about" className={( { isActive })=>
                            isActive ? 'active-link' : ''}>About</NavLink></li>
                        { isAuthenticated ? (
                            <>
                            <li><NavLink to="/profile" className={( { isActive })=>
                                isActive ? 'active-link' : ''}>Profile</NavLink></li>
                            <li><NavLink to="/add-phone" className={( { isActive })=>
                                isActive ? 'active-link' : ''}>Add Phone</NavLink></li>
                            <li><NavLink onClick={logoutHandler}>Logout</NavLink></li>
                            </>
                        )
                        : (
                            <>
                            <li><NavLink to="/login" className={( { isActive })=>
                                isActive ? 'active-link' : ''}>Login</NavLink></li>
                            <li><NavLink to="/register" className={( { isActive })=>
                                isActive ? 'active-link' : ''}>Register</NavLink></li>
                            </>
                        
                        )}
                    </ul>
                </nav>

            </div>
        </header>
    )
}

