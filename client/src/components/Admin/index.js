import * as React from 'react';
import { NavLink, Route, Switch, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  AppBar,
  Box,
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
  PeopleAlt as PeopleAltIcon,
  SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import Swal from 'sweetalert2';

import { logout } from 'services/auth.service';
import Users from './Users';

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const drawerWidth = 240;

const useAdminStyles = makeStyles({
  root: {},
  sidebar: {
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: (props) => props.drawerWidth,
      backgroundColor: `#000`,
      zIndex: 1,
      '&::before': {
        width: '100%',
        height: '100%',
        content: '""',
        display: 'block',
        opacity: 0.8,
        position: 'absolute',
        background: '#000',
      },
    },
    '& a': {
      textDecoration: 'none',
    },
  },
  navlink: {
    color: '#fff',
    transition: 'background-color ease .5s',
    '.active &': {
      backgroundColor: '#00acc1',
    },
    '& .MuiListItemIcon-root': {
      color: '#fff',
    },
    '& .MuiListItemText-root': {
      color: '#fff',
    },
  },
});

const Admin = (props) => {
  const { window } = props;
  const classes = useAdminStyles({ drawerWidth });
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { path } = useRouteMatch();

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
    // props.logout();
  };

  const drawer = (
    <>
      <Toolbar />
      <Divider />
      <List>
        {[
          { path: '/admin', icon: <HomeIcon />, label: 'Home' },
          {
            path: '/admin/users',
            icon: <PeopleAltIcon />,
            label: 'Users',
          },
          {
            path: '/admin/orders',
            icon: <SwapHorizIcon />,
            label: 'Orders',
          },
        ].map((item, index) => (
          <NavLink key={index} to={item.path} exact activeClassName="active">
            <ListItem button className={classes.navlink}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          </NavLink>
        ))}
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
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          className={classes.sidebar}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          className={classes.sidebar}
          sx={{
            display: { xs: 'none', sm: 'block' },
            zIndex: 1,
          }}
          open
        >
          {drawer}
        </Drawer>
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
          <Route path={`${path}/users`} exact component={Users} />
          <Route path={`${path}/orders`} exact />
        </Switch>
      </Box>
    </Box>
  );
};

export default connect(mapStateToProps, { logout })(Admin);
