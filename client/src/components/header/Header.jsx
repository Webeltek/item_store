import { NavLink } from 'react-router';
import classes from './Header.module.css'
import ErrorMsg from './error-msg/ErrorMsg';
import useAuth from '../../hooks/useAuth';
import { Burger, Button, Group, Menu, Stack , NavLink as MNavlink} from '@mantine/core';

export default function Header({
    isMobile,
    isNavbarOpened,
    mobOpened,
    deskOpened,
    toggleMob,
    toggleDesk
}){
    const { email, isAuthenticated } = useAuth();

    return (
        <>
                <Stack className={classes.topHeader} gap="0">
                    <Group justify='space-between' align='baseline' p="0 1rem">
                        <span className={classes.siteTitle}>Tv Store</span>
                        <span style={{ color: "darkcyan"}}>This site is under construction</span>
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
                    <Group flex="1 1 auto" justify='flex-start' p="0.2rem 1rem" >
                        <Burger opened={mobOpened} onClick={toggleMob} hiddenFrom="sm" size="sm" />
                        <Burger opened={deskOpened} onClick={toggleDesk} visibleFrom="sm" size="sm" />
                        <Group flex="1 1 auto" p="0">
                        { !isNavbarOpened && !isMobile && (
                            <>
                                <Button variant='filled' component={NavLink} 
                                    to="/" classNames={{ root: classes.root }} >Home
                                </Button>
                                    
                                <Menu>
                                    <Menu.Target>
                                        <Button
                                        variant='filled'component={NavLink}
                                        to="/items"
                                        classNames={{
                                            root: classes.root
                                        }}
                                        >Catalog</Button>
                                    </Menu.Target>
                                </Menu>
                                
                                <Button variant='filled' component={NavLink} 
                                    to="/about" classNames={{ root: classes.root }}>About
                                </Button>
                            </>
                        )}
                            { isAuthenticated ? (
                                <>
                                {!isNavbarOpened && !isMobile && 
                                <Button variant='filled' component={NavLink} 
                                    to="/add-item" classNames={{ root: classes.root }}>Add TV
                                </Button>
                                }
                                <Button ml="auto" variant='outline' component={NavLink} 
                                    to="/profile" classNames={{ root: classes.root }}>Profile
                                </Button>
                                <Button variant='outline' component={NavLink} 
                                    to="/logout" classNames={{ root: classes.root }}>Logout
                                </Button>
                                </>
                            )
                            : (
                                <>
                                <Button ml="auto" variant='outline' component={NavLink}
                                    to="/login"
                                    classNames={{ root: classes.root}} >Login
                                </Button>
                                <Button  variant='outline' component={NavLink}
                                    to="/register"
                                    classNames={{ root: classes.root}} >Register
                                </Button>
                                </>
                            
                            )}
                        </Group>
                    </Group>
                </Stack>            
        <ErrorMsg />
        </>
    )
}

