import { Grid } from '@mui/material';
import Container from '@mui/material/Container';
import React from 'react';
import { ListItem } from '../../../project/components/list-item';

export const Test = () => {
  return (
    <>
      <Container sx={{ paddingTop: 6, paddingBottom: 6 }} maxWidth="lg">
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item key='5' xs={12} sm={6} md={4}>
            <ListItem loading={false}></ListItem>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
