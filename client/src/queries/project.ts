import { gql } from '@apollo/client';
import { BigNumber } from 'ethers';
import { ApolloContext } from '../clients/apollo.client';
import { CommonUtil } from '../util/common.util';
import { Contribution, Project } from '../util/types';

export const GET_TOTAL_PROJECTS_QUERY = gql`
  query GetTotalProjects {
    totalProjects @client
  }
`;

export const GET_PROJECT_INDEX_QUERY = gql`
  query GetProjectIndex($id: String!) {
    projectIndex(id: $id) @client
  }
`;

export const GET_PROJECT_ADDRESS_QUERY = gql`
  query GetProjectAddress($index: String!) {
    projectAddress(index: $index) @client
  }
`;

export const GET_PROJECT_QUERY = gql`
  query GetProject($address: String) {
    project(address: $address) @client {
      address
      category
      title
      description
      url
      goal
      createdTimestamp
      expirationTimestamp
      creator
      totalContributions
      totalContributors
      totalFunding
    }
  }
`;

export const GET_PROJECT_CONTRIBUTION_QUERY = gql`
  query GetProjectContribution($address: String, $index: String!) {
    projectContribution(address: $address, index: $index) @client {
      contributor
      createdTimestamp
      amount
    }
  }
`;

export const ProjectQueries = {
  async totalProjects(parent: any, params: any, context: ApolloContext): Promise<string> {
    const amount = await context.client.datasource.getTotalProjectsAsync();
    return amount.toString();
  },
  async projectIndex(parent: any, { id }: any, context: ApolloContext): Promise<string> {
    const index = await context.client.datasource.getProjectIndexAsync(id);
    return index.toString();
  },
  async projectAddress(parent: any, { index }: any, context: ApolloContext): Promise<Maybe<string>> {
    return context.client.datasource.getProjectAddressAsync(BigNumber.from(index));
  },
  async project(parent: any, { address }: any, context: ApolloContext): Promise<Maybe<Project>> {
    if (CommonUtil.isNullOrWhitespace(address)) {
      return;
    }
    return context.client.datasource.getProjectAsync(address);
  },
  async projectContribution(parent: any, { address, index }: any, context: ApolloContext): Promise<Maybe<Contribution>> {
    if (CommonUtil.isNullOrWhitespace(address)) {
      return;
    }
    return context.client.datasource.getProjectContributionAsync(address, BigNumber.from(index));
  }
}