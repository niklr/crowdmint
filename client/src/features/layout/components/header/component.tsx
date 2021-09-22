import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Button, Link, styled, Toolbar, Typography } from '@mui/material';
import { CommonConstants } from '../../../../common/constants';
import { LoginDialog } from '../../../main/components/login';
import { useConnectedWeb3Context } from '../../../../contexts/connectedWeb3';

const Root = styled('div')(
  ({ theme }) => `
  flex-grow: 1;
`);

const TitleTypography = styled(Typography)(
  ({ theme }) => `
  flex-grow: 1;
  margin-left: 10px !important;
`);

export const Header: React.FC = (props: any) => {
  const context = useConnectedWeb3Context();
  const [loginOpen, setLoginOpen] = React.useState(false);

  const handleClickLogin = () => {
    setLoginOpen(true);
  };

  const handleClickLogout = () => {
    context.logout();
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  return (
    <Root>
      <AppBar position="static" color="primary">
        <Toolbar>
          {/* <img src={"./logo_white.png"} alt="logo" width="30" /> */}
          <TitleTypography variant="h6">
            <Link color="inherit" component={RouterLink} to="/" underline="none">
              {CommonConstants.APP_NAME}
            </Link>
          </TitleTypography>
          {context.account ? (
            <Button color="inherit" onClick={handleClickLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={handleClickLogin}>
              Login
            </Button>
          )}
          <LoginDialog open={loginOpen} onClose={handleLoginClose}></LoginDialog>
        </Toolbar>
      </AppBar>
    </Root>
  )
}