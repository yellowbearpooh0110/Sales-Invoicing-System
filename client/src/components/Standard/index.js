import React, { useState } from 'react';
import { NavLink, Route, Switch, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Home as HomeIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  SwapHoriz as SwapHorizIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import Swal from 'sweetalert2';

import { logout } from 'services/auth.service';

import Order from './Order';

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const drawerWidth = 240;
const drawerHeight = 50;

const useStandardStyles = makeStyles({
  root: {},
  sidebar: {
    boxSizing: 'border-box',
    paddingTop: '10px',
    width: (props) => props.drawerWidth,
    backgroundColor: '#fff',
    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    '& a': {
      textDecoration: 'none',
    },
  },
  navlink: {
    color: '#6b778c',
    '&:hover': {
      // backgroundColor: '#5664d20a',
    },
    transition: 'background-color ease .5s',

    '& .MuiListItemIcon-root': {
      minWidth: '40px',
    },
    '& .MuiListItemIcon-root, & .MuiListItemText-root': {
      '.active &': {
        color: '#5664d2',
      },
    },
  },
});

const Standard = (props) => {
  const { window } = props;
  const classes = useStandardStyles({ drawerWidth });
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { path } = useRouteMatch();
  const [expIndex, setExpIndex] = useState(0);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text: 'Log out will remove your session information permanently.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout!',
      cancelButtonText: 'No, Keep Login',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        props.logout();
      }
    });
  };

  const drawer = (
    <>
      <Divider />
      <List>
        {[
          { path: '/user', icon: <HomeIcon />, label: 'Home' },
          {
            icon: <SwapHorizIcon />,
            label: 'Order',
            children: [
              {
                path: '/user/order/list',
                label: 'List',
              },
              {
                path: '/user/order/create',
                label: 'Create',
              },
            ],
          },
        ].map((item, index) => (
          <Box key={index}>
            {item.children ? (
              <>
                <ListItem
                  button
                  className={classes.navlink}
                  onClick={() => {
                    expIndex === index ? setExpIndex(-1) : setExpIndex(index);
                  }}
                  secondaryAction={
                    <ExpandMoreIcon
                      sx={{
                        transition: 'transform ease .3s',
                        transform: expIndex === index ? '' : 'Rotate(-90deg)',
                      }}
                    />
                  }
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
                <Collapse in={expIndex === index}>
                  <List disablePadding>
                    {item.children.map((child, childIndex) => (
                      <NavLink
                        key={childIndex}
                        to={child.path}
                        exact
                        onClick={handleDrawerToggle}
                        activeClassName="active"
                      >
                        <ListItem button className={classes.navlink}>
                          <ListItemIcon>{null}</ListItemIcon>
                          <ListItemText primary={child.label} />
                        </ListItem>
                      </NavLink>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <NavLink to={item.path} exact activeClassName="active">
                <ListItem button className={classes.navlink}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              </NavLink>
            )}
          </Box>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button className={classes.navlink} onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#5664d2',
          flexBasis: `${drawerHeight}px`,
          maxHeight: `${drawerHeight}px`,
        }}
      >
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Standard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        flexBasis={`calc(100% - ${drawerHeight}px)`}
        maxHeight={`calc(100% - ${drawerHeight}px)`}
        position="relative"
        display="flex"
        backgroundColor="#f4f5f7"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          PaperProps={{
            className: classes.sidebar,
          }}
        >
          {drawer}
        </Drawer>
        <Box
          variant="permanent"
          className={classes.sidebar}
          sx={{
            display: { xs: 'none', sm: 'block' },
          }}
          open
        >
          {drawer}
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Switch>
            <Route path={`${path}/order`} component={Order} />
            <Route path={`${path}/transactions`} exact />
          </Switch>
        </Box>
      </Box>
    </>
  );
};

export default connect(mapStateToProps, { logout })(Standard);
