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

export type IpfsResult = {
  url: string;
  path: string;
  size: number;
  cid: any;
}

export type Project = {
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

export type Item = {
  id: string;
  createdDate: string;
  modifiedDate: string;
  name: string;
  description: string;
  imageUrl: string;
}