import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import { AppBar, Button, Chip, styled, Toolbar, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { CommonConstants } from '../../../../common/constants';
import { getCommonContext } from '../../../../contexts/common.context';
import { useConnectedWeb3Context } from '../../../../contexts/connectedWeb3';
import { CommonUtil } from '../../../../util/common.util';
import { LoginDialog } from '../../../main/components/login';

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
  const commonContext = getCommonContext();
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

  const showAlternateAddress = () => {
    return commonContext.datasource.util.toAlternateAddress(context.account)?.toLowerCase() !== context.account?.toLowerCase();
  }

  return (
    <Root>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <img src={"./assets/images/logo_64x64.png"} alt="logo" width="30" />
          <TitleTypography variant="h6">
            <a href="/" style={{ color: "inherit", textDecoration: "inherit" }}>
              {CommonConstants.APP_NAME}
            </a>
          </TitleTypography>
          {context.account ? (
            <>
              <Tooltip title={
                <React.Fragment>
                  <p>Account address: {context.account}</p>
                  {showAlternateAddress() && (
                    <p>{commonContext.datasource.util.alternateAddressName} address: {commonContext.datasource.util.toAlternateAddress(context.account)}</p>
                  )}
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