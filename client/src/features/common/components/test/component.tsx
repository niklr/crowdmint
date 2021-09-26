import { useQuery } from '@apollo/client';
import React from 'react';
import { GET_ITEMS_QUERY } from '../../../../queries';

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
      Test
    </>
  );
}
