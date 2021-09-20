
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/system';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import MetaMaskSVG from './img/metamask.svg';
import { WalletType } from '../../../../util/types';
import { getLogger } from '../../../../util/logger';

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
  const injected = new InjectedConnector({});

  if (context.error) {
    logger.error('Error in web3 context', context.error)
    onClose();
  }

  const isMetamaskEnabled = 'ethereum' in window || 'web3' in window;

  const handleClose = () => {
    onClose();
  };

  const handleClick = (type: WalletType) => {
    console.log(type, context.connector);
    switch (type) {
      case WalletType.MetaMask:
        if (!isMetamaskEnabled) {
          // TODO: show snackbar
          console.log('Metamask is not enabled');
        }
        context.activate(injected, (error) => {
          console.log(error);
        });
        break;
      default:
        break;
    }
  };

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
