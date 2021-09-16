import { PolyjuiceWallet, PolyjuiceJsonRpcProvider } from "@polyjuice-provider/ethers";
import { Godwoker, PolyjuiceConfig } from "@polyjuice-provider/base";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { getAccounts } from "../utils";
import { Accounts } from "../types";

dotenvConfig({ path: resolve(__dirname, "../../.env") });

export abstract class BaseTest {
  protected nervosProviderUrl: string;
  protected privateKey: string;
  protected mnemonic: string;
  protected nervosProviderConfig: PolyjuiceConfig;
  protected rpc!: PolyjuiceJsonRpcProvider;
  protected deployer!: PolyjuiceWallet;
  protected accounts!: Accounts;
  protected godwoker!: Godwoker;

  constructor() {
    const _nervosProviderUrl = process.env.NERVOS_PROVIDER_URL;
    if (!_nervosProviderUrl) {
      throw new Error("Please set your NERVOS_PROVIDER_URL in a .env file");
    }
    this.nervosProviderUrl = String(_nervosProviderUrl);

    const _privateKey = process.env.PRIVATE_KEY;
    if (!_privateKey) {
      throw new Error("Please set your PRIVATE_KEY in a .env file");
    }
    this.privateKey = String(_privateKey);

    const _mnemonic = process.env.MNEMONIC;
    if (!_mnemonic) {
      throw new Error("Please set your MNEMONIC in a .env file");
    }
    this.mnemonic = String(_mnemonic);

    this.nervosProviderConfig = {
      web3Url: this.nervosProviderUrl,
    };
  }

  public async initAsync(): Promise<void> {
    this.rpc = new PolyjuiceJsonRpcProvider(this.nervosProviderConfig, this.nervosProviderConfig.web3Url);
    this.deployer = new PolyjuiceWallet(this.privateKey, this.nervosProviderConfig, this.rpc);
    this.accounts = getAccounts(this.mnemonic);
    this.godwoker = new Godwoker(this.nervosProviderUrl);
    await this.godwoker.initSync();
  }
}
