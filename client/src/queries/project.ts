import { gql } from '@apollo/client';
import { ApolloContext } from '../clients/apollo.client';

export const GET_TOTAL_PROJECTS_QUERY = gql`
  query GetTotalProjects {
    totalProjects @client
  }
`;

export const ProjectQueries = {
  async totalProjects(parent: any, params: any, context: ApolloContext): Promise<string> {
    const amount = await context.client.datasource.getTotalProjectsAsync();
    return amount.toString();
  }
}