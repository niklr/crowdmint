import Big from 'big.js';
import { BigNumber } from 'ethers';
import { CommonConstants } from '../common/constants';
import { GetProject_project } from '../queries/__generated__/GetProject';
import { CommonUtil } from './common.util';
import { Project } from './types';

export abstract class TransformUtil {
  static toProject(source: Maybe<GetProject_project>): Maybe<Project> {
    if (!source) {
      return;
    }
    return {
      address: source?.address,
      category: source?.category,
      createdTimestamp: source?.createdTimestamp,
      creator: source?.creator,
      description: source?.description,
      expirationTimestamp: source?.expirationTimestamp,
      goal: source?.goal,
      title: source?.title,
      totalContributions: source?.totalContributions,
      totalContributors: source?.totalContributors,
      totalFunding: source?.totalFunding,
      url: source?.url
    }
  }

  static toBigNumber(number: Maybe<string>): BigNumber {
    if (CommonUtil.isNullOrWhitespace(number)) {
      return BigNumber.from(0);
    }
    return BigNumber.from(number);
  }

  static toCKBit(amount: Maybe<string>): BigNumber {
    if (!amount || CommonUtil.isNullOrWhitespace(amount)) {
      return BigNumber.from(0);
    }
    return BigNumber.from(Big(amount).mul(Big(10).pow(CommonConstants.CKB_DECIMALS)).toString());
  }

  static toCKByte(amount: Maybe<string>): BigNumber {
    if (!amount || CommonUtil.isNullOrWhitespace(amount)) {
      return BigNumber.from(0);
    }
    return BigNumber.from(Big(amount).div(Big(10).pow(CommonConstants.CKB_DECIMALS)).toFixed(0, 0));
  }

  static toCKByteString(amount: Maybe<string>): string {
    if (!amount || CommonUtil.isNullOrWhitespace(amount)) {
      return "0";
    }
    try {
      return Big(amount).div(Big(10).pow(CommonConstants.CKB_DECIMALS)).toFixed();
    } catch (error) {
      return "0";
    }
  }

  static toTimestamp(date: Maybe<Date>): string {
    if (date) {
      return Math.floor(date.getTime() / 1000).toString();
    }
    return "0";
  }
}