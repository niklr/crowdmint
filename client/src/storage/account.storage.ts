export class AccountStorage {
  private _account: Maybe<string>;

  get account(): Maybe<string> {
    return this._account;
  }

  set account(account: Maybe<string>) {
    this._account = account;
  }
}

const storage = new AccountStorage();

export const getAccountStorage = () => {
  return storage;
}