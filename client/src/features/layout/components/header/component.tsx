import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Button, Link, styled, Toolbar, Typography } from '@mui/material';
import { CommonConstants } from '../../../../common/constants';
import { LoginDialog } from '../../../main/components/login';

const Root = styled('div')(
  ({ theme }) => `
  flex-grow: 1;
`,
);

const TitleTypography = styled(Typography)(
  ({ theme }) => `
  flex-grow: 1;
  margin-left: 10px !important;
`,
);

export const Header: React.FC = (props: any) => {
  const [connected, setConnected] = React.useState(false);
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Root>
      <AppBar position="static">
        <Toolbar>
          {/* <img src={"./logo_white.png"} alt="logo" width="30" /> */}
          <TitleTypography variant="h6">
            <Link color="inherit" component={RouterLink} to="/" underline="none">
              {CommonConstants.APP_NAME}
            </Link>
          </TitleTypography>
          {connected ? (
            <Button color="inherit">
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={handleClickOpen}>
              Login
            </Button>
          )}
          <LoginDialog open={open}
            onClose={handleClose}></LoginDialog>
        </Toolbar>
      </AppBar>
    </Root>
  )
}