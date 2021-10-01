import { Event } from "@ethersproject/contracts";
import { getNervosClient } from "./clients/nervos.client";
import { getPinataClient } from "./clients/pinata.client";
import { FileUtilType, getFileUtil } from "./utils/file.util";
import { ProjectEventContainer, SharedData } from "./utils/types";
require('dotenv').config()

const getAllEventsAsync = async (fromBlock: number) => {
  const client = getNervosClient()
  const pm = await client.getProjectManagerAsync()
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
      const decoded = e.decode(e.data, e.topics)
      container.events.add(decoded.url)
    }
  }
}

const pinAsync = async (container: ProjectEventContainer) => {
  const client = getPinataClient()
  if (container?.events?.size > 0) {
    const now = Math.round(new Date().getTime() / 1000);
    let index = 0;
    for (const e of container.events) {
      try {
        const hash = client.getHashFromUrl(e);
        await client.pinAsync(hash, `crowdmint_${now}_${index}`)
        index++
      } catch (error) {
        console.log(error)
      }
    }
  }
}

const runAsync = async () => {
  console.log('worker started')

  const fileUtil = getFileUtil(FileUtilType.Local)
  const filePath = "./src/data/shared.json"
  const file = await fileUtil.readFileAsync(filePath)
  let data: SharedData = JSON.parse(file)

  const result = await getAllEventsAsync(data.blockNumber)
  await pinAsync(result)
  if (result.blockNumber > data.blockNumber) {
    data.blockNumber = result.blockNumber
  }

  fileUtil.writeFile(JSON.stringify(data, null, 2), filePath)

  console.log('worker finished')

  return
}

runAsync().then(() => {
  process.exit(0)
})