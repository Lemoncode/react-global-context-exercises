# 01 Routing

In this example we will configure react-router

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) if they are not already installed on your computer.

## Steps to build it

- Copy the content of the `00-boiler` folder to an empty folder for the sample.

- Install the npm packages described in the [./package.json](./package.json) and verify that it works:

```bash
npm install
```

- We have to install [react-router-dom](https://github.com/ReactTraining/react-router):

```bash
npm install react-router-dom history --save
```

- The best place to configure this metchanism is `core` folder:

### ./src/core/router/router.component.jsx

```javascript
import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { LoginScene, HotelCollectionScene, HotelEditScene } from 'scenes';

export const RouterComponent = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact={true} path="/" component={LoginScene} />
        <Route exact={true} path="/hotels" component={HotelCollectionScene} />
        <Route path="/hotels/:id" component={HotelEditScene} />
      </Switch>
    </HashRouter>
  );
};
```

- Create the barrel file:

### ./src/core/router/index.js

```javascript
export * from './router.component';
```

- And use it:

### ./src/app.jsx

```diff
import React from 'react';
import { hot } from 'react-hot-loader/root';
import { SessionProvider } from 'core/session.context';
- import { LoginScene, HotelCollectionScene, HotelEditScene } from 'scenes';
+ import { RouterComponent } from 'core/router';

const App = () => {
  return (
    <SessionProvider>
-     <LoginScene />
-     <HotelCollectionScene />
-     <HotelEditScene />
+     <RouterComponent />
    </SessionProvider>
  );
};

export default hot(App);

```

- We can use `Link` components, to navigate from `login` to `hotel-collection`:

### ./src/pods/login/login.container.jsx

```diff
import React from 'react';
+ import { Link } from 'react-router-dom';
import { LoginComponent } from './login.component';
...
  return (
+   <>
      <LoginComponent
        onLogin={handleLogin}
        credentials={credentials}
        onUpdateCredentials={handleUpdateCredentials}
        credentialErrors={credentialErrors}
      />
+     <Link to="/hotels">Navigate to hotels</Link>
+   </>
  );
};
```

- And we could use `/login` route if we want to go back to login page:

### ./src/pods/hotel-collection/hotel-collection.container.jsx

```diff
import React from 'react';
+ import { Link } from 'react-router-dom';
import { HotelCollectionComponent } from './hotel-collection.component';
...

  return (
+   <>
+     <Link to="/login">Navigate to login</Link>
      <HotelCollectionComponent
        hotelCollection={hotelCollection}
        onEditHotel={handleEditHotel}
      />
+   </>
  );
```

- So, we need an alias:

```diff
import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { LoginScene, HotelCollectionScene, HotelEditScene } from 'scenes';

export const RouterComponent = () => {
  return (
    <HashRouter>
      <Switch>
-       <Route exact={true} path="/" component={LoginScene} />
+       <Route exact={true} path={['/', '/login']} component={LoginScene} />
        <Route exact={true} path="/hotels" component={HotelCollectionScene} />
        <Route path="/hotels/:id" component={HotelEditScene} />
      </Switch>
    </HashRouter>
  );
};

```

- As last step we will remove harcoded routes entries, and wrap all the routes in a const file (note down we need to add additional plumbing because routes definitions are different from links if you have to handle parameters), just to check how this works we will include a route that we will use in the future:

### ./src/core/router/routes.js

```javascript
import { generatePath } from 'react-router-dom';

export const routes = {
  root: '/',
  login: '/login',
  hotelCollection: '/hotels',
  hotelEdit: '/hotels/:id',
};

export const linkRoutes = {
  ...routes,
  hotelEdit: id => generatePath(routes.hotelEdit, { id }),
};

```

- Add file to barrel:

### ./src/core/router/index.js

```diff
export * from './router.component';
+ export * from './routes';

```

- And use it:

### ./src/core/router/router.component.js

```diff
import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { LoginScene, HotelCollectionScene, HotelEditScene } from 'scenes';
+ import { routes } from './routes';

export const RouterComponent = () => {
  return (
    <HashRouter>
      <Switch>
        <Route
          exact={true}
-         path={['/', '/login']}
+         path={[routes.root, routes.login]}
          component={LoginScene}
        />
        <Route
          exact={true}
-         path="/hotels"
+         path={routes.hotelCollection}
          component={HotelCollectionScene}
        />
-       <Route path="/hotels/:id" component={HotelEditScene} />
+       <Route path={routes.hotelEdit} component={HotelEditScene} />
      </Switch>
    </HashRouter>
  );
};

```

- Finally, we will create an `history` object to decouple `Router` from history and to navigate programmatically without `Link` component:

### ./src/core/router/history.js

```javascript
import { createHashHistory } from 'history';

export const history = createHashHistory();
```

- Update barrel:

### ./src/core/router/index.js

```diff
export * from './router.component';
export * from './routes';
+ export * from './history';

```

- Update `router` component:

### ./src/core/router/router.component.jsx

```diff
import React from 'react';
- import { HashRouter, Route, Switch } from 'react-router-dom';
+ import { Router, Route, Switch } from 'react-router-dom';
+ import { history } from './history';
import { LoginScene, HotelCollectionScene, HotelEditScene } from 'scenes';
import { routes } from './routes';

export const RouterComponent = () => {
  return (
-   <HashRouter>
+   <Router history={history}>
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
-   </HashRouter>
+   </Router>
  );
};

```

- Now, we could add programmatically navigation:

### ./src/pods/login/login.container.jsx

```diff
import React from 'react';
- import { Link } from 'react-router-dom';
+ import { linkRoutes, history } from 'core/router';
import { LoginComponent } from './login.component';
...
const handleValidateCredentials = () => {
    validateCredentials(credentials.login, credentials.password).then(
      areValidCredentials => {
        if (areValidCredentials) {
          sessionContext.onUpdateLogin(credentials.login);
-         // TODO: navigate hotelCollection
+         history.push(linkRoutes.hotelCollection);
        } else {
          alert(
            'invalid credentials, use admin/test, excercise: display a mui snackbar instead of this alert.'
          );
        }
      }
    );
  };
...


  return (
-   <>
      <LoginComponent
        onLogin={handleLogin}
        credentials={credentials}
        onUpdateCredentials={handleUpdateCredentials}
        credentialErrors={credentialErrors}
      />
-     <Link to="/hotels">Navigate to hotels</Link>
-   </>
  );
```

- Update `hotel-collection`:

### ./src/pods/hotel-collection/hotel-collection.container.jsx

```diff
import React from 'react';
- import { Link } from 'react-router-dom';
+ import { linkRoutes, history } from 'core/router';
import { HotelCollectionComponent } from './hotel-collection.component';
...

  const handleEditHotel = hotelId => {
-   // TODO: Navigate hotelEdit
+   const route = linkRoutes.hotelEdit(hotelId);
+   history.push(route);
  };
...

  return (
-   <>
-     <Link to="/login">Navigate to login</Link>
      <HotelCollectionComponent
        hotelCollection={hotelCollection}
        onEditHotel={handleEditHotel}
      />
-   </>
  );
```

- Update `hotel-collection`:

### ./src/pods/hotel-collection/hotel-collection.container.jsx

```diff
import React from 'react';
+ import { history, linkRoutes } from 'core/router';
import { createEmptyHotel, createEmptyHotelErrors } from './hotel-edit.vm';

...

  const handleSave = () => {
    formValidation.validateForm(hotel).then(formValidationResult => {
      if (formValidationResult.succeeded) {
-       // TODO: navigate hotelCollection
+       history.push(linkRoutes.hotelCollection);
      } else {
        setHotelErrors(formValidationResult.fieldErrors);
      }
    });
  };
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
