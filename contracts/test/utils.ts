import { TransactionRequest } from "@ethersproject/providers";
import { PolyjuiceJsonRpcProvider } from "@polyjuice-provider/ethers";
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

export function assertEquals(expected: any, actual: any, message?: string): void {
  if (expected !== actual) {
    throw new Error(`Expected: '${expected}' Actual: '${actual}' - ${message}`)
  }
}

export function assertCondition(condition: boolean, message?: string): void {
  if (!condition) {
    if (typeof message === 'object' && message !== null) {
      throw new Error(JSON.stringify(message, undefined, 2))
    } else {
      throw new Error(message || 'Assertion failed');
    }
  }
}

export async function assertExceptionAsync(callback: () => Promise<any>, message: string): Promise<void> {
  let exceptionThrown = false;
  try {
    await callback();
  } catch (error) {
    exceptionThrown = true;
  }
  assertCondition(exceptionThrown, message);
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

export async function waitForBlocks(provider: PolyjuiceJsonRpcProvider, amount: number): Promise<void> {
  provider.blockNumber
  let blockNumber = provider.blockNumber
  const prevBlockNumber = blockNumber;
  while (prevBlockNumber + amount > blockNumber) {
    blockNumber = provider.blockNumber
    console.log("Waiting for next block...", prevBlockNumber, blockNumber);
    await timeout(2000);
  }
}

export async function timeout(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}