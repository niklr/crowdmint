import { useQuery } from '@apollo/client';
import { Grid } from '@mui/material';
import Container from '@mui/material/Container';
import React from 'react';
import { GET_ITEMS_QUERY } from '../../../../queries';
import { ListItem } from '../../../project/components/list-item';

export const Test = () => {
  const { data, loading } = useQuery(GET_ITEMS_QUERY, {
    variables: {
      first: 10,
      skip: 0
    },
    fetchPolicy: 'network-only'
  });
  console.log(loading, data);
  return (
    <>
      <Container sx={{ paddingTop: 6, paddingBottom: 6 }} maxWidth="lg">
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item key='5' xs={12} sm={6} md={4}>
            <ListItem loading={loading}></ListItem>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
