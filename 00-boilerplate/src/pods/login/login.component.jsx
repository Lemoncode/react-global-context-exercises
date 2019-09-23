import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { TextFieldForm } from 'common/components';
import { useStyles } from './login.component.styles';

export const LoginComponent = props => {
  const { onLogin, credentials, onUpdateCredentials, credentialErrors } = props;

  const classes = useStyles();

  return (
    <Card>
      <CardHeader title="Login" />
      <CardContent>
        <div className={classes.formContainer}>
          <TextFieldForm
            label="Name"
            name="login"
            value={credentials.login}
            onChange={onUpdateCredentials}
            error={credentialErrors.login.message}
          />
          <TextFieldForm
            label="Password"
            type="password"
            name="password"
            value={credentials.password}
            onChange={onUpdateCredentials}
            error={credentialErrors.password.message}
          />
          <Button variant="contained" color="primary" onClick={onLogin}>
            Login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
