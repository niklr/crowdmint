import { GenericType, Network } from "../util/types"

export const CommonConstants = {
  APP_NAME: 'CROWDMINT',
  WALLET_CONNECTOR_STORAGE_KEY: 'crowdmint:wallet-connector',
  PROJECT_MANAGER_CONTRACT: '0x461F94197D4dde4934f093E12167b2EC86BDA1FC',
  CKB_DECIMALS: 8
}

export const Networks: Network[] = [
  {
    id: 71393,
    name: "Godwoken Testnet"
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