import { gql } from '@apollo/client';
import { Item } from '../util/types';

export const GET_ITEMS_QUERY = gql`
  query GetItems($first: Int!, $skip: Int!) {
    items(first: $first, skip: $skip) @client {
      id
      createdDate
      modifiedDate
      name
      description
      imageUrl
    }
  }
`;

export const ItemQueries = {
  async items(_: any, { first, skip }: any): Promise<Item[] | null> {
    try {
      console.log('first', first, 'skip', skip);
      return [];
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}