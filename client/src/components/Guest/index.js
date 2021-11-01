import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import SignIn from './SignIn';

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const Guest = connect(mapStateToProps)((props) => {
  return (
    <Switch>
      <Route path={`/`} exact>
        <Redirect to={`/signin`}></Redirect>
      </Route>
      <Route path={`/signin`} exact>
        <SignIn />
      </Route>
      <Route path={`/signup`} exact>
        <SignIn />
      </Route>
    </Switch>
  );
});

export default Guest;
