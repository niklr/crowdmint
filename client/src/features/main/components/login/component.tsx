
import * as React from 'react';
import { useEffect } from 'react';
import { Avatar, Dialog, DialogContent, DialogContentText, DialogTitle, Link, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { grey } from '@mui/material/colors';
import { styled } from '@mui/system';
import { useConnectedWeb3Context } from '../../../../contexts/connectedWeb3';
import { WalletType } from '../../../../util/types';
import { getLogger } from '../../../../util/logger';
import { SnackbarUtil } from '../../../../util/snackbar.util';
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

  const context = useConnectedWeb3Context();

  const { account } = context;

  const handleClose = () => {
    onClose();
  };

  const handleClickAsync = async (type: WalletType) => {
    try {
      await context.login(type);
    } catch (error) {
      SnackbarUtil.enqueueError(error);
    }
  };

  useEffect(() => {
    if (account && open) {
      logger.info('Account address:', account)();
      onClose();
    }
  }, [account, open, onClose])

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="xs">
      <DialogTitle>Connect Wallet</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please install the MetaMask browser plugin and add the Godwoken Testnet as described&nbsp;
          <Link href="https://github.com/niklr/crowdmint#setup-godwoken-network-in-metamask-" target="_blank">here</Link >.
        </DialogContentText>
        <List sx={{ pt: 2 }}>
          <ListItem autoFocus button onClick={() => handleClickAsync(WalletType.MetaMask)}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: grey[200] }}>
                <IconMetaMask />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Metamask" />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  )
}
