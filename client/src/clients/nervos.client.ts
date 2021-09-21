import { PolyjuiceJsonRpcProvider } from "@polyjuice-provider/ethers";
import { Ensure } from "../util/ensure";

export class NervosClient {

  private readonly _rpcProvider;

  constructor() {
    Ensure.notNullOrWhiteSpace(process.env.REACT_APP_NERVOS_PROVIDER_URL, 'REACT_APP_NERVOS_PROVIDER_URL');
    const nervosProviderConfig = {
      web3Url: process.env.REACT_APP_NERVOS_PROVIDER_URL
    }
    this._rpcProvider = new PolyjuiceJsonRpcProvider(nervosProviderConfig, nervosProviderConfig.web3Url);
  }
}