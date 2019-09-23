import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import { history } from './history';
import { routes } from './routes';
import { LoginScene } from 'scenes';

export const RouterComponent = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route
          exact={true}
          path={[routes.root, routes.login]}
          component={LoginScene}
        />
        <Route
          exact={true}
          path={routes.hotelCollection}
          component={() => <h1>test</h1>}
        />
      </Switch>
    </Router>
  );
};
