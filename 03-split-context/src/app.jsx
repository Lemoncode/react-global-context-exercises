import React from 'react';
import { hot } from 'react-hot-loader/root';
import { RouterComponent } from 'core/router';
import { GlobalStateProvider } from 'core/context';

const App = () => {
  return (
    <GlobalStateProvider>
      <RouterComponent />
    </GlobalStateProvider>
  );
};

export default hot(App);
