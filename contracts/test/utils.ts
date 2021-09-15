import { TransactionRequest } from "@ethersproject/providers";

export function getOverrideOptions(nervosProviderUrl: string | undefined = undefined): TransactionRequest {
  if (nervosProviderUrl === 'http://localhost:8024') {
    return {
      gasPrice: 0,
      gasLimit: 1_000_000
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