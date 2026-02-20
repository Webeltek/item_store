import { NavLink } from 'react-router';
import classes from './Header.module.css'
import ErrorMsg from './error-msg/ErrorMsg';
import useAuth from '../../hooks/useAuth';
import { Burger, Button, Group, Menu, Stack , NavLink as MNavlink, ThemeIcon} from '@mantine/core';
import { IconListCheck, IconListDetails, IconSettings, IconUser } from '@tabler/icons-react';

export default function Header({
    isMobile,
    burgerOpened,
    toggleBurger,
}){
    const { email, isAuthenticated } = useAuth();

    return (
        <>
                <Stack className={classes.topHeader} gap="0">
                    <Group  
                    justify='space-between' align='baseline' p="0 1rem">
                        <span className={classes.siteTitle}>Webeltek Pi Monitor Boards</span>
                        <div className={classes.profileMenu}>
                            <ThemeIcon variant="light" size={24}>
                                <IconUser size={16} />
                            </ThemeIcon>
                            { isAuthenticated ? 
                            <NavLink className={classes.profile} to="/profile">{email}</NavLink>
                            :
                            <NavLink className={classes.profile} to="/login">Guest</NavLink>
                            }
                            {/* <i className="fa-solid fa-bars"></i> */}
                        </div>
                    </Group>
                    <Group flex="1 1 auto" justify='flex-start' p="0.2rem 1rem" >
                        <Burger opened={burgerOpened} onClick={toggleBurger} /* hiddenFrom="sm" */ size="sm" />
                        {/* <Burger opened={deskOpened} onClick={toggleDesk} visibleFrom="sm" size="sm" /> */}
                        <Group flex="1 1 auto" p="0">
                        { !burgerOpened && !isMobile && (
                            <>
                                <Button variant='filled' component={NavLink} 
                                    to="/" classNames={{ root: classes.root }} >Home
                                </Button>
                                    
                                <Menu>
                                    <Menu.Target>
                                        <Button
                                        variant='filled' component={NavLink}
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
                                {!burgerOpened && !isMobile && 
                                <Button variant='filled' component={NavLink} 
                                    to="/add-item" classNames={{ root: classes.root }}>Add product
                                </Button>
                                }
                                <Menu trigger='hover'>
                                    <Menu.Target>
                                        <Button ml="auto" variant='outline' 
                                        classNames={{ root: classes.root }}>Profile
                                        </Button>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item  leftSection={<IconSettings color='var(--mantine-color-ocean-blue-5)' size={14}/>}
                                        component={NavLink} to="/profile"
                                        >My account</Menu.Item>
                                        <Menu.Item leftSection={<IconListDetails color='var(--mantine-color-ocean-blue-5)' size={14}/>}
                                        component={NavLink} to="/profile/products" 
                                        >My products</Menu.Item>
                                        <Menu.Item leftSection={<IconListCheck color='var(--mantine-color-ocean-blue-5)' size={14}/>}
                                        component={NavLink} to="/profile/orders" 
                                        >My orders</Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
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

