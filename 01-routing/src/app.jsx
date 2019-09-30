import React from 'react';
import { hot } from 'react-hot-loader/root';
import { SessionProvider } from 'core/session.context';
import { RouterComponent } from 'core/router';

const App = () => {
  return (
    <SessionProvider>
      <RouterComponent />
    </SessionProvider>
  );
};

export default hot(App);
