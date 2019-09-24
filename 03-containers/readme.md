# 03 Containers

In this example we will use containers to get necessary sections of state.

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) if they are not already installed on your computer.

## Steps to build it

- Copy the content of the `01-global-state` folder to an empty folder for the sample.

- Install the npm packages described in the [./package.json](./package.json) and verify that it works:

```bash
npm install
```

- This time, we will keep global state but we will use redux-like `containers` plus `React.memo` (NOT React.useMemo):

### ./src/layouts/app.layout.jsx

```diff
...

- export const AppLayout = props => {
+ const InnerAppLayout = React.memo(props => {
-   const { state } = React.useContext(GlobalStateContext);
+   const { login, children } = props;

  return (
    <div>
      ...
-     {props.children}
+     {children}
    </div>
  );
});
...
- };
+ });

+ export const AppLayout = props => {
+   const { children } = props;
+   const { state } = React.useContext(GlobalStateContext);

+   return <InnerAppLayout login={state.login}>{children}</InnerAppLayout>;
+ };

```

- `Login` pod:

### ./src/pods/login/login.container.jsx

```diff
...

- export const LoginContainer = props => {
+ const InnerLoginContainer = React.memo(props => {
-   const { dispatch } = React.useContext(GlobalStateContext);
+   const { onUpdateLogin } = props;
...

  const handleValidateCredentials = () => {
    validateCredentials(credentials.login, credentials.password).then(
      areValidCredentials => {
        if (areValidCredentials) {
-         dispatch({ login: credentials.login });
+         onUpdateLogin({ login: credentials.login });
          history.push(linkRoutes.hotelCollection);
        } else {
          ...
- };
+ });

+ export const LoginContainer = () => {
+   const { dispatch } = React.useContext(GlobalStateContext);
+   const handleUpdateLogin = React.useCallback(dispatch, []);
+   return <InnerLoginContainer onUpdateLogin={handleUpdateLogin} />;
+ };

```

- `Hotel collection` pod:

### ./src/pods/hotel-collection/hotel-collection.container.jsx

```diff
...

- export const HotelCollectionContainer = props => {
+ const InnerHotelCollectionContainer = React.memo(props => {
-   const { hotelCollection, onFetchHotelCollection } = useHotelCollection();
+   const { hotelCollection, onFetchHotelCollection } = props;

...
- };
+ });

+ export const HotelCollectionContainer = () => {
+   const { hotelCollection, onFetchHotelCollection } = useHotelCollection();

+   const handleFetchHotelCollection = React.useCallback(
+     onFetchHotelCollection,
+     []
+   );

+   return (
+     <InnerHotelCollectionContainer
+       hotelCollection={hotelCollection}
+       onFetchHotelCollection={handleFetchHotelCollection}
+     />
+   );
+ };

```

- `Hotel edit` pod:

### ./src/pods/hotel-edit/hotel-edit.container.jsx

```diff
...

- const InnerHotelEditContainer = props => {
+ const InnerHotelEditContainer = React.memo(props => {
-   const { match } = props;
+   const { id, hotelCollection, onUpdateHotelCollection } = props;
...

  React.useEffect(() => {
-   const selectedHotel = state.hotelCollection.find(
+   const selectedHotel = hotelCollection.find(
-     h => h.id === match.params.id
+     h => h.id === id
    );
    setHotel(selectedHotel ? selectedHotel : createEmptyHotel());
- }, [match.params.id]);
+ }, [id]);

...

  const handleSave = () => {
    formValidation.validateForm(hotel).then(formValidationResult => {
      if (formValidationResult.succeeded) {
-       const hotelCollection = state.hotelCollection.map(h =>
+       const hotelCollection = hotelCollection.map(h =>
          h.id === hotel.id
            ? {
                ...hotel,
              }
            : h
        );
-       dispatch({ hotelCollection });
+       onUpdateHotelCollection({ hotelCollection });
        history.push(linkRoutes.hotelCollection);
      } else {
        setHotelErrors(formValidationResult.fieldErrors);
      }
    });
  };

...
- };
+ });


- export const HotelEditContainer = withRouter(InnerHotelEditContainer);
+ export const HotelEditContainer = withRouter(props => {
+   const { match } = props;
+   const { state, dispatch } = React.useContext(GlobalStateContext);
+   const handleUpdateHotelCollection = React.useCallback(dispatch, []);

+   return (
+     <InnerHotelEditContainer
+       id={match.params.id}
+       hotelCollection={state.hotelCollection}
+       onUpdateHotelCollection={handleUpdateHotelCollection}
+     />
+   );
+ });

```

- This approach is a bit verbose and we always have to remember about use React.memo + useCallback in functions.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
