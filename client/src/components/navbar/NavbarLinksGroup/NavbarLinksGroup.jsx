import {Text, UnstyledButton, Box, Group, ThemeIcon, Collapse} from "@mantine/core"
import classes from "./NavbarLinksGroup.module.css"
import { useState } from "react";
import { IconChevronRight } from '@tabler/icons-react';
import { NavLink } from "react-router-dom";
export function NavbarLinksGroup({
    icon: Icon, 
    label,
    link, 
    initiallyOpened, 
    links,
    toggleBurger : onMenuClick
  }
) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);

  const menuTitleClickHandler = ()=>{
    if (!hasLinks){
      onMenuClick();
    }
  }

  const items = (hasLinks ? links : []).map((link) => (
    <Text
      component={NavLink}
      className={classes.link}
      to={link.link}
      key={link.label}
      onClick={onMenuClick}
    >
      {link.label}
    </Text>
  ));
    return (
    <>
      <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md" onClick={menuTitleClickHandler} component={NavLink} to={link}>{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              size={16}
              style={{ transform: opened ? 'rotate(-90deg)' : 'none' }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
    );
}


