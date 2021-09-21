import { PolyjuiceJsonRpcProvider } from "@polyjuice-provider/ethers";
import { CommonConstants } from "../common/constants";
import { ProjectManager, ProjectManager__factory } from "../typechain";
import { Ensure } from "../util/ensure";

export class NervosClient {

  private readonly _rpcProvider;

  constructor() {
    Ensure.notNullOrWhiteSpace(process.env.REACT_APP_NERVOS_PROVIDER_URL, 'REACT_APP_NERVOS_PROVIDER_URL');
    const nervosProviderConfig = {
      web3Url: process.env.REACT_APP_NERVOS_PROVIDER_URL
    }
    this._rpcProvider = new PolyjuiceJsonRpcProvider(nervosProviderConfig, nervosProviderConfig.web3Url);
  }

  get rpcProvider(): PolyjuiceJsonRpcProvider {
    return this._rpcProvider;
  }

  getProjectManager(account: string): ProjectManager {
    // https://github.com/dethcrypto/TypeChain/blob/master/examples/ethers-v5/src/index.ts
    return ProjectManager__factory.connect(CommonConstants.PROJECT_MANAGER_CONTRACT, this._rpcProvider.getSigner(account))
  }
}

const client = new NervosClient();

export const getNervosClient = () => {
  return client;
}