import React from 'react';
import { createContainer } from 'react-tracked';

const useValue = ({ reducer, initialState }) =>
  React.useReducer(reducer, initialState);

const { Provider, useTracked } = createContainer(useValue);

export { useTracked };

const createDefaultState = () => ({
  login: '',
  hotelCollection: [],
});

const reducer = (state = createDefaultState(), newValue) => ({
  ...state,
  ...newValue,
});

export const GlobalStateProvider = props => {
  const { children } = props;

  return (
    <Provider reducer={reducer} initialState={createDefaultState()}>
      {children}
    </Provider>
  );
};
