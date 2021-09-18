import { PolyjuiceWallet, PolyjuiceJsonRpcProvider } from "@polyjuice-provider/ethers";
import { Godwoker, PolyjuiceConfig } from "@polyjuice-provider/base";
import { PolyjuiceHttpProvider, PolyjuiceWebsocketProvider } from "@polyjuice-provider/web3";
import { config as dotenvConfig } from "dotenv";
import { ContractTransaction } from "ethers";
import { resolve } from "path";
import { getAccounts } from "../utils";
import { Accounts } from "../types";
import Web3 from "web3";

dotenvConfig({ path: resolve(__dirname, "../../.env") });

export abstract class BaseTest {
  protected nervosProviderUrl: string;
  protected nervosWsProviderUrl: string;
  protected privateKey: string;
  protected mnemonic: string;
  protected nervosProviderConfig: PolyjuiceConfig;
  protected rpcProvider!: PolyjuiceJsonRpcProvider;
  protected httpProvider!: PolyjuiceHttpProvider;
  protected wsProvider!: PolyjuiceWebsocketProvider;
  protected web3!: Web3;
  protected deployer!: PolyjuiceWallet;
  protected accounts!: Accounts;
  protected godwoker!: Godwoker;

  constructor() {
    const _nervosProviderUrl = process.env.NERVOS_PROVIDER_URL;
    if (!_nervosProviderUrl) {
      throw new Error("Please set your NERVOS_PROVIDER_URL in a .env file");
    }
    this.nervosProviderUrl = String(_nervosProviderUrl);

    const _nervosWsProviderUrl = process.env.NERVOS_WS_PROVIDER_URL;
    if (!_nervosWsProviderUrl) {
      throw new Error("Please set your NERVOS_WS_PROVIDER_URL in a .env file");
    }
    this.nervosWsProviderUrl = String(_nervosWsProviderUrl);

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
    this.rpcProvider = new PolyjuiceJsonRpcProvider(this.nervosProviderConfig, this.nervosProviderConfig.web3Url);
    //this.httpProvider = new PolyjuiceHttpProvider(this.nervosProviderUrl, this.nervosProviderConfig);
    //this.wsProvider = new PolyjuiceWebsocketProvider(this.nervosWsProviderUrl, this.nervosProviderConfig)
    //this.web3 = new Web3(this.wsProvider as any);
    //this.web3 = new Web3(this.httpProvider);
    this.deployer = new PolyjuiceWallet(this.privateKey, this.nervosProviderConfig, this.rpcProvider);
    this.accounts = getAccounts(this.mnemonic);
    this.godwoker = new Godwoker(this.nervosProviderUrl);
    await this.godwoker.initSync();
  }

  public async submitTransaction(callbackFn: () => Promise<ContractTransaction>): Promise<boolean> {
    const contractTransaction = await callbackFn();
    const tx = await this.rpcProvider.getTransaction(contractTransaction.hash);
    if (!tx) {
      return false;
    }
    await tx.wait();
    return true;
  }
}
