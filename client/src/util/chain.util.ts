import Big from 'big.js';
import { BigNumber } from 'ethers';
import { AddressTranslator } from 'nervos-godwoken-integration';
import { CommonConstants } from '../common/constants';
import { CommonUtil } from './common.util';

export interface IChainUtil {
  get alternateAddressName(): string
  toAlternateAddress(address: Maybe<string>): Maybe<string>
  toNativeFull(amount: Maybe<string>): BigNumber
  toNative(amount: Maybe<string>): BigNumber
  toNativeString(amount: Maybe<string>): string
}

export class MockChainUtil implements IChainUtil {
  private readonly _util: IChainUtil;

  constructor() {
    this._util = new NervosChainUtil();
  }

  get alternateAddressName(): string {
    return "Alternate"
  }

  toAlternateAddress(address: Maybe<string>): Maybe<string> {
    return address;
  }

  toNativeFull(amount: Maybe<string>): BigNumber {
    return this._util.toNativeFull(amount);
  }

  toNative(amount: Maybe<string>): BigNumber {
    return this._util.toNative(amount);
  }

  toNativeString(amount: Maybe<string>): string {
    return this._util.toNativeString(amount);
  }
}

export class NervosChainUtil implements IChainUtil {
  get alternateAddressName(): string {
    return "Polyjuice"
  }

  toAlternateAddress(address: Maybe<string>): Maybe<string> {
    if (!address || CommonUtil.isNullOrWhitespace(address)) {
      return;
    }
    // TODO: pass RPC url (Godwoken short address (aka Polyjuice address) depends on deployed scripts addresses, therefore it is different on devnet, testnet and mainnet)
    return (new AddressTranslator()).ethAddressToGodwokenShortAddress(address);
  }

  toNativeFull(amount: Maybe<string>): BigNumber {
    if (!amount || CommonUtil.isNullOrWhitespace(amount)) {
      return BigNumber.from(0);
    }
    return BigNumber.from(Big(amount).mul(Big(10).pow(CommonConstants.CKB_DECIMALS)).toString());
  }

  toNative(amount: Maybe<string>): BigNumber {
    if (!amount || CommonUtil.isNullOrWhitespace(amount)) {
      return BigNumber.from(0);
    }
    return BigNumber.from(Big(amount).div(Big(10).pow(CommonConstants.CKB_DECIMALS)).toFixed(0, 0));
  }

  toNativeString(amount: Maybe<string>): string {
    if (!amount || CommonUtil.isNullOrWhitespace(amount)) {
      return "0";
    }
    try {
      return Big(amount).div(Big(10).pow(CommonConstants.CKB_DECIMALS)).toFixed();
    } catch (error) {
      return "0";
    }
  }
}