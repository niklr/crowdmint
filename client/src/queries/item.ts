import { gql } from '@apollo/client';
import { ApolloContext } from '../clients/apollo.client';
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
  async items(parent: any, { first, skip }: any, context: ApolloContext): Promise<Item[] | null> {
    try {
      console.log('first', first, 'skip', skip);
      console.log(await context.client.datasource.getTimestampAsync());
      return [];
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}