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
  async items(rootValue: any, { first, skip }: any, context: any): Promise<Item[] | null> {
    try {
      console.log(rootValue, 'first', first, 'skip', skip);
      console.log(context);
      return [];
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}