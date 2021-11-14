import { Event } from "@ethersproject/contracts";
import { getNervosClient } from "./clients/nervos.client";
import { ProjectManager } from "./typechain";
import { getLogger } from "./utils/logger";
import { ProjectEventContainer } from "./utils/types";
require('dotenv').config()

const logger = getLogger();

const getAllEventsAsync = async (pm: ProjectManager, fromBlock: number) => {

  const container: ProjectEventContainer = {
    blockNumber: 0,
    events: new Set()
  }
  const createdEvents = await pm.queryFilter(pm.filters.ProjectCreated(), fromBlock)
  const updatedEvents = await pm.queryFilter(pm.filters.ProjectUpdated(), fromBlock)
  filterEventsAsync(container, createdEvents)
  filterEventsAsync(container, updatedEvents)
  console.log(container)
  return container
}

const filterEventsAsync = async (container: ProjectEventContainer, events: Event[]) => {
  if (events?.length > 0) {
    for (const e of events) {
      if (e.blockNumber > container.blockNumber) {
        container.blockNumber = e.blockNumber + 1
      }
      logger.info(e)()
      const decoded = e.decode(e.data, e.topics)
      container.events.add(decoded.url)
    }
  }
}

const runAsync = async () => {
  logger.info('test started')()

  const client = getNervosClient()
  const pm = await client.getProjectManagerAsync()

  const currentBlock = await client.rpcProvider.getBlockNumber()
  const events = await client.getEventsByBlockAsync(pm, pm.filters.ProjectCreated(), 0, currentBlock)
  console.log(events)

  // const tx = await client.rpcProvider.getTransaction("0xb17649b5ec4ac4e921a5766229485f721ce402b673f7cc18156468a60ab930b8")
  // console.log(tx)
  // const block = await client.rpcProvider.getBlock(tx.blockHash)
  // console.log(block)

  // await getAllEventsAsync(pm, 0)

  logger.info('test ended')()

  return
}

runAsync().then(() => {
  process.exit(0)
})