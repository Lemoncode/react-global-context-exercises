import React from 'react';
import { hot } from 'react-hot-loader/root';
import { SessionProvider } from 'core/session.context';
import { LoginScene, HotelCollectionScene, HotelEditScene } from 'scenes';

const App = () => {
  return (
    <SessionProvider>
      <LoginScene />
      <HotelCollectionScene />
      <HotelEditScene />
    </SessionProvider>
  );
};

export default hot(App);
