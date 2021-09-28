/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProjectContribution
// ====================================================

export interface GetProjectContribution_projectContribution {
  __typename: "Contribution";
  contributor: string;
  createdTimestamp: string;
  amount: string;
}

export interface GetProjectContribution {
  projectContribution: GetProjectContribution_projectContribution | null;
}

export interface GetProjectContributionVariables {
  address?: string | null;
  index: string;
}
