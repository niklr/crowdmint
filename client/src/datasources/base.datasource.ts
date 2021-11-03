
import { BigNumber } from "ethers";
import { AccountStorage, getAccountStorage } from "../storage";
import { IChainUtil } from "../util/chain.util";
import { CommonUtil } from "../util/common.util";
import { getLogger } from "../util/logger";
import { MomentUtil } from "../util/moment.util";
import { Contribution, Project } from "../util/types";

const logger = getLogger();

export interface IDataSource {
  initAsync(): Promise<void>;
  dispose(): void;
  get util(): IChainUtil;
  getBalanceAsync(_address: string): Promise<BigNumber>;
  getProjectIndexAsync(_id: string): Promise<BigNumber>;
  getProjectAddressAsync(_index: BigNumber): Promise<Maybe<string>>;
  getProjectAsync(_address: string): Promise<Project>;
  getProjectContributionAsync(_address: string, _index: BigNumber): Promise<Contribution>;
  getTimestampAsync(): Promise<BigNumber>;
  getTotalProjectsAsync(): Promise<BigNumber>;
  createProjectAsync(
    _id: string,
    _category: string,
    _title: string,
    _description: string,
    _url: string,
    _goal: BigNumber,
    _deadline: BigNumber
  ): Promise<string>;
  editProjectAsync(
    _address: string,
    _category: string,
    _title: string,
    _description: string,
    _url: string,
    _goal: BigNumber,
    _deadline: BigNumber
  ): Promise<string>;
  contributeAsync(_address: string, _amount: BigNumber): Promise<string>;
}

export abstract class BaseDataSource implements IDataSource {
  protected _moment: MomentUtil = new MomentUtil();
  private readonly _accountStorage: AccountStorage;

  constructor() {
    this._accountStorage = getAccountStorage();
  }

  async initAsync(): Promise<void> {
    logger.info("Init BaseDataSource")();
    this._moment = new MomentUtil();
    await this.initAsyncProtected();
  }

  dispose(): void {
    logger.info("Disposing BaseDataSource")();
    this.disposeProtected();
  }

  getAccount(): string {
    if (!this._accountStorage.account || CommonUtil.isNullOrWhitespace(this._accountStorage.account)) {
      throw new Error("Please connect your wallet first.");
    }
    return this._accountStorage.account;
  }

  protected createId(): string {
    return CommonUtil.uuid();
  }

  protected abstract initAsyncProtected(): Promise<void>;
  protected abstract disposeProtected(): void;
  abstract get util(): IChainUtil;
  abstract getBalanceAsync(_address: string): Promise<BigNumber>;
  abstract getProjectIndexAsync(_id: string): Promise<BigNumber>;
  abstract getProjectAddressAsync(_index: BigNumber): Promise<Maybe<string>>;
  abstract getProjectAsync(_address: string): Promise<Project>;
  abstract getProjectContributionAsync(_address: string, _index: BigNumber): Promise<Contribution>;
  abstract getTimestampAsync(): Promise<BigNumber>;
  abstract getTotalProjectsAsync(): Promise<BigNumber>;
  abstract createProjectAsync(
    _id: string,
    _category: string,
    _title: string,
    _description: string,
    _url: string,
    _goal: BigNumber,
    _deadline: BigNumber
  ): Promise<string>;
  abstract editProjectAsync(
    _address: string,
    _category: string,
    _title: string,
    _description: string,
    _url: string,
    _goal: BigNumber,
    _deadline: BigNumber
  ): Promise<string>;
  abstract contributeAsync(_address: string, _amount: BigNumber): Promise<string>;
}