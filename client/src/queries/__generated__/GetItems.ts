/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetItems
// ====================================================

export interface GetItems_items {
  __typename: "Item";
  id: string;
  createdDate: string;
  modifiedDate: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface GetItems {
  items: GetItems_items[];
}

export interface GetItemsVariables {
  first: number;
  skip: number;
}
