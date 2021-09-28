import Big from 'big.js';
import { BigNumber } from 'ethers';
import { AddressTranslator } from 'nervos-godwoken-integration';
import { CommonConstants } from '../common/constants';
import { GetProject_project } from '../queries/__generated__/GetProject';
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

  static toGodwokenAddress(address: Maybe<string>): Maybe<string> {
    if (!address) {
      return;
    }
    return (new AddressTranslator()).ethAddressToGodwokenShortAddress(address);
  }

  static toCKBit(amount: Maybe<string>): BigNumber {
    if (!amount) {
      return BigNumber.from(0);
    }
    return BigNumber.from(Big(amount).mul(Big(10).pow(CommonConstants.CKB_DECIMALS)).toString());
  }

  static toCKByte(amount: Maybe<string>): BigNumber {
    if (!amount) {
      return BigNumber.from(0);
    }
    return BigNumber.from(Big(amount).div(Big(10).pow(CommonConstants.CKB_DECIMALS)).toString());
  }
}