import { PolyjuiceConfig } from "@polyjuice-provider/base";
import { PolyjuiceJsonRpcProvider } from "@polyjuice-provider/ethers";
import { PolyjuiceHttpProvider } from "@polyjuice-provider/web3";
import { ethers } from "ethers";
import { CommonConstants } from "../common/constants";
import { ProjectManager, ProjectManager__factory } from "../typechain";
import { CommonUtil } from "../util/common.util";
import { Ensure } from "../util/ensure";

export class NervosClient {

  private readonly _rpcProvider;
  private readonly _httpProvider;
  private readonly _web3Provider;
  private readonly _nervosProviderConfig: PolyjuiceConfig;

  constructor() {
    Ensure.notNullOrWhiteSpace(process.env.REACT_APP_NERVOS_PROVIDER_URL, 'REACT_APP_NERVOS_PROVIDER_URL');
    this._nervosProviderConfig = {
      web3Url: process.env.REACT_APP_NERVOS_PROVIDER_URL
    };
    this._rpcProvider = new PolyjuiceJsonRpcProvider(this._nervosProviderConfig, this._nervosProviderConfig.web3Url);
    this._httpProvider = new PolyjuiceHttpProvider(this._nervosProviderConfig.web3Url!, this._nervosProviderConfig);
    this._web3Provider = new ethers.providers.Web3Provider(this._httpProvider);
  }

  get rpcProvider(): PolyjuiceJsonRpcProvider {
    return this._rpcProvider;
  }

  async getProjectManagerAsync(account: Maybe<string>): Promise<ProjectManager> {
    // https://github.com/dethcrypto/TypeChain/blob/master/examples/ethers-v5/src/index.ts
    // https://github.com/RetricSu/polyjuice-provider-example/blob/main/src/godwoken.ts
    if (CommonUtil.isNullOrWhitespace(account)) {
      return ProjectManager__factory.connect(CommonConstants.PROJECT_MANAGER_CONTRACT, this._web3Provider);
    }
    const signer = this._web3Provider.getSigner(account as string);
    return ProjectManager__factory.connect(CommonConstants.PROJECT_MANAGER_CONTRACT, signer);
  }
}

const client = new NervosClient();

export const getNervosClient = () => {
  return client;
}