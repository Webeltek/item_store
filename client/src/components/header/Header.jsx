import { useContext, useState } from 'react';
import { NavLink } from 'react-router';
import './Header.css'
import { UserContext } from '../../contexts/UserContext';

export default function Header(){
    const { email } = useContext(UserContext);

    const logoutHandler = () => {

    }

    return (
        <header>
            <div className="container-header">
                <nav>
                    <span>Tv Store</span>
                    <div className='profile-menu'>
                        <i className="fa-solid fa-user"></i>
                        { email ? 
                        <NavLink className='profile' to="/profile">Username: {email}</NavLink>
                        :
                        <NavLink className='profile-guest' to="/login">Profile</NavLink>
                        }
                        {/* <i className="fa-solid fa-bars"></i> */}
                    </div>


                </nav>
                <nav>
                    <ul>
                        <li><NavLink to="/" className={( { isActive })=>
                            isActive ? 'active-link' : ''}>Home</NavLink></li>
                        <li><NavLink to="/items" className={( { isActive })=>
                            isActive ? 'active-link' : ''}>Catalog</NavLink></li>
                        <li><NavLink to="/about" className={( { isActive })=>
                            isActive ? 'active-link' : ''}>About</NavLink></li>
                        { email ? (
                            <>
                            <li><NavLink to="/profile" className={( { isActive })=>
                                isActive ? 'active-link' : ''}>Profile</NavLink></li>
                            <li><NavLink to="/add-item" className={( { isActive })=>
                                isActive ? 'active-link' : ''}>Add TV</NavLink></li>
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

