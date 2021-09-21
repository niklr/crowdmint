import React from 'react';
import { Paper, styled, Typography } from '@mui/material';

const DefaultPaper = styled(Paper)(
  ({ theme }) => `
  padding: ${theme.spacing(1, 1, 1)};
  margin: ${theme.spacing(0, 0, 8)};
  white-space: pre-line;
`,
);

const ErrorPaper = styled(DefaultPaper)(
  ({ theme }) => `
  background-color: ${theme.palette.error.main};
  color: #fff;
  padding: ${theme.spacing(1, 1, 1)};
  white-space: pre-line;
`,
);

export const NetworkCheck = () => {
  return (
    <>
      <ErrorPaper>
        <Typography variant="h5" align="center">
          The selected network is not supported.
        </Typography>
      </ErrorPaper>
      <Typography align="center" gutterBottom>
        Add the following network to your MetaMask:
      </Typography>
      <DefaultPaper>
        <Typography align="center" sx={{ whiteSpace: 'pre-line' }}>
          <code>
            {`Network Name: Godwoken Testnet
          RPC URL: https://godwoken-testnet-web3-rpc.ckbapp.dev
          Chain ID: 71393
          Currency Symbol: Leave Empty
          Block Explorer URL: Leave Empty`}
          </code>
        </Typography>
      </DefaultPaper>
    </>
  );
}
