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

export interface CreateProject {
  category: string;
  title: string;
  url: string;
  goal: BigNumber;
  deadline: BigNumber;
}