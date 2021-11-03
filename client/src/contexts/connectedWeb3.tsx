import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import React, { useCallback, useEffect, useState } from 'react';
import { CommonConstants } from '../common/constants';
import { getAccountStorage } from '../storage';
import { getLogger } from '../util/logger';
import { WalletType } from '../util/types';
import { getCommonContext } from './common.context';

const logger = getLogger();

export interface ConnectedWeb3Context {
  account: Maybe<string>,
  chainId: Maybe<number>,
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
  const commonContext = getCommonContext();
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
      const initAsync = async () => {
        logger.info('Init ConnectedWeb3')()
        try {
          setConnection(null)
          await commonContext.initAsync()
          setConnection({
            account,
            chainId,
            login,
            logout
          });
        } catch (error) {
          logger.error(error)();
        }
      }
      initAsync();
    }
    connectWalletAsync();
  }, [activate, deactivate, login, logout, commonContext, accountStorage, account, chainId]);

  if (!connection) {
    return null;
  }

  const value = {
    ...connection
  }

  return <ConnectedWeb3Context.Provider value={value}>{props.children}</ConnectedWeb3Context.Provider>
}