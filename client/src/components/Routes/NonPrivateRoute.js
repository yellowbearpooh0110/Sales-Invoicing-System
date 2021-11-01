import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const NonPrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isLoggedIn === false ? (
        <Component {...props} />
      ) : auth.isAdmin === true ? (
        <Redirect to="/admin" />
      ) : (
        <Redirect to="/" />
      )
    }
  />
);

NonPrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(NonPrivateRoute);
