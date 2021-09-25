
import { BigNumber } from "ethers";
import { AccountStorage, getAccountStorage } from "../storage";

export interface IDataGateway {
  getBalanceAsync(_address: string): Promise<BigNumber>;
  getTimestampAsync(): Promise<BigNumber>;
  getTotalProjectsAsync(): Promise<BigNumber>;
  createProjectAsync(
    _id: string,
    _category: string,
    _title: string,
    _url: string,
    _goal: BigNumber,
    _deadline: BigNumber
  ): Promise<string>;
}

export abstract class BaseDataGateway implements IDataGateway {
  private readonly _accountStorage: AccountStorage;

  constructor() {
    this._accountStorage = getAccountStorage();
  }

  getAccount(): Maybe<string> {
    return this._accountStorage.account;
  }

  abstract getBalanceAsync(_address: string): Promise<BigNumber>;
  abstract getTimestampAsync(): Promise<BigNumber>;
  abstract getTotalProjectsAsync(): Promise<BigNumber>;
  abstract createProjectAsync(
    _id: string,
    _category: string,
    _title: string,
    _url: string,
    _goal: BigNumber,
    _deadline: BigNumber
  ): Promise<string>;
}