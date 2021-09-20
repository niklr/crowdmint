
import * as React from 'react';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/system';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletType } from '../../../../util/types';
import { getLogger } from '../../../../util/logger';
import { FormatUtil } from '../../../../util/format.util';
import MetaMaskSVG from './img/metamask.svg';

const Icon = styled('span')(`
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: contain;
  display: block;
  height: 22px;
  width: 22px;
`);

const IconMetaMask = styled(Icon)(`
  background-image: url('${MetaMaskSVG}');
`);

const logger = getLogger();

interface Props {
  open: boolean;
  onClose: () => void;
}

export const LoginDialog: React.FC<Props> = (props: Props) => {
  const { onClose, open } = props;

  const context = useWeb3React();
  const { enqueueSnackbar } = useSnackbar();
  const injected = new InjectedConnector({});

  if (context.error) {
    enqueueSnackbar(FormatUtil.formatSnackbarMessage(context.error));
    onClose();
  }

  const isMetamaskEnabled = 'ethereum' in window || 'web3' in window;

  const handleClose = () => {
    onClose();
  };

  const handleClick = (type: WalletType) => {
    switch (type) {
      case WalletType.MetaMask:
        if (!isMetamaskEnabled) {
          enqueueSnackbar(FormatUtil.formatSnackbarMessage('Metamask is not enabled'));
          break;
        }
        context.activate(injected, (error) => {
          enqueueSnackbar(FormatUtil.formatSnackbarMessage(error));
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    logger.info('Account address:', context.account)();
    if (context.account) {
      onClose()
    }
  }, [context, onClose])

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Connect Wallet</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem autoFocus button onClick={() => handleClick(WalletType.MetaMask)}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: grey[200] }}>
              <IconMetaMask />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Metamask" />
        </ListItem>
      </List>
    </Dialog>
  )
}
