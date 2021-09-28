import { BigNumber, Overrides } from "ethers";
import { BaseDataSource } from ".";
import { getNervosClient, NervosClient } from "../clients/nervos.client";
import { getLogger } from "../util/logger";
import { Project } from "../util/types";

const logger = getLogger();

export class NervosDataSource extends BaseDataSource {
  private readonly _client: NervosClient;

  constructor() {
    super();
    this._client = getNervosClient();
  }

  private getOverrideOptions(): Overrides {
    return {
      gasPrice: 0,
      gasLimit: 1_000_000
    };
  }

  async getBalanceAsync(_address: string): Promise<BigNumber> {
    return this._client.rpcProvider.getBalance(_address);
  }

  async getProjectIndexAsync(_id: string): Promise<BigNumber> {
    const manager = await this._client.getProjectManagerAsync(super.getAccount());
    return manager.indexes(_id);
  }

  async getProjectAddressAsync(_index: BigNumber): Promise<string> {
    const manager = await this._client.getProjectManagerAsync(super.getAccount());
    return manager.projects(_index);
  }

  async getProjectAsync(_address: string): Promise<Project> {
    const project = await this._client.getProjectAsync(_address, super.getAccount());
    const info = await project.getInfo();
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

  async getTimestampAsync(): Promise<BigNumber> {
    const manager = await this._client.getProjectManagerAsync(super.getAccount());
    return manager.getTimestamp();
  }

  async getTotalProjectsAsync(): Promise<BigNumber> {
    const manager = await this._client.getProjectManagerAsync(super.getAccount());
    return manager.totalProjects();
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
    const tx = await manager.create(_id, _category, _title, _description, _url, _goal, _deadline);
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
    const project = await this._client.getProjectAsync(_address, super.getAccount());
    const tx = await project.setInfo(_category, _title, _description, _url, _goal, _deadline);
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