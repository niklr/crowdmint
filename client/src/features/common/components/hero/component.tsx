import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Link, Stack, styled, Typography } from '@mui/material';
import { useConnectedWeb3Context } from '../../../../contexts/connectedWeb3';

const HeroContent = styled('div')(
  ({ theme }) => `
  background-color: ${theme.palette.background.paper};
  padding: ${theme.spacing(1, 0, 0)};
`,
);

export const Hero = () => {
  const context = useConnectedWeb3Context();
  const testAsync = async () => {
    if (context.account) {
      const balance = await context.datasource.getBalanceAsync(context.account);
      console.log(context.account, 'Balance:', balance.toString());

      const timestamp = await context.datasource.getTimestampAsync();
      const totalProjects = await context.datasource.getTotalProjectsAsync();
      console.log('ProjectManager timestamp:', timestamp.toString(), 'local timestamp:', Math.floor(Date.now() / 1000), 'totalProjects:', totalProjects.toString());
    }
  }
  testAsync();
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <img src={"./assets/images/logo_text.png"} alt="logo" />
      </Box>
      <HeroContent>
        <Container maxWidth="sm">
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            De-centralized crowdfunding on <Link href="https://www.nervos.org/" target="_blank" underline="none">Nervos Network</Link>.<br></br>
            CROWDMINT is a blockchain based solution leveraging NFT's to crowdfund projects.
          </Typography>
        </Container>
      </HeroContent>
      <Stack spacing={2} sx={{ mt: 6 }} direction="row">
        <Button variant="contained" color="primary" component={RouterLink} to='/projects/create'>
          Start project
        </Button>
        {/* <Button variant="outlined" color="primary">
          Browse existing
        </Button> */}
      </Stack>
    </>
  );
}
