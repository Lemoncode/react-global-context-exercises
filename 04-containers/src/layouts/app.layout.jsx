import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { GlobalStateContext } from 'core/context';
import { useFlasher } from 'common/hooks';

const InnerAppLayout = React.memo(props => {
  const { login, children } = props;

  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton color="inherit" aria-label="Menu">
            <AccountCircle />
          </IconButton>
          <Typography ref={useFlasher()} variant="h6" color="inherit">
            {login}
          </Typography>
        </Toolbar>
      </AppBar>
      {children}
    </div>
  );
});

export const AppLayout = props => {
  const { children } = props;
  const { state } = React.useContext(GlobalStateContext);

  return <InnerAppLayout login={state.login}>{children}</InnerAppLayout>;
};
