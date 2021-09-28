import { GenericType, Network } from "../util/types"

export const CommonConstants = {
  APP_NAME: 'CROWDMINT',
  WALLET_CONNECTOR_STORAGE_KEY: 'crowdmint:wallet-connector',
  PROJECT_MANAGER_CONTRACT: '0xb63E3C81afD5F8401ed1ab2f47ac6cBCbc810B8f',
  PROJECT_TITLE_MAX_LENGTH: 48,
  PROJECT_DESCRIPTION_MAX_LENGTH: 256,
  CKB_DECIMALS: 8
}

export const Networks: Network[] = [
  {
    id: 71393,
    name: "Godwoken Testnet"
  },
  {
    id: 1024777,
    name: "Godwoken Devnet"
  }
]

export enum ProjectType {
  AON = 0,
  KIA = 1
}

export const ProjectTypes: GenericType[] = [
  {
    name: "All-Or-Nothing",
    type: "AON"
  },
  {
    name: "Keep-It-All",
    type: "KIA"
  }
]