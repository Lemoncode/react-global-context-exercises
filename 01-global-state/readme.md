# 01 Global state

In this example we will create a global state to manage app state (login, hotels, edit hotel, etc.)

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) if they are not already installed on your computer.

## Steps to build it

- Copy the content of the `00-boiler` folder to an empty folder for the sample.

- Install the npm packages described in the [./package.json](./package.json) and verify that it works:

```bash
npm install
```

- We need to share the state between different `scenes`, so we could start creating a global state. We will replace the current `session.context`, (remove file):

### ./src/core/context/global-state.context.jsx

```javascript
import React from 'react';

const createDefaultState = () => ({
  login: '',
  hotelCollection: [],
});

export const GlobalStateContext = React.createContext({
  state: createDefaultState(),
  dispatch: () => {
    console.warn(
      'if you are reading this, likely you forgot to add the provider on top of your app'
    );
  },
});

const reducer = (state = createDefaultState(), newValue) => ({
  ...state,
  ...newValue,
});

export const GlobalStateProvider = props => {
  const { children } = props;
  const [state, dispatch] = React.useReducer(reducer, createDefaultState());

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
```

- Add `barrel` file:

### ./src/core/context/index.js

```javascript
export * from './global-state.context';
```

- Update `app` to use `provider`:

### ./src/app.jsx

```diff
import React from 'react';
import { hot } from 'react-hot-loader/root';
import { RouterComponent } from 'core/router';
- import { SessionProvider } from 'core/session.context';
+ import { GlobalStateProvider } from 'core/context';

const App = () => {
  return (
-   <SessionProvider>
+   <GlobalStateProvider>
      <RouterComponent />
-   </SessionProvider>
+   </GlobalStateProvider>
  );
};
...

```

- Finally, we have to use `GlobalStateContext` instead of `SessionContext`:

### ./src/layouts/app.layout.jsx

```diff
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
- import { SessionContext } from 'core/session.context';
+ import { GlobalStateContext } from 'core/context';

export const AppLayout = props => {
- const { login } = React.useContext(SessionContext);
+ const { state } = React.useContext(GlobalStateContext);

  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton color="inherit" aria-label="Menu">
            <AccountCircle />
          </IconButton>
          <Typography variant="h6" color="inherit">
-           {login}
+           {state.login}
          </Typography>
        </Toolbar>
      </AppBar>
      {props.children}
    </div>
  );
};

```

- Update `login` pod:

### ./src/pods/login/login.container.jsx

```diff
import React from 'react';
import { LoginComponent } from './login.component';
import { linkRoutes, history } from 'core/router';
- import { SessionContext } from 'core/session.context';
+ import { GlobalStateContext } from 'core/context';
...

export const LoginContainer = props => {
- const sessionContext = React.useContext(SessionContext);
+ const { dispatch } = React.useContext(GlobalStateContext);
...

  const handleValidateCredentials = () => {
    validateCredentials(credentials.login, credentials.password).then(
      areValidCredentials => {
        if (areValidCredentials) {
-         sessionContext.onUpdateLogin(credentials.login);
+         dispatch({ login: credentials.login });
          history.push(linkRoutes.hotelCollection);
...

```

- Now, we just start to update `hotelCollection` state:

### ./src/pods/hotel-collection/use-hotel-collection.hook.jsx

```diff
import React from 'react';
import { fetchHotelCollection } from './hotel-collection.api';
import { mapFromApiToVm } from './hotel-collection.mapper';
import { mapCollection } from 'common/mappers';
+ import { GlobalStateContext } from 'core/context';

export const useHotelCollection = () => {
- const [hotelCollection, setHotelCollection] = React.useState([]);
+ const { state, dispatch } = React.useContext(GlobalStateContext);

- const onFetchHotelCollection = () =>
+ const onFetchHotelCollection = () => {
+   if (state.hotelCollection.length === 0) {
      fetchHotelCollection().then(hotels =>
-       setHotelCollection(mapCollection(hotels, mapFromApiToVm))
+       dispatch({
+         hotelCollection: mapCollection(hotels, mapFromApiToVm),
+       })
      );
+   }
+ };

- return { hotelCollection, onFetchHotelCollection };
+ return { hotelCollection: state.hotelCollection, onFetchHotelCollection };
};

```

> How to check if it's working?
> We could use [react devtools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=es) to see `GlobalStateProvider` state.

- Now, it's time to retrieve select hotel data to update it:

### ./src/pods/hotel-edit/hotel-edit.container.jsx

```diff
import React from 'react';
+ import { withRouter } from 'react-router-dom';
+ import { GlobalStateContext } from 'core/context';
import { history, linkRoutes } from 'core/router';
import { createEmptyHotel, createEmptyHotelErrors } from './hotel-edit.vm';
import { formValidation } from './hotel-edit.validation';
import { getCities } from './api';
import { HotelEditComponent } from './hotel-edit.component';

- export const HotelEditContainer = props => {
+ const InnerHotelEditContainer = props => {
+   const { match } = props;
+   const { state, dispatch } = React.useContext(GlobalStateContext);
...
    React.useEffect(() => {
      getCities().then(setCities);
    }, []);

+   React.useEffect(() => {
+     const selectedHotel = state.hotelCollection.find(
+       h => h.id === match.params.id
+     );
+     setHotel(selectedHotel ? selectedHotel : createEmptyHotel());
+   }, [match.params.id]);

    const handleSave = () => {
      formValidation.validateForm(hotel).then(formValidationResult => {
        if (formValidationResult.succeeded) {
+         const hotelCollection = state.hotelCollection.map(h =>
+           h.id === hotel.id
+             ? {
+                 ...hotel,
+               }
+             : h
+         );
+         dispatch({ hotelCollection });
          history.push(linkRoutes.hotelCollection);
        } else {
...
  };

+ export const HotelEditContainer = withRouter(InnerHotelEditContainer);

```

- It looks like great, now we can edit an hotel and it updates the values on list. But with this approach, there is an issue: `useContext` hook will re-render whenever your context is modified. In other words, every component subscribed to our global state will re-render upon a context change.

- Let's check it:

### ./src/common/hooks/use-flasher.jsx

```javascript
import React from 'react';

export const useFlasher = () => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current.setAttribute(
      'style',
      `box-shadow: 0 0 8px 1px red;
       background-color: tomatoe;
       transition: box-shadow 50ms ease-out;`
    );
    setTimeout(() => ref.current.setAttribute('style', ''), 300);
  });
  return ref;
};
```

- Add `barrel` file:

### ./src/common/hooks/index.js

```javascript
export * from './use-flasher';
```

- Use it:

### ./src/layouts/app.layout.jsx

```diff
...
import { GlobalStateContext } from 'core/context';
+ import { useFlasher } from 'common/hooks';

export const AppLayout = props => {
...
          </IconButton>
-         <Typography variant="h6" color="inherit">
+         <Typography ref={useFlasher()} variant="h6" color="inherit">
            {state.login}
...
```

- Each time, we update the global state, all component where we use it are re-render. Even when we move `AppLayout` at top:

### ./src/scenes/hotel-edit.scene.jsx

```diff
import React from 'react';
- import { AppLayout } from 'layouts';
import { HotelEditContainer } from 'pods/hotel-edit';

export const HotelEditScene = () => (
- <AppLayout>
    <HotelEditContainer />
- </AppLayout>
);

```

### ./src/scenes/hotel-collection.scene.jsx

```diff
import React from 'react';
- import { AppLayout } from 'layouts';
import { HotelCollectionContainer } from 'pods/hotel-collection';

export const HotelCollectionScene = () => (
- <AppLayout>
    <HotelCollectionContainer />
- </AppLayout>
);

```

### ./src/core/router/router.component.jsx

```diff
...
+ import { AppLayout } from '../../layouts/app.layout';

export const RouterComponent = () => {
  return (
+   <AppLayout>
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
+   </AppLayout>
  );
};

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
