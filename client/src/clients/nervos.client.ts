import { PolyjuiceConfig } from "@polyjuice-provider/base";
import { PolyjuiceJsonRpcProvider } from "@polyjuice-provider/ethers";
import { PolyjuiceHttpProvider } from "@polyjuice-provider/web3";
import { BigNumber, ethers } from "ethers";
import { CommonConstants } from "../common/constants";
import { BaseDataGateway } from "../gateways";
import { ProjectManager, ProjectManager__factory } from "../typechain";
import { Ensure } from "../util/ensure";
import { getLogger } from "../util/logger";

const logger = getLogger();

export class NervosClient extends BaseDataGateway {

  private readonly _rpcProvider;
  private readonly _httpProvider;
  private readonly _web3Provider;
  private readonly _nervosProviderConfig: PolyjuiceConfig;
  private _projectManager?: ProjectManager;

  constructor() {
    super();
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

  private createProjectManager(): ProjectManager {
    const account = super.getAccount();
    Ensure.notNullOrWhiteSpace(account, "account");
    // https://github.com/dethcrypto/TypeChain/blob/master/examples/ethers-v5/src/index.ts
    // https://github.com/RetricSu/polyjuice-provider-example/blob/main/src/godwoken.ts
    const signer = this._web3Provider.getSigner(account as string);
    return ProjectManager__factory.connect(CommonConstants.PROJECT_MANAGER_CONTRACT, signer);
  }

  private async getProjectManagerAsync(): Promise<ProjectManager> {
    if (!this._projectManager) {
      this._projectManager = this.createProjectManager();
    }
    const currentAccount = await this._projectManager.signer.getAddress();
    if (currentAccount !== super.getAccount()) {
      logger.info(`Creating new ProjectManager, prev account: ${currentAccount} / new account: ${super.getAccount()}`)();
      this._projectManager = this.createProjectManager();
    }
    return this._projectManager;
  }

  async getBalanceAsync(address: string): Promise<BigNumber> {
    return this.rpcProvider.getBalance(address);
  }

  async getTimestampAsync(): Promise<BigNumber> {
    const manager = await this.getProjectManagerAsync();
    return manager.getTimestamp();
  }

  async getTotalProjectsAsync(): Promise<BigNumber> {
    const manager = await this.getProjectManagerAsync();
    return manager.totalProjects();
  }

  async createProjectAsync(
    _id: string,
    _category: string,
    _title: string,
    _url: string,
    _goal: BigNumber,
    _deadline: BigNumber
  ): Promise<string> {
    const manager = await this.getProjectManagerAsync();
    const tx = await manager.create(_id, _category, _title, _url, _goal, _deadline);
    logger.info(tx)();
    return tx.hash;
  }
}

const client = new NervosClient();

export const getNervosClient = () => {
  return client;
}