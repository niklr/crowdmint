import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers';
import React from 'react';
import { Main } from './features/main/components/main';

function getLibrary(provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc, connector: any) {
  return new ethers.providers.Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
}

const App: React.FC = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Main />
    </Web3ReactProvider>
  );
}

export default App;