import pinataSDK, { PinataClient, PinataPinByHashPinOptions, PinataPinListResponseRow } from '@pinata/sdk';
import { CommonConstants } from '../common/constants';
import { Ensure } from '../utils/ensure';

export class CustomPinataClient {
  private static instance: CustomPinataClient;
  private readonly _client: PinataClient;

  constructor(apiKey: string, apiSecret: string) {
    this._client = pinataSDK(apiKey, apiSecret);
    this._client.testAuthentication();
  }

  static getInstance(): CustomPinataClient {
    if (!CustomPinataClient.instance) {
      Ensure.notNullOrWhiteSpace(process.env.PINATA_API_KEY, 'process.env.PINATA_API_KEY');
      Ensure.notNullOrWhiteSpace(process.env.PINATA_API_SECRET, 'process.env.PINATA_API_SECRET');
      CustomPinataClient.instance = new CustomPinataClient(String(process.env.PINATA_API_KEY), String(process.env.PINATA_API_SECRET));
    }

    return CustomPinataClient.instance;
  }

  getHashFromUrl = (url?: string) => {
    if (url && url.startsWith(CommonConstants.BASE_IPFS_URL)) {
      return url.substr(CommonConstants.BASE_IPFS_URL.length, url.length - 1);
    }
    return undefined;
  }

  findByNameAsync = async (name: string): Promise<PinataPinListResponseRow | undefined> => {
    const result = await this._client.pinList({
      metadata: {
        name: name,
        keyvalues: {

        }
      }
    });
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return undefined;
  }

  unpinAsync = async (hash: string) => {
    try {
      await this._client.unpin(hash);
    } catch {
      // ignore error
    }
  }

  pinAsync = (hash: string, name: string) => {
    Ensure.notNullOrWhiteSpace(hash, 'hash');
    Ensure.notNullOrWhiteSpace(name, 'name');
    const options: PinataPinByHashPinOptions = {
      pinataMetadata: {
        name
      }
    };
    return this._client.pinByHash(hash, options);
  }
}

export const getPinataClient = () => {
  return CustomPinataClient.getInstance();
};