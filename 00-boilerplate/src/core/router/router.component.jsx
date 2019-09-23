import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import { history } from './history';
import { routes } from './routes';
import { LoginScene, HotelCollectionScene } from 'scenes';

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
          component={HotelCollectionScene}
        />
        <Route
          path={routes.hotelEdit}
          component={props => <h1>Edit {props.match.params.id}</h1>}
        />
      </Switch>
    </Router>
  );
};
