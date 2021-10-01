import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Button, Chip, Link, styled, Toolbar, Tooltip, Typography } from '@mui/material';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import { CommonConstants } from '../../../../common/constants';
import { LoginDialog } from '../../../main/components/login';
import { useConnectedWeb3Context } from '../../../../contexts/connectedWeb3';
import { CommonUtil } from '../../../../util/common.util';
import { TransformUtil } from '../../../../util/transform.util';

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

  const truncateAddress = (address?: string) => {
    return CommonUtil.truncateStringInTheMiddle(address, 10, 5)
  }

  return (
    <Root>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <img src={"./assets/images/logo_64x64.png"} alt="logo" width="30" />
          <TitleTypography variant="h6">
            <Link color="inherit" component={RouterLink} to="/" underline="none">
              {CommonConstants.APP_NAME}
            </Link>
          </TitleTypography>
          {context.account ? (
            <>
              <Tooltip title={
                <React.Fragment>
                  <p>Ethereum address: {context.account}</p>
                  <p>Polyjuice address: {TransformUtil.toGodwokenAddress(context.account)}</p>
                </React.Fragment>
              } placement="bottom" arrow>
                <Chip icon={<AccountCircleTwoToneIcon />} label={truncateAddress(context.account)} variant="outlined" />
              </Tooltip>
              <Button color="inherit" onClick={handleClickLogout}>
                Logout
              </Button>
            </>
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