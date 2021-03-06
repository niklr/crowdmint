import { BigNumber, Overrides } from "ethers";
import { BaseDataSource } from ".";
import { getNervosClient, NervosClient } from "../clients/nervos.client";
import { Project as TypechainProject, ProjectManager as TypechainProjectManager } from "../typechain";
import { IChainUtil, NervosChainUtil } from "../util/chain.util";
import { getLogger } from "../util/logger";
import { Contribution, Project } from "../util/types";

const logger = getLogger();

export class NervosDataSource extends BaseDataSource {
  private readonly _chainUtil: IChainUtil;
  private readonly _client: NervosClient;
  private readonly _projectContracts: Map<string, TypechainProject>;
  private _projectManagerContract?: TypechainProjectManager;

  constructor() {
    super();
    this._chainUtil = new NervosChainUtil();
    this._client = getNervosClient();
    this._projectContracts = new Map<string, TypechainProject>();
  }

  private getOverrideOptions(): Overrides {
    return {
      gasPrice: 0,
      gasLimit: 1_000_000
    };
  }

  private async getTypechainProjectAsync(_address: string): Promise<TypechainProject> {
    const existing = this._projectContracts.get(_address);
    if (existing) {
      return existing;
    }
    const project = await this._client.getProjectAsync(_address, undefined);
    this._projectContracts.set(_address, project);
    return project;
  }

  protected async initAsyncProtected(): Promise<void> {
    this._projectManagerContract = await this._client.getProjectManagerAsync(undefined);
  }

  protected disposeProtected(): void {
    this._projectManagerContract = undefined;
  }

  get util(): IChainUtil {
    return this._chainUtil;
  }

  async getBalanceAsync(_address: string): Promise<BigNumber> {
    return this._client.rpcProvider.getBalance(_address);
  }

  async getProjectIndexAsync(_id: string): Promise<BigNumber> {
    return this._projectManagerContract?.indexes(_id) ?? BigNumber.from(0);
  }

  async getProjectAddressAsync(_index: BigNumber): Promise<Maybe<string>> {
    return this._projectManagerContract?.projects(_index);
  }

  async getProjectAsync(_address: string): Promise<Project> {
    const project = await this.getTypechainProjectAsync(_address);
    const info = await project.getExtendedInfo();
    return {
      address: _address,
      category: info[0][0],
      title: info[0][1],
      description: info[0][2],
      url: info[0][3],
      goal: info[0][4].toString(),
      createdTimestamp: info[0][5].toString(),
      expirationTimestamp: info[0][6].toString(),
      creator: info[0][7],
      totalContributions: info[1].toString(),
      totalContributors: info[2].toString(),
      totalFunding: info[3].toString()
    }
  }

  async getProjectContributionAsync(_address: string, _index: BigNumber): Promise<Contribution> {
    const project = await this.getTypechainProjectAsync(_address);
    const c = await project.getContribution(_index);
    return {
      contributor: c.contributor,
      createdTimestamp: c.created.toString(),
      amount: c.amount.toString()
    };
  }

  async getTimestampAsync(): Promise<BigNumber> {
    return this._projectManagerContract?.getTimestamp() ?? BigNumber.from(0);
  }

  async getTotalProjectsAsync(): Promise<BigNumber> {
    return this._projectManagerContract?.totalProjects() ?? BigNumber.from(0);
  }

  async createProjectAsync(
    _id: string,
    _category: string,
    _title: string,
    _description: string,
    _url: string,
    _goal: BigNumber,
    _deadline: BigNumber
  ): Promise<string> {
    const manager = await this._client.getProjectManagerAsync(super.getAccount());
    const tx = await manager.create(_id, _category, _title, _description, _url, _goal, _deadline, {
      ...this.getOverrideOptions()
    });
    logger.info(tx)();
    return tx.hash;
  }

  async editProjectAsync(
    _address: string,
    _category: string,
    _title: string,
    _description: string,
    _url: string,
    _goal: BigNumber,
    _deadline: BigNumber
  ): Promise<string> {
    const manager = await this._client.getProjectManagerAsync(super.getAccount());
    const tx = await manager.setInfo(_address, _category, _title, _description, _url, _goal, _deadline, {
      ...this.getOverrideOptions()
    });
    logger.info(tx)();
    return tx.hash;
  }

  async contributeAsync(_address: string, _amount: BigNumber): Promise<string> {
    const manager = await this._client.getProjectManagerAsync(super.getAccount());
    const tx = await manager.contribute(_address, {
      value: _amount,
      ...this.getOverrideOptions()
    });
    logger.info(tx)();
    return tx.hash;
  }
}

const ds = new NervosDataSource();

export const getNervosDataSource = () => {
  return ds;
}