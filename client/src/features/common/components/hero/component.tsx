import React from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, styled, Typography } from '@mui/material';

const HeroContent = styled('div')(
  ({ theme }) => `
  background-color: ${theme.palette.background.paper};
  padding: ${theme.spacing(1, 0, 0)};
`,
);

export const Hero = () => {
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <img src={"./assets/images/logo_text.png"} alt="logo" />
      </Box>
      <HeroContent>
        <Container maxWidth="sm">
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            De-centralized crowdfunding on <i>Nervos Network</i>.<br></br>
            CROWDMINT is a blockchain based solution leveraging NFT's to crowdfund projects.
          </Typography>
        </Container>
      </HeroContent>
    </>
  );
}
