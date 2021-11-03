import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { getCommonContext } from '../contexts/common.context';
import { IDataSource } from '../datasources';
import { ProjectMutations } from '../mutations/project';
import { ItemQueries } from '../queries';
import { ProjectQueries } from '../queries/project';

export type ApolloContext = {
  cache: InMemoryCache,
  client: ApolloClientWrapper,
  clientAwareness: any,
  getCacheKey: (obj: any) => string | undefined
}

export class ApolloClientWrapper extends ApolloClient<NormalizedCacheObject> {
  get datasource(): IDataSource {
    return getCommonContext().datasource;
  }
}

const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
      }
    }
  }
});

const resolvers = {
  Query: {
    ...ItemQueries,
    ...ProjectQueries
  },
  Mutation: {
    ...ProjectMutations
  }
};

// https://www.apollographql.com/docs/react/networking/authentication/#header
const client = new ApolloClientWrapper({
  // link: authLink.concat(httpLink),
  cache: cache,
  resolvers,
  headers: {
    'client-name': process.env.REACT_APP_NAME || 'client',
    'client-version': process.env.REACT_APP_VERSION || '0',
  },
})

export const getApolloClient = () => {
  return client;
}