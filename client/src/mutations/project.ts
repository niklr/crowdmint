import { gql } from "@apollo/client";
import { BigNumber } from "ethers";
import { ApolloContext } from "../clients/apollo.client";

export const CREATE_PROJECT_MUTATION = gql`
mutation CreateProject($id: ID!, $category: String!, $title: String!, $description: String!, $url: String!, $goal: String!, $deadline: String!) {
  createProject(id: $id, category: $category, title: $title, description: $description, url: $url, goal: $goal, deadline: $deadline) @client
}
`;

export const EDIT_PROJECT_MUTATION = gql`
mutation EditProject($address: String!, $category: String!, $title: String!, $description: String!, $url: String!, $goal: String!, $deadline: String!) {
  editProject(address: $address, category: $category, title: $title, description: $description, url: $url, goal: $goal, deadline: $deadline) @client
}
`;

export const ProjectMutations = {
  async createProject(parent: any, { id, category, title, description, url, goal, deadline }: any, context: ApolloContext): Promise<string> {
    return context.client.datasource.createProjectAsync(id, category, title, description, url, BigNumber.from(goal), BigNumber.from(deadline));
  },
  async editProject(parent: any, { address, category, title, description, url, goal, deadline }: any, context: ApolloContext): Promise<string> {
    return context.client.datasource.editProjectAsync(address, category, title, description, url, BigNumber.from(goal), BigNumber.from(deadline));
  }
}