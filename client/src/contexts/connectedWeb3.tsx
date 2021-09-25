import React, { useCallback, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { CommonConstants } from '../common/constants';
import { getLogger } from '../util/logger';
import { WalletType } from '../util/types';
import { getAccountStorage } from '../storage';
import { IDataGateway } from '../gateways';
import { getNervosClient } from '../clients/nervos.client';

const logger = getLogger();

export interface ConnectedWeb3Context {
  account: Maybe<string>,
  chainId: Maybe<number>,
  gateway: IDataGateway;
  login: (type: WalletType) => Promise<void>,
  logout: () => void
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const ConnectedWeb3Context = React.createContext<Maybe<ConnectedWeb3Context>>(null)

export const useConnectedWeb3Context = () => {
  const context = React.useContext(ConnectedWeb3Context)

  if (!context) {
    throw new Error('Component rendered outside the provider tree')
  }

  return context
}

interface Props {
  children?: React.ReactNode
}

export const ConnectedWeb3: React.FC<Props> = (props: Props) => {
  const [connection, setConnection] = useState<Maybe<ConnectedWeb3Context>>(null);
  const context = useWeb3React();
  const accountStorage = getAccountStorage();

  const { activate, deactivate, account, chainId } = context;

  const login = useCallback(async (type: WalletType) => {
    switch (type) {
      case WalletType.MetaMask:
        const injected = new InjectedConnector({});
        const isMetamaskEnabled = 'ethereum' in window || 'web3' in window;
        if (!isMetamaskEnabled) {
          throw new Error('Metamask is not enabled');
        }
        await activate(injected, (error) => {
          throw error;
        });
        const account = await injected.getAccount();
        accountStorage.account = account;
        logger.info('Account address:', account)();
        localStorage.setItem(CommonConstants.WALLET_CONNECTOR_STORAGE_KEY, type);
        break;
      default:
        break;
    }
  }, [activate, accountStorage]);

  const logout = useCallback(() => {
    deactivate();
    accountStorage.account = undefined;
    localStorage.removeItem(CommonConstants.WALLET_CONNECTOR_STORAGE_KEY);
    window.location.reload();
  }, [deactivate, accountStorage]);

  useEffect(() => {
    logger.info('Account:', account, 'ChainId:', chainId)();
    const connector = localStorage.getItem(CommonConstants.WALLET_CONNECTOR_STORAGE_KEY);
    const connectWalletAsync = async () => {
      if (!account && connector) {
        const injected = new InjectedConnector({});
        // Don't await here, MetaMask could be locked -> render the page regardless
        activate(injected, (error) => {
          logger.info(error)();
          localStorage.removeItem(CommonConstants.WALLET_CONNECTOR_STORAGE_KEY);
        });
      }
      accountStorage.account = account;
      const gateway = getNervosClient();
      setConnection({
        account,
        chainId,
        gateway,
        login,
        logout
      });
    }
    connectWalletAsync();
  }, [activate, deactivate, login, logout, accountStorage, account, chainId]);

  if (!connection) {
    return null;
  }

  const value = {
    ...connection
  }

  return <ConnectedWeb3Context.Provider value={value}>{props.children}</ConnectedWeb3Context.Provider>
}