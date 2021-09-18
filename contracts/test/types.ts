import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { BigNumber, utils } from "ethers";
import { SimpleStorage } from "../typechain";

export interface Accounts {
  admin: utils.HDNode;
  owner: utils.HDNode;
  alice: utils.HDNode;
  bob: utils.HDNode;
  charlie: utils.HDNode;
}

export interface Signers {
  admin: SignerWithAddress;
  owner: SignerWithAddress;
  deployer: SignerWithAddress;
  alice: SignerWithAddress;
  bob: SignerWithAddress;
  charlie: SignerWithAddress;
  dave: SignerWithAddress;
  eve: SignerWithAddress;
}

declare module "mocha" {
  export interface Context {
    simpleStorage: SimpleStorage;
    signers: Signers;
  }
}

export interface TransactionResult {
  hash: string;
  success: boolean;
}

export interface CreateProject {
  id: string;
  category: string;
  title: string;
  url: string;
  goal: BigNumber;
  deadline: BigNumber;
}

export interface ProjectInfo {
  category: string;
  title: string;
  url: string;
  goal: BigNumber;
  deadline: BigNumber;
  creator: string;
  totalContributions: BigNumber;
  totalContributors: BigNumber;
  totalFunding: BigNumber;
  manager: string;
}