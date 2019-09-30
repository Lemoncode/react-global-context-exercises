import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { history } from './history';
import { LoginScene, HotelCollectionScene, HotelEditScene } from 'scenes';
import { routes } from './routes';

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
        <Route path={routes.hotelEdit} component={HotelEditScene} />
      </Switch>
    </Router>
  );
};
