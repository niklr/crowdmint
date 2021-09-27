import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { IpfsResult } from '../util/types';

export class IpfsClient {

  private readonly _client: IPFSHTTPClient;

  constructor() {
    this._client = create({
      url: 'https://ipfs.infura.io:5001/api/v0'
    });
  }

  uploadAsync = async (file: Blob): Promise<IpfsResult> => {
    // https://ipfs.infura.io/ipfs/QmdF1fEPJHgvxGxRehrJbSzvGK2U4NujAgMDhpiMSytPL6
    // Upload directly to IPFS -> Mint on Nervos -> Send CID (path) + minted token id to GraphQL -> Pin with Pinata
    const result = await this._client.add(file);
    return {
      url: `https://ipfs.infura.io/ipfs/${result.path}`,
      path: result.path,
      size: result.size,
      cid: result.cid
    }
  }
}

const client = new IpfsClient();

export const getIpfsClient = () => {
  return client;
}

/*
export interface AddResult {
  cid: CID
  size: number
  path: string
  mode?: number
  mtime?: Mtime
}

"QmdF1fEPJHgvxGxRehrJbSzvGK2U4NujAgMDhpiMSytPL6"
*/