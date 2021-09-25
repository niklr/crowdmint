import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { ItemQueries } from '../queries';

export class ApolloClientWrapper extends ApolloClient<NormalizedCacheObject> {

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
    ...ItemQueries
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