import Big from 'big.js';
import { BigNumber } from 'ethers';
import { CommonConstants } from '../common/constants';

export abstract class CommonUtil {
  static isString(value: any): boolean {
    return typeof value === 'string' || value instanceof String;
  }

  static isNullOrWhitespace(value?: Maybe<string>): boolean {
    if (!CommonUtil.isString(value)) {
      // console.log('Expected a string but got: ', value);
      return true;
    } else {
      return value === null || value === undefined || value.trim() === '';
    }
  }

  static isNullOrDefault(value?: string, defaultValue?: string): boolean {
    return CommonUtil.isNullOrWhitespace(value) || value === defaultValue
  }

  static timeout(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static truncateString = (str: Maybe<string>, maxLength: number) => {
    if (str) {
      if (maxLength < str.length) {
        return `${str.substr(0, maxLength)}...`
      }
    }
    return str
  }

  static truncateStringInTheMiddle = (str: Maybe<string>, strPositionStart: number, strPositionEnd: number) => {
    if (str) {
      const minTruncatedLength = strPositionStart + strPositionEnd
      if (minTruncatedLength < str.length) {
        return `${str.substr(0, strPositionStart)}...${str.substr(str.length - strPositionEnd, str.length)}`
      }
    }
    return str
  }

  static toJsonString(data: any): string {
    return JSON.stringify(data, null, 2);
  }

  static async imageUrlToBlob(url: string): Promise<Blob> {
    return (await fetch(url)).blob();
  }

  static random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static toCKBit(amount: string): BigNumber {
    return BigNumber.from(Big(amount).mul(Big(10).pow(CommonConstants.CKB_DECIMALS)).toString());
  }

  static toCKByte(amount: string): BigNumber {
    return BigNumber.from(Big(amount).div(Big(10).pow(CommonConstants.CKB_DECIMALS)).toString());
  }

  static calculatePercentage(current: Maybe<string>, goal: Maybe<string>): number {
    try {
      if (current && goal) {
        return Math.floor(Big(current).div(Big(goal)).mul(100).toNumber());
      }
    } catch (error) {
    }
    return 0;
  }
}