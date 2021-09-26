import { BigNumber } from "ethers"

export enum WalletType {
  MetaMask = 'MetaMask',
}

export interface Network {
  id: number,
  name: string
}

export interface GenericType {
  name: string;
  type: string;
}

export type Project = {
  address: string;
  category: string;
  title: string;
  description: string;
  url: string;
  goal: BigNumber;
  createdTimestamp: BigNumber;
  expirationTimestamp: BigNumber;
  creator: string;
  totalContributions: BigNumber;
  totalContributors: BigNumber;
  totalFunding: BigNumber;
}

export type Item = {
  id: string;
  createdDate: string;
  modifiedDate: string;
  name: string;
  description: string;
  imageUrl: string;
}