import React from 'react';

const createDefaultContext = () => ({
  login: 'no user',
  onUpdateLogin: value => {
    console.warn(
      'if you are reading this, likely you forgot to add the provider on top of your app'
    );
  },
});

export const SessionContext = React.createContext(createDefaultContext());

export const SessionProvider = props => {
  const { children } = props;
  const [login, setLogin] = React.useState('');

  return (
    <SessionContext.Provider value={{ login, onUpdateLogin: setLogin }}>
      {children}
    </SessionContext.Provider>
  );
};
