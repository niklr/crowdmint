import { BigNumber } from "ethers";
import { getNervosClient, NervosClient } from "../clients/nervos.client";
import { BaseDataGateway } from "../gateways";
import { getLogger } from "../util/logger";

const logger = getLogger();

export class NervosGateway extends BaseDataGateway {
  private readonly _client: NervosClient;

  constructor() {
    super();
    this._client = getNervosClient();
  }

  async getBalanceAsync(address: string): Promise<BigNumber> {
    return this._client.rpcProvider.getBalance(address);
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

const gateway = new NervosGateway();

export const getNervosGateway = () => {
  return gateway;
}