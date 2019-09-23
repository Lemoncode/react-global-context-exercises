import React from 'react';
import { LoginComponent } from './login.component';
import { linkRoutes, history } from 'core/router';
import {
  createEmptyCredentials,
  createEmptyCredentialErrors,
} from './login.vm';
import { validateCredentials } from './api';
import { formValidation } from './login.validation';

export const LoginContainer = props => {
  // const loginContext = React.useContext(SessionContext);
  const [credentialErrors, setCredentialErrors] = React.useState(
    createEmptyCredentialErrors()
  );

  const [credentials, setCredentials] = React.useState(
    createEmptyCredentials()
  );

  const handleValidateCredentials = () => {
    validateCredentials(credentials.login, credentials.password).then(
      areValidCredentials => {
        if (areValidCredentials) {
          // loginContext.updateLogin(credentials.login);
          history.push(linkRoutes.hotelCollection);
        } else {
          alert(
            'invalid credentials, use admin/test, excercise: display a mui snackbar instead of this alert.'
          );
        }
      }
    );
  };
  // TODO: Excercise refactor this method follow SRP
  const handleLogin = () => {
    formValidation.validateForm(credentials).then(formValidationResult => {
      if (formValidationResult.succeeded) {
        handleValidateCredentials();
      } else {
        setCredentialErrors(formValidationResult.fieldErrors);
      }
    });
  };

  const handleUpdateCredentials = (name, value) => {
    setCredentials({
      ...credentials,
      [name]: value,
    });

    formValidation.validateField(name, value).then(validationResult => {
      setCredentialErrors({
        ...credentialErrors,
        [name]: validationResult,
      });
    });
  };

  return (
    <LoginComponent
      onLogin={handleLogin}
      credentials={credentials}
      onUpdateCredentials={handleUpdateCredentials}
      credentialErrors={credentialErrors}
    />
  );
};