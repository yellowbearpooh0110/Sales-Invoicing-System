import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import Create from './Create';

const Users = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/create`} exact component={Create} />
    </Switch>
  );
};

export default Users;
