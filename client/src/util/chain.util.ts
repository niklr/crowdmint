import Big from 'big.js';
import { BigNumber } from 'ethers';
import { AddressTranslator } from 'nervos-godwoken-integration';
import { CommonUtil } from './common.util';

export interface IChainUtil {
  get decimals(): number;
  get alternateAddressName(): string
  get nativeFullName(): string
  get nativeName(): string
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

  get decimals(): number {
    return this._util.decimals;
  }

  get alternateAddressName(): string {
    return "Alternate";
  }

  get nativeFullName(): string {
    return this._util.nativeFullName;
  }

  get nativeName(): string {
    return this._util.nativeName;
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
  get decimals(): number {
    return 8;
  }

  get alternateAddressName(): string {
    return "Polyjuice";
  }

  get nativeFullName(): string {
    return "CKBit";
  }

  get nativeName(): string {
    return "CKB";
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
    return BigNumber.from(Big(amount).mul(Big(10).pow(this.decimals)).toString());
  }

  toNative(amount: Maybe<string>): BigNumber {
    if (!amount || CommonUtil.isNullOrWhitespace(amount)) {
      return BigNumber.from(0);
    }
    return BigNumber.from(Big(amount).div(Big(10).pow(this.decimals)).toFixed(0, 0));
  }

  toNativeString(amount: Maybe<string>): string {
    if (!amount || CommonUtil.isNullOrWhitespace(amount)) {
      return "0";
    }
    try {
      return Big(amount).div(Big(10).pow(this.decimals)).toFixed();
    } catch (error) {
      return "0";
    }
  }
}