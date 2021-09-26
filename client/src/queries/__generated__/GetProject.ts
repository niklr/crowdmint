/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProject
// ====================================================

export interface GetProject_project {
  __typename: "Project";
  address: string;
  category: string;
  title: string;
  description: string;
  url: string;
  goal: string;
  createdTimestamp: string;
  expirationTimestamp: string;
  creator: string;
  totalContributions: string;
  totalContributors: string;
  totalFunding: string;
}

export interface GetProject {
  project: GetProject_project | null;
}

export interface GetProjectVariables {
  address?: string | null;
}
