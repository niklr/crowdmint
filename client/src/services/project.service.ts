import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { getApolloClient } from '../clients/apollo.client';
import { getIpfsClient, IpfsClient } from '../clients/ipfs.client';
import { CommonUtil } from '../util/common.util';

class ProjectService {

  private readonly _apollo: ApolloClient<NormalizedCacheObject>;
  private readonly _ipfs: IpfsClient;

  constructor() {
    this._apollo = getApolloClient();
    this._ipfs = getIpfsClient();
  }

  async saveAsync(markdown: any): Promise<string> {
    if (CommonUtil.isNullOrWhitespace(markdown)) {
      throw new Error("Please enter content in the markdown editor.");
    }

    const ipfsResult = await this._ipfs.uploadAsync(markdown);
    return ipfsResult.url;
  }
}

const service = new ProjectService();

export const getProjectService = () => {
  return service;
}