import { TransactionRequest } from "@ethersproject/providers";
import { utils } from 'ethers';
import { Accounts } from "./types";

export function getOverrideOptions(nervosProviderUrl: string | undefined = undefined): TransactionRequest {
  if (nervosProviderUrl === 'http://localhost:8024') {
    return {
      gasPrice: 0,
      gasLimit: 1_000_000
      // gasPrice: 0x0,
      // gasLimit: 0x54d30
    };
  } else {
    return {
    };
  }
}

export function assertCondition(condition: boolean, message: string) {
  if (!condition) {
    if (typeof message === 'object' && message !== null) {
      throw new Error(JSON.stringify(message, undefined, 2))
    } else {
      throw new Error(message || 'Assertion failed');
    }
  }
}

export function getAccounts(mnemonic: string): Accounts {
  const hdNode = utils.HDNode.fromMnemonic(mnemonic);
  return {
    admin: hdNode.derivePath(`m/44'/60'/0'/0/1`),
    owner: hdNode.derivePath(`m/44'/60'/0'/0/2`),
    alice: hdNode.derivePath(`m/44'/60'/0'/0/3`),
    bob: hdNode.derivePath(`m/44'/60'/0'/0/4`),
    charlie: hdNode.derivePath(`m/44'/60'/0'/0/5`)
  }
}