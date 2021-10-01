import { PolyjuiceConfig } from "@polyjuice-provider/base";
import { PolyjuiceJsonRpcProvider } from "@polyjuice-provider/ethers";
import { PolyjuiceHttpProvider } from "@polyjuice-provider/web3";
import { ethers } from "ethers";
import { CommonConstants } from "../common/constants";
import { Project, ProjectManager, ProjectManager__factory, Project__factory } from "../typechain";

export class NervosClient {

  private readonly _rpcProvider;
  private readonly _httpProvider;
  private readonly _web3Provider;
  private readonly _nervosProviderConfig: PolyjuiceConfig;

  constructor() {
    this._nervosProviderConfig = {
      web3Url: CommonConstants.NERVOS_PROVIDER_URL
    };
    this._rpcProvider = new PolyjuiceJsonRpcProvider(this._nervosProviderConfig, this._nervosProviderConfig.web3Url);
    this._httpProvider = new PolyjuiceHttpProvider(this._nervosProviderConfig.web3Url!, this._nervosProviderConfig);
    this._web3Provider = new ethers.providers.Web3Provider(this._httpProvider);
  }

  get rpcProvider(): PolyjuiceJsonRpcProvider {
    return this._rpcProvider;
  }

  async getProjectManagerAsync(): Promise<ProjectManager> {
    return ProjectManager__factory.connect(CommonConstants.PROJECT_MANAGER_CONTRACT, this._web3Provider);
  }

  async getProjectAsync(address: string): Promise<Project> {
    return Project__factory.connect(address, this._web3Provider);
  }
}

const client = new NervosClient();

export const getNervosClient = () => {
  return client;
}