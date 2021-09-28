import { GenericType, Network } from "../util/types"

export const CommonConstants = {
  APP_NAME: 'CROWDMINT',
  WALLET_CONNECTOR_STORAGE_KEY: 'crowdmint:wallet-connector',
  PROJECT_MANAGER_CONTRACT: '0xFE585394Def59e63388f43FaD0a0C573E5921cb6',
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