import React, { useCallback, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { CommonConstants } from '../common/constants';
import { getLogger } from '../util/logger';
import { WalletType } from '../util/types';

const logger = getLogger();

export interface ConnectedWeb3Context {
  account: Maybe<string>,
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

  const { activate, deactivate } = context;

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
        logger.info('Account address:', await injected.getAccount())();
        localStorage.setItem(CommonConstants.WALLET_CONNECTOR_STORAGE_KEY, type);
        break;
      default:
        break;
    }
    window.location.reload();
  }, [activate]);

  const logout = useCallback(() => {
    deactivate();
    localStorage.removeItem(CommonConstants.WALLET_CONNECTOR_STORAGE_KEY);
    window.location.reload();
  }, [deactivate]);

  useEffect(() => {
    const connector = localStorage.getItem(CommonConstants.WALLET_CONNECTOR_STORAGE_KEY);
    const connectWalletAsync = async () => {
      let account = undefined;
      if (connector) {
        const injected = new InjectedConnector({});
        account = await injected.getAccount();
        logger.info('Account address:', account)();
        await activate(injected, (error) => {
          logger.info(error)();
          localStorage.removeItem(CommonConstants.WALLET_CONNECTOR_STORAGE_KEY);
        });
      }
      setConnection({
        account,
        login,
        logout
      });
    }
    connectWalletAsync();
  }, [activate, deactivate, login, logout]);

  if (!connection) {
    return null;
  }

  const value = {
    ...connection
  }

  return <ConnectedWeb3Context.Provider value={value}>{props.children}</ConnectedWeb3Context.Provider>
}