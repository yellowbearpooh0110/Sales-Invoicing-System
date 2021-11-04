import React, { useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Box, Toolbar } from '@mui/material';
import {
  Home as HomeIcon,
  SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';

import AppHeader from 'components/Common/AppHeader';
import { CollapsedSidebar, FixedSidebar } from 'components/Common/Sidebar';
import { logout } from 'services/auth.service';
import Users from './Users';
import { ChairBrand, ChairModel, ChairStock } from './Chair';

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const drawerWidth = 240;
const drawerHeight = 50;

const menuLists = [
  [{ path: '/admin', icon: <HomeIcon />, label: 'Home' }],
  [
    { path: '/admin/chair/brand', icon: <SwapHorizIcon />, label: 'Brand' },
    { path: '/admin/chair/model', icon: <SwapHorizIcon />, label: 'Model' },
    { path: '/admin/chair/stock', icon: <SwapHorizIcon />, label: 'Stock' },
    { path: '/admin/chair/order', icon: <SwapHorizIcon />, label: 'Order' },
  ],
];

const Admin = (props) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { path } = useRouteMatch();

  const handleDrawerOpen = (e) => {
    e.preventDefault();
    setMobileOpen(true);
  };

  const handleDrawerClose = (e) => {
    e.preventDefault();
    setMobileOpen(false);
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

  return (
    <>
      <AppHeader
        drawerHeight={drawerHeight}
        handleDrawerToggle={handleDrawerOpen}
      />
      <Box
        flexBasis={`calc(100% - ${drawerHeight}px)`}
        maxHeight={`calc(100% - ${drawerHeight}px)`}
        position="relative"
        display="flex"
        backgroundColor="#f4f5f7"
      >
        <CollapsedSidebar
          mobileOpen={mobileOpen}
          handleDrawerClose={handleDrawerClose}
          drawerWidth={drawerWidth}
          handleLogout={handleLogout}
          lists={menuLists}
        />
        <FixedSidebar
          drawerWidth={drawerWidth}
          handleLogout={handleLogout}
          lists={menuLists}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            maxWidth: '100%',
          }}
        >
          <Toolbar />
          <Switch>
            <Route path={`${path}/user`} component={Users} />
            <Route path={`${path}/chair/brand`} exact component={ChairBrand} />
            <Route path={`${path}/chair/model`} exact component={ChairModel} />
            <Route path={`${path}/chair/stock`} exact component={ChairStock} />
          </Switch>
        </Box>
      </Box>
    </>
  );
};

export default connect(mapStateToProps, { logout })(Admin);
