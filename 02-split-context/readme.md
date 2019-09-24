# 02 Split context

In this example we will split the global state to avoid unnecessary re-renders.

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) if they are not already installed on your computer.

## Steps to build it

- Copy the content of the `00-boiler` folder to an empty folder for the sample.

- Install the npm packages described in the [./package.json](./package.json) and verify that it works:

```bash
npm install
```

- On this approach, we will split in different contexts:

### ./src/core/context/global-state.context.jsx

```diff
import React from 'react';

- const createDefaultState = () => ({
-   login: '',
-   hotelCollection: [],
- });

- export const GlobalStateContext = React.createContext({
-   state: createDefaultState(),
-   dispatch: () => {
-     console.warn(
-       'if you are reading this, likely you forgot to add the provider on top of your app'
-     );
-   },
- });

- const reducer = (state = createDefaultState(), newValue) => ({
-   ...state,
-   ...newValue,
- });
+ const createEmptyLoginState = () => ({
+   login: '',
+ });

+ export const LoginContext = React.createContext({
+   state: createEmptyLoginState(),
+   dispatch: () => {},
+ });

+ const createEmptyHotelCollectionState = () => ({
+   hotelCollection: [],
+ });

+ export const HotelCollectionContext = React.createContext({
+   state: createEmptyHotelCollectionState(),
+   dispatch: () => {},
+ });

export const GlobalStateProvider = props => {
  const { children } = props;
- const [state, dispatch] = React.useReducer(reducer, createDefaultState());
+ const [loginState, setLoginState] = React.useState(createEmptyLoginState());
+ const loginValue = React.useMemo(
+   () => ({ state: loginState, dispatch: setLoginState }),
+   [loginState]
+ );

+ const [hotelCollectionState, setHotelCollectionState] = React.useState(
+   createEmptyHotelCollectionState()
+ );
+ const hotelCollectionValue = React.useMemo(
+   () => ({ state: hotelCollectionState, dispatch: setHotelCollectionState }),
+   [hotelCollectionState]
+ );

  return (
-   <GlobalStateContext.Provider value={{ state, dispatch }}>
+   <LoginContext.Provider value={loginValue}>
+     <HotelCollectionContext.Provider
+       value={hotelCollectionValue}
+     >
      {children}
-   </GlobalStateContext.Provider>
+     </HotelCollectionContext.Provider>
+   </LoginContext.Provider>
  );
};

```

- Now, we only have to use each `context`:

### ./src/layouts/app.layout.jsx

```diff
...
- import { GlobalStateContext } from 'core/context';
+ import { LoginContext } from 'core/context';
import { useFlasher } from 'common/hooks';

export const AppLayout = props => {
- const { state } = React.useContext(GlobalStateContext);
+ const { state } = React.useContext(LoginContext);

...
```

### ./src/pods/login/login.container.jsx

```diff
...
- import { GlobalStateContext } from 'core/context';
+ import { LoginContext } from 'core/context';
...

export const LoginContainer = props => {
- const { dispatch } = React.useContext(GlobalStateContext);
+ const { dispatch } = React.useContext(LoginContext);
...

```

- And `HotelCollectionContext`:

### ./src/pods/login/login.container.jsx

```diff
...
import { mapCollection } from 'common/mappers';
- import { GlobalStateContext } from 'core/context';
+ import { HotelCollectionContext } from 'core/context';

export const useHotelCollection = () => {
- const { state, dispatch } = React.useContext(GlobalStateContext);
+ const { state, dispatch } = React.useContext(HotelCollectionContext);
...
```

### ./src/pods/login/login.container.jsx

```diff
...
- import { GlobalStateContext } from 'core/context';
+ import { HotelCollectionContext } from 'core/context';
...
const InnerHotelEditContainer = props => {
  const { match } = props;
- const { state, dispatch } = React.useContext(GlobalStateContext);
+ const { state, dispatch } = React.useContext(HotelCollectionContext);
...
```

- We avoid re-renders with this approach but this could be verbose in several scenarios.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
