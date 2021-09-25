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

export type Item = {
  id: string;
  createdDate: string;
  modifiedDate: string;
  name: string;
  description: string;
  imageUrl: string;
}