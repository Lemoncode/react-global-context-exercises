# 04 React tracked

In this example we will manage globlal state using [react-tracked](https://github.com/dai-shi/react-tracked).

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) if they are not already installed on your computer.

## Steps to build it

- Copy the content of the `00-boiler` folder to an empty folder for the sample.

- Install the npm packages described in the [./package.json](./package.json) and verify that it works:

```bash
npm install
```

- This time, we will install [react-tracked](https://github.com/dai-shi/react-tracked) to manage React context without performance issues:

```bash
npm install react-tracked --save
```

- Let's refactor `global.context`:

### ./src/core/context/global-state.context.jsx

```diff
import React from 'react';
+ import { createContainer } from 'react-tracked';

+ const useValue = ({ reducer, initialState }) =>
+   React.useReducer(reducer, initialState);

+ const { Provider, useTracked } = createContainer(useValue);

+ export { useTracked };

const createDefaultState = () => ({
  login: '',
  hotelCollection: [],
});

- export const GlobalStateContext = React.createContext({
-   state: createDefaultState(),
-   dispatch: () => {
-     console.warn(
-       'if you are reading this, likely you forgot to add the provider on top of your app'
-     );
-   },
- });

const reducer = (state = createDefaultState(), newValue) => ({
  ...state,
  ...newValue,
});

export const GlobalStateProvider = props => {
  const { children } = props;
- const [state, dispatch] = React.useReducer(reducer, createDefaultState());

  return (
-   <GlobalStateContext.Provider value={{ state, dispatch }}>
+   <Provider reducer={reducer} initialState={createDefaultState()}>
      {children}
-   </GlobalStateContext.Provider>
+   </Provider>
  );
};

```

- Update `app.layout`:

### ./src/layouts/app.layout.jsx

```diff
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
- import { GlobalStateContext } from 'core/context';
+ import { useTracked } from 'core/context';
import { useFlasher } from 'common/hooks';

export const AppLayout = props => {
- const { state } = React.useContext(GlobalStateContext);
+ const [state] = useTracked();
...

```

- Update `login`:

### ./src/pods/login/login.container.jsx

```diff
import React from 'react';
import { LoginComponent } from './login.component';
import { linkRoutes, history } from 'core/router';
- import { GlobalStateContext } from 'core/context';
+ import { useTracked } from 'core/context';
...

export const LoginContainer = props => {
- const { dispatch } = React.useContext(GlobalStateContext);
+ const [state, dispatch] = useTracked();
...

```

- Update `hotel collection`:

### ./src/pods/hotel-collection/use-hotel-collection.hook.jsx

```diff
import React from 'react';
import { fetchHotelCollection } from './hotel-collection.api';
import { mapFromApiToVm } from './hotel-collection.mapper';
import { mapCollection } from 'common/mappers';
- import { GlobalStateContext } from 'core/context';
+ import { useTracked } from 'core/context';

export const useHotelCollection = () => {
- const { state, dispatch } = React.useContext(GlobalStateContext);
+ const [state, dispatch] = useTracked();

...

```

- Update `hotel edit`:

### ./src/pods/hotel-edit/hotel-edit.container.jsx

```diff
import React from 'react';
import { withRouter } from 'react-router-dom';
- import { GlobalStateContext } from 'core/context';
+ import { useTracked } from 'core/context';
...

const InnerHotelEditContainer = props => {
  const { match } = props;
- const { state, dispatch } = React.useContext(GlobalStateContext);
+ const [state, dispatch] = useTracked();
...

```

> NOTE: Update component state in GlobalStateProvider > Anonymous

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
