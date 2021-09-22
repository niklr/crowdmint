import { Web3ReactProvider } from '@web3-react/core';
import styled from '@emotion/styled';
import { ethers } from 'ethers';
import React from 'react';
import { SnackbarProvider } from 'notistack';
import { Main } from './features/main/components/main';
import { ConnectedWeb3 } from './contexts/connectedWeb3';
import BackgroundSVG from './bg.svg';

function getLibrary(provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc, connector: any) {
  return new ethers.providers.Web3Provider(provider)
}

const Background = styled('div')(`
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url('${BackgroundSVG}');
`,
);

const App: React.FC = () => {
  return (
    <Background>
      <SnackbarProvider maxSnack={3}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <ConnectedWeb3>
            <Main />
          </ConnectedWeb3>
        </Web3ReactProvider>
      </SnackbarProvider>
    </Background>
  );
}

export default App;
