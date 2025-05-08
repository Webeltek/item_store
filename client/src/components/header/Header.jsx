import { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import classes from './Header.module.css'
import { UserContext } from '../../contexts/UserContext';
import ErrorMsg from './error-msg/ErrorMsg';
import useAuth from '../../hooks/useAuth';
import { Burger, Button, Group, Menu, Stack , NavLink as MNavlink} from '@mantine/core';

export default function Header({
    mobOpened,
    deskOpened,
    toggleMob,
    toggleDesk
}){
    const { email, isAuthenticated } = useAuth();
    

    return (
        <>
                <Stack className={classes.topHeader} gap="0">
                    <Group align='baseline' p="0 1rem">
                        <span className={classes.siteTitle}>Tv Store</span>
                        <div className={classes.profileMenu}>
                            <i className={`fa-solid fa-user ${classes["profile-menu-icon"]}`}></i>
                            { isAuthenticated ? 
                            <NavLink className={classes.profile} to="/profile">User: {email}</NavLink>
                            :
                            <NavLink className={classes.profile} to="/login">Guest</NavLink>
                            }
                            {/* <i className="fa-solid fa-bars"></i> */}
                        </div>
                    </Group>
                    <Group justify='flex-start' p="0.2rem 1rem" >
                        <Burger opened={mobOpened} onClick={toggleMob} hiddenFrom="sm" size="sm" />
                        <Burger opened={deskOpened} onClick={toggleDesk} visibleFrom="sm" size="sm" />
                        <Group p="0" visibleFrom='sm'>
                            <Button variant='filled'
                                    classNames={{
                                        root: classes.root
                                    }}
                                    component={NavLink} to="/"
                                    >Home</Button>
                                
                            <Menu>
                                <Menu.Target>
                                    <Button
                                    variant='filled'
                                    component={NavLink} to="/items"
                                    classNames={{
                                        root: classes.root
                                    }}
                                    >Catalog</Button>
                                </Menu.Target>
                            </Menu>
                            
                            <Button variant='filled'
                            component={NavLink} to="/about" 
                            classNames={{
                                root: classes.root
                            }}>About
                            </Button>
                            { isAuthenticated ? (
                                <>
                                <li className={classes.listItem}><NavLink to="/profile" className={( { isActive })=>
                                    isActive ? 'active-link' : ''}>Profile</NavLink></li>
                                <li className={classes.listItem}><NavLink to="/add-item" className={( { isActive })=>
                                    isActive ? 'active-link' : ''}>Add TV</NavLink></li>
                                <li className={classes.listItem}><NavLink to='/logout'>Logout</NavLink></li>
                                </>
                            )
                            : (
                                <>
                                <li className={classes.listItem}><NavLink to="/login" className={( { isActive })=>
                                    isActive ? 'active-link' : ''}>Login</NavLink></li>
                                <li className={classes.listItem}><NavLink to="/register" className={( { isActive })=>
                                    isActive ? 'active-link' : ''}>Register</NavLink></li>
                                </>
                            
                            )}
                        </Group>
                    </Group>
                </Stack>            
        <ErrorMsg />
        </>
    )
}

