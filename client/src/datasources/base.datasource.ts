
import { BigNumber } from "ethers";
import { AccountStorage, getAccountStorage } from "../storage";
import { Project } from "../util/types";

export interface IDataSource {
  getBalanceAsync(_address: string): Promise<BigNumber>;
  getProjectAddressAsync(index: BigNumber): Promise<Maybe<string>>;
  getProjectAsync(address: string): Promise<Project>
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
  contributeAsync(_address: string, _amount: BigNumber): Promise<string>;
}

export abstract class BaseDataSource implements IDataSource {
  private readonly _accountStorage: AccountStorage;

  constructor() {
    this._accountStorage = getAccountStorage();
  }

  getAccount(): Maybe<string> {
    return this._accountStorage.account;
  }

  abstract getBalanceAsync(_address: string): Promise<BigNumber>;
  abstract getProjectAddressAsync(index: BigNumber): Promise<Maybe<string>>;
  abstract getProjectAsync(address: string): Promise<Project>;
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
  abstract contributeAsync(_address: string, _amount: BigNumber): Promise<string>;
}