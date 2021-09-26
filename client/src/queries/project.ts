import { gql } from '@apollo/client';
import { BigNumber } from 'ethers';
import { ApolloContext } from '../clients/apollo.client';
import { getLogger } from '../util/logger';

const logger = getLogger();

export const GET_TOTAL_PROJECTS_QUERY = gql`
  query GetTotalProjects {
    totalProjects @client
  }
`;

export const ProjectQueries = {
  async totalProjects(parent: any, params: any, context: ApolloContext): Promise<string> {
    try {
      const amount = await context.client.datasource.getTotalProjectsAsync();
      return amount.toString();
    } catch (e) {
      logger.error(e)();
      return BigNumber.from(0).toString();
    }
  }
}