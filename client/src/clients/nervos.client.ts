import { PolyjuiceConfig } from "@polyjuice-provider/base";
import { PolyjuiceJsonRpcProvider } from "@polyjuice-provider/ethers";
import { PolyjuiceHttpProvider } from "@polyjuice-provider/web3";
import { ethers } from "ethers";
import { CommonConstants } from "../common/constants";
import { ProjectManager, ProjectManager__factory } from "../typechain";
import { Ensure } from "../util/ensure";
import { getLogger } from "../util/logger";

const logger = getLogger();

export class NervosClient {

  private readonly _rpcProvider;
  private readonly _httpProvider;
  private readonly _web3Provider;
  private readonly _nervosProviderConfig: PolyjuiceConfig;
  private _projectManager?: ProjectManager;

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

  private createProjectManager(account: string): ProjectManager {
    // https://github.com/dethcrypto/TypeChain/blob/master/examples/ethers-v5/src/index.ts
    // https://github.com/RetricSu/polyjuice-provider-example/blob/main/src/godwoken.ts
    const signer = this._web3Provider.getSigner(account);
    return ProjectManager__factory.connect(CommonConstants.PROJECT_MANAGER_CONTRACT, signer);
  }

  async getProjectManagerAsync(account: Maybe<string>): Promise<ProjectManager> {
    Ensure.notNullOrWhiteSpace(account, "account");
    if (!this._projectManager) {
      this._projectManager = this.createProjectManager(account as string);
    }
    const currentAccount = await this._projectManager.signer.getAddress();
    if (currentAccount !== account) {
      logger.info(`Creating new ProjectManager, prev account: ${currentAccount} / new account: ${account}`)();
      this._projectManager = this.createProjectManager(account as string);
    }
    return this._projectManager;
  }
}

const client = new NervosClient();

export const getNervosClient = () => {
  return client;
}