import React from 'react';

const createEmptyLoginState = () => ({
  login: '',
});

export const LoginContext = React.createContext({
  state: createEmptyLoginState(),
  dispatch: () => {},
});

const createEmptyHotelCollectionState = () => ({
  hotelCollection: [],
});

export const HotelCollectionContext = React.createContext({
  state: createEmptyHotelCollectionState(),
  dispatch: () => {},
});

export const GlobalStateProvider = props => {
  const { children } = props;
  const [loginState, setLoginState] = React.useState(createEmptyLoginState());
  const loginValue = React.useMemo(
    () => ({ state: loginState, dispatch: setLoginState }),
    [loginState]
  );

  const [hotelCollectionState, setHotelCollectionState] = React.useState(
    createEmptyHotelCollectionState()
  );
  const hotelCollectionValue = React.useMemo(
    () => ({ state: hotelCollectionState, dispatch: setHotelCollectionState }),
    [hotelCollectionState]
  );

  return (
    <LoginContext.Provider value={loginValue}>
      <HotelCollectionContext.Provider value={hotelCollectionValue}>
        {children}
      </HotelCollectionContext.Provider>
    </LoginContext.Provider>
  );
};
