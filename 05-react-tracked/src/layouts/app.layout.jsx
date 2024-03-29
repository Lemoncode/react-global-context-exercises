import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useTracked } from 'core/context';
import { useFlasher } from 'common/hooks';

export const AppLayout = props => {
  const [state] = useTracked();

  return (
    <div>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton color="inherit" aria-label="Menu">
            <AccountCircle />
          </IconButton>
          <Typography ref={useFlasher()} variant="h6" color="inherit">
            {state.login}
          </Typography>
        </Toolbar>
      </AppBar>
      {props.children}
    </div>
  );
};
