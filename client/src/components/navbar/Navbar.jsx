import { ScrollArea } from "@mantine/core";
import classes from "./Navbar.module.css";
import { IconHome, IconList, IconInfoCircle} from "@tabler/icons-react";
import { NavbarLinksGroup } from "./NavbarLinksGroup/NavbarLinksGroup";

export default function Navbar() {
    const linksdata = [
        { label : 'Home', link: '/', icon: IconHome},
        { label: 'Catalog', icon: IconList,
            links: [
               { label: 'TVs', link: '/items'},

            ]
        },
        { label: 'About', link: '/about', icon: IconInfoCircle}
    ]

    const links = linksdata.map((item)=> <NavbarLinksGroup {...item} key={item.label} />)
    return (
        <nav className={classes.navbar}>

        <ScrollArea className={classes.links}>
            <div className={classes.linksInner}>{links}</div>
        </ScrollArea>
        </nav>
    );
}