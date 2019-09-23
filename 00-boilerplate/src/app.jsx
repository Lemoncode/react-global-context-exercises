import React from 'react';
import { hot } from 'react-hot-loader/root';
import { RouterComponent } from 'core/router';
import { SessionProvider } from 'core/session.context';

const App = () => {
  return (
    <SessionProvider>
      <RouterComponent />
    </SessionProvider>
  );
};

export default hot(App);
