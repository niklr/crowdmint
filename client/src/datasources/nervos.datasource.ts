import { BigNumber } from "ethers";
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

  async getBalanceAsync(address: string): Promise<BigNumber> {
    return this._client.rpcProvider.getBalance(address);
  }

  async getProjectAddressAsync(index: BigNumber): Promise<string> {
    const manager = await this._client.getProjectManagerAsync(super.getAccount());
    return manager.projects(index);
  }

  async getProjectAsync(address: string): Promise<Project> {
    const project = await this._client.getProjectAsync(address, super.getAccount());
    const info = await project.getInfo();
    return {
      address,
      category: info[0],
      title: info[1],
      description: "",
      url: info[2],
      goal: info[3],
      createdTimestamp: BigNumber.from("0"),
      expirationTimestamp: info[4],
      creator: info[5],
      totalContributions: info[6],
      totalContributors: info[7],
      totalFunding: info[8]
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
    _url: string,
    _goal: BigNumber,
    _deadline: BigNumber
  ): Promise<string> {
    const manager = await this._client.getProjectManagerAsync(super.getAccount());
    const tx = await manager.create(_id, _category, _title, _url, _goal, _deadline);
    logger.info(tx)();
    return tx.hash;
  }
}

const ds = new NervosDataSource();

export const getNervosDataSource = () => {
  return ds;
}