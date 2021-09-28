
import { BigNumber } from "ethers";
import { AccountStorage, getAccountStorage } from "../storage";
import { Project } from "../util/types";

export interface IDataSource {
  getBalanceAsync(_address: string): Promise<BigNumber>;
  getProjectIndexAsync(_id: string): Promise<BigNumber>
  getProjectAddressAsync(_index: BigNumber): Promise<string>;
  getProjectAsync(_address: string): Promise<Project>
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
  editProjectAsync(
    _address: string,
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
  abstract getProjectIndexAsync(_id: string): Promise<BigNumber>;
  abstract getProjectAddressAsync(_index: BigNumber): Promise<string>;
  abstract getProjectAsync(_address: string): Promise<Project>;
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
  abstract editProjectAsync(
    _address: string,
    _category: string,
    _title: string,
    _url: string,
    _goal: BigNumber,
    _deadline: BigNumber
  ): Promise<string>;
  abstract contributeAsync(_address: string, _amount: BigNumber): Promise<string>;
}