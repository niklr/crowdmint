import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, styled, Typography } from '@mui/material';

const HeroContent = styled('div')(
  ({ theme }) => `
  background-color: ${theme.palette.background.paper};
  padding: ${theme.spacing(1, 0, 1)};
`,
);

export const Hero = () => {
  return (
    <HeroContent>
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          De-centralized crowdfunding on <i>Nervos Network</i>.<br></br>
          MINTCROWD is an blockchain based solution leveraging NFT's to crowdfund projects.
        </Typography>
      </Container>
    </HeroContent>
  );
}
