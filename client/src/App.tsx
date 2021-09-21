import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import React from 'react';
import { SnackbarProvider } from 'notistack';
import { Main } from './features/main/components/main';
import { ConnectedWeb3 } from './contexts/connectedWeb3';

function getLibrary(provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc, connector: any) {
  return new ethers.providers.Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
}

const App: React.FC = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ConnectedWeb3>
          <Main />
        </ConnectedWeb3>
      </Web3ReactProvider>
    </SnackbarProvider>
  );
}

export default App;
