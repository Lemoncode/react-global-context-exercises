# 05 Redux

In this example we will use redux to manage global state.

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) if they are not already installed on your computer.

## Steps to build it

- Copy the content of the `00-boiler` folder to an empty folder for the sample.

- Install the npm packages described in the [./package.json](./package.json) and verify that it works:

```bash
npm install
```

- Let's get up and running with redux:

```bash
npm install redux react-redux --save
```

- We need to configure the redux `store` and the `combined reducers`:

### ./src/core/store/root-reducer.jsx

```javascript
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
  // Combine all reducers
});
```

- Configure store:

### ./src/core/store/store.js

```javascript
import { createStore } from 'redux';
import { rootReducer } from './root-reducer';

export const store = createStore(rootReducer);
```

- Add `barrel` file:

### ./src/core/store/index.js

```javascript
export * from './store';
```

- As we used in React context, we need to instantiate the `redux Provider`. We are going to replace context slowly, so let's keep GlobalStateProvider for now:

### ./src/core/app.jsx

```diff
import React from 'react';
+ import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import { RouterComponent } from 'core/router';
import { GlobalStateProvider } from 'core/context';
+ import { store } from 'core/store';

const App = () => {
  return (
+   <Provider store={store}>
      <GlobalStateProvider>
        <RouterComponent />
      </GlobalStateProvider>
+   </Provider>
  );
};

export default hot(App);

```

- Let's start replacing `login` state:

### ./src/core/store/reducers/login.reducer.js

```javascript
const actionTypes = {
  ON_UPDATE_LOGIN: 'CORE [1]: ON_UPDATE_LOGIN',
};

export const loginReducer = (state = '', action) => {
  switch (action.type) {
    case actionTypes.ON_UPDATE_LOGIN:
      return action.payload;

    default:
      return state;
  }
};

// Actions
export const onUpdateLogin = login => ({
  type: actionTypes.ON_UPDATE_LOGIN,
  payload: login,
});
```

- Add `barrel` file for reducers:

### ./src/core/store/reducers/index.js

```javascript
import { combineReducers } from 'redux';
import { loginReducer } from './login.reducer';

export const coreReducer = combineReducers({
  login: loginReducer,
});
```

- Combine in `rootReducer`:

```diff
import { combineReducers } from 'redux';
+ import { coreReducer } from './reducers';

export const rootReducer = combineReducers({
- // Combine all reducers
+ core: coreReducer,
});

```

- Export the action creator:

### ./src/core/store/index.js

```diff
+ import { onUpdateLogin } from './reducers/login.reducer';

+ export const coreActions = {
+   onUpdateLogin,
+ };

export * from './store';

```

- Update `login`:

### ./src/pods/login/login.container.jsx

```diff
import React from 'react';
+ import { connect } from 'react-redux';
import { LoginComponent } from './login.component';
import { linkRoutes, history } from 'core/router';
- import { GlobalStateContext } from 'core/context';
+ import { coreActions } from 'core/store';
...

- export const LoginContainer = props => {
+ const InnerLoginContainer = props => {
- const { dispatch } = React.useContext(GlobalStateContext);
+ const { onUpdateLogin } = props;
...

  const handleValidateCredentials = () => {
    validateCredentials(credentials.login, credentials.password).then(
      areValidCredentials => {
        if (areValidCredentials) {
-         dispatch({ login: credentials.login });
+         onUpdateLogin(credentials.login);
          history.push(linkRoutes.hotelCollection);
        } else {
...
};

+ const mapStateToProps = () => ({});

+ const mapDispatchToProps = dispatch => ({
+   onUpdateLogin: login => dispatch(coreActions.onUpdateLogin(login)),
+ });

+ export const LoginContainer = connect(
+   mapStateToProps,
+   mapDispatchToProps
+ )(InnerLoginContainer);

```

- Update `layout`:

### ./src/layouts/app.layout.jsx

```diff
import React from 'react';
+ import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
- import { GlobalStateContext } from 'core/context';
import { useFlasher } from 'common/hooks';

- export const AppLayout = props => {
+ const InnerAppLayout = props => {
- const { state } = React.useContext(GlobalStateContext);
+ const { login, children } = props;

  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton color="inherit" aria-label="Menu">
            <AccountCircle />
          </IconButton>
          <Typography ref={useFlasher()} variant="h6" color="inherit">
-           {state.login}
+           {login}
          </Typography>
        </Toolbar>
      </AppBar>
-     {props.children}
+     {children}
    </div>
  );
};

+ const mapStateToProps = state => ({
+   login: state.core.login,
+ });

+ export const AppLayout = connect(mapStateToProps)(InnerAppLayout);

```

- Configure `store` to get info in `redux devtools`:

### ./src/core/store/store.js

```diff
- import { createStore } from 'redux';
+ import { createStore, compose } from 'redux';
import { rootReducer } from './root-reducer';

+ const composeEnhancer =
+   (process.env.NODE_ENV !== 'production' &&
+     window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']) ||
+   compose;

+ const initialState = {};

- export const store = createStore(rootReducer);
+ export const store = createStore(rootReducer, initialState, composeEnhancer());

```

- How to suppor `react-router` with `redux`? We need to install `connected-react-router` that it provides a reducer and actions to keep react-router tracing:

```bash
npm install connected-react-router --save
```

- We need to configure `rootReducers`, `store` and `router`:

### ./src/core/store/root-reducer.jsx

```diff
import { combineReducers } from 'redux';
+ import { connectRouter } from 'connected-react-router';
import { coreReducer } from './reducers';

- export const rootReducer = combineReducers({
+ export const createRootReducer =  history => combineReducers({
+   router: connectRouter(history),
    core: coreReducer,
  });

```

- Update `store` config:

### ./src/core/store/store.js

```diff
import { createStore, compose } from 'redux';
+ import { createStore, compose, applyMiddleware } from 'redux';
+ import { routerMiddleware } from 'connected-react-router';
- import { rootReducer } from './root-reducer';
+ import { createRootReducer } from './root-reducer';
+ import { history } from '../router';

const composeEnhancer =
  (process.env.NODE_ENV !== 'production' &&
    window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']) ||
  compose;

const initialState = {};

- export const store = createStore(rootReducer, initialState, composeEnhancer());
+ export const store = createStore(
+   createRootReducer(history),
+   initialState,
+   composeEnhancer(applyMiddleware(routerMiddleware(history)))
+ );

```

- Update `router` config:

### ./src/core/router/router.component.jsx

```diff
import React from 'react';
- import { Router, Route, Switch } from 'react-router-dom';
+ import { Route, Switch } from 'react-router-dom';
+ import { ConnectedRouter } from 'connected-react-router';

import { history } from './history';
import { routes } from './routes';
import { LoginScene, HotelCollectionScene, HotelEditScene } from 'scenes';
import { AppLayout } from '../../layouts/app.layout';

export const RouterComponent = () => {
  return (
    <AppLayout>
-     <Router history={history}>
+     <ConnectedRouter history={history}>
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
-     </Router>
+     </ConnectedRouter>
    </AppLayout>
  );
};

```

- Add `hotel collection` reducer. We need to add it to core reducer too, because we are going to re-use it in `hotel edit`. So first, we could extrat `action types`:

### ./src/core/store/action-types.js

```javascript
export const actionTypes = {
  ON_UPDATE_LOGIN: 'CORE [1]: ON_UPDATE_LOGIN',
  ON_UPDATE_HOTEL_COLLECTION: 'CORE [2]: ON_UPDATE_HOTEL_COLLECTION',
};
```

- Extract `action creators`:

### ./src/core/store/actions/login.actions.js

```javascript
import { actionTypes } from '../action-types';

export const onUpdateLogin = login => ({
  type: actionTypes.ON_UPDATE_LOGIN,
  payload: login,
});
```

### ./src/core/store/actions/hotel-collection.actions.js

```javascript
import { actionTypes } from '../action-types';

export const onUpdateHotelCollection = hotelCollection => ({
  type: actionTypes.ON_UPDATE_HOTEL_COLLECTION,
  payload: hotelCollection,
});
```

- Add `barrel` file:

### ./src/core/store/actions/index.js

```javascript
export * from './login.actions';
export * from './hotel-collection.actions';
```

### ./src/core/store/index.js

```diff
- import { onUpdateLogin } from './reducers/login.reducer';

- export const coreActions = {
-   onUpdateLogin,
- };
+ import * as coreActions from './actions';
+ export { coreActions };

export * from './store';

```

- Update `login reducer`:

### ./src/core/store/reducers/login.reducer.js

```diff
+ import { actionTypes } from '../action-types';
- const actionTypes = {
-   ON_UPDATE_LOGIN: 'CORE [1]: ON_UPDATE_LOGIN',
- };

export const loginReducer = (state = '', action) => {
  switch (action.type) {
    case actionTypes.ON_UPDATE_LOGIN:
      return action.payload;

    default:
      return state;
  }
};

- // Actions
- export const onUpdateLogin = login => ({
-   type: actionTypes.ON_UPDATE_LOGIN,
-   payload: login,
- });

```

- Implement `hotel collection reducer`:

### ./src/core/store/reducers/login.reducer.js

```javascript
```

### ./src/pods/hotel-collection/store/hotel-collection.reducer.js

```javascript
import { actionTypes } from '../action-types';

export const hotelCollectionReducer = (state = [], action) => {
  switch (action.type) {
    case actionTypes.ON_UPDATE_HOTEL_COLLECTION:
      return action.payload;

    default:
      return state;
  }
};
```

- Use it:

### ./src/pods/hotel-collection/hotel-collection.container.jsx

```diff
import React from 'react';
+ import { connect } from 'react-redux';
import { HotelCollectionComponent } from './hotel-collection.component';
import { linkRoutes, history } from 'core/router';
import { useHotelCollection } from './use-hotel-collection.hook';
+ import { coreActions } from 'core/store';

- export const HotelCollectionContainer = props => {
+ const InnerHotelCollectionContainer = props => {
+ const { hotelCollection, onUpdateHotelCollection } = props;
- const { hotelCollection, onFetchHotelCollection } = useHotelCollection();
+ const { onFetchHotelCollection } = useHotelCollection(
+   hotelCollection,
+   onUpdateHotelCollection
+ );
...
};

+ const mapStateToProps = state => ({
+   hotelCollection: state.core.hotelCollection,
+ });

+ const mapDispatchToProps = dispatch => ({
+   onUpdateHotelCollection: hotelCollection =>
+     dispatch(coreActions.onUpdateHotelCollection(hotelCollection)),
+ });

+ export const HotelCollectionContainer = connect(
+   mapStateToProps,
+   mapDispatchToProps
+ )(InnerHotelCollectionContainer);

```

- Update custom hook:

### ./src/pods/hotel-collection/use-hotel-collection.hook.jsx

```diff
- import React from 'react';
import { fetchHotelCollection } from './hotel-collection.api';
import { mapFromApiToVm } from './hotel-collection.mapper';
import { mapCollection } from 'common/mappers';
- import { GlobalStateContext } from 'core/context';

+ // TODO: Now it's not a custom hook, it's a simple function. Maybe we want to trace it on Redux.
+ // In that case, we will need redux-thunk or redux-sagas
- export const useHotelCollection = () => {
+ export const useHotelCollection = (
+   hotelCollection,
+   onUpdateHotelCollection
+ ) => {
- const { state, dispatch } = React.useContext(GlobalStateContext);

  const onFetchHotelCollection = () => {
-   if (state.hotelCollection.length === 0) {
+   if (hotelCollection.length === 0) {
      fetchHotelCollection().then(hotels =>
-       dispatch({
-         hotelCollection: mapCollection(hotels, mapFromApiToVm),
-       })
+       onUpdateHotelCollection(mapCollection(hotels, mapFromApiToVm))
      );
    }
  };

- return { hotelCollection: state.hotelCollection, onFetchHotelCollection };
+ return { onFetchHotelCollection };
};

```

- Update `hotel edit`:

### ./src/pods/hotel-edit/hotel-edit.container.jsx

```diff
import React from 'react';
+ import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
- import { GlobalStateContext } from 'core/context';
import { history, linkRoutes } from 'core/router';
import { createEmptyHotel, createEmptyHotelErrors } from './hotel-edit.vm';
import { formValidation } from './hotel-edit.validation';
import { getCities } from './api';
import { HotelEditComponent } from './hotel-edit.component';
+ import { coreActions } from 'core/store';

const InnerHotelEditContainer = props => {
- const { match } = props;
+ const { hotelId, hotelCollection, onUpdateHotelCollection } = props;
- const { state, dispatch } = React.useContext(GlobalStateContext);
  const [hotel, setHotel] = React.useState(createEmptyHotel());
...

  React.useEffect(() => {
-   const selectedHotel = state.hotelCollection.find(
-     h => h.id === match.params.id
+   const selectedHotel = hotelCollection.find(
+     h => h.id === hotelId
    );
    setHotel(selectedHotel ? selectedHotel : createEmptyHotel());
- }, [match.params.id]);
+ }, [hotelId]);

...

  const handleSave = () => {
    formValidation.validateForm(hotel).then(formValidationResult => {
      if (formValidationResult.succeeded) {
-       const hotelCollection = state.hotelCollection.map(h =>
+       const newHotelCollection = hotelCollection.map(h =>
          h.id === hotel.id
            ? {
                ...hotel,
              }
            : h
        );
-       dispatch({ hotelCollection });
+       onUpdateHotelCollection(newHotelCollection);
        history.push(linkRoutes.hotelCollection);
...
};

- export const HotelEditContainer = withRouter(InnerHotelEditContainer);

+ const mapStateToProps = (state, ownProps) => ({
+   hotelCollection: state.core.hotelCollection,
+   hotelId: ownProps.match.params.id,
+ });

+ const mapDispatchToProps = dispatch => ({
+   onUpdateHotelCollection: hotelCollection =>
+     dispatch(coreActions.onUpdateHotelCollection(hotelCollection)),
+ });

+ export const HotelEditContainer = withRouter(
+   connect(
+     mapStateToProps,
+     mapDispatchToProps
+   )(InnerHotelEditContainer)
+ );

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
