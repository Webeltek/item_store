import { ScrollArea } from "@mantine/core";
import classes from "./Navbar.module.css";
import { IconHome, IconList, IconInfoCircle ,IconPackage} from "@tabler/icons-react";
import { NavbarLinksGroup } from "./NavbarLinksGroup/NavbarLinksGroup";
import useAuth from "../../hooks/useAuth";
import { forwardRef } from "react";

const Navbar = forwardRef( ({toggleBurger }, ref)=> {
    const { isAuthenticated} = useAuth();
    const linksdata = [
        { label : 'Home', link: '/', icon: IconHome},
        { label: 'Catalog', icon: IconList,
            links: [
               { label: 'TVs', link: '/items'},

            ]
        },
        ...(isAuthenticated ?  [{ label: 'Add TV', link: '/add-item', icon: IconPackage}] : []),
        { label: 'About', link: '/about', icon: IconInfoCircle}
    ]

    const links = linksdata.map((item)=> <NavbarLinksGroup toggleBurger={toggleBurger} {...item} key={item.label} />)
    return (
        <nav ref={ref} className={classes.navbar}>
            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>{links}</div>
            </ScrollArea>
        </nav>
    );
})

Navbar.displayName = 'Navbar';

export default Navbar