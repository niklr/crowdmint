import { CommonUtil } from "./utils/common.util";

const runAsync = async () => {
  console.log('worker started')

  try {
    await CommonUtil.timeout(2000)
  } catch (e) {
    console.error(e)
  }

  console.log('worker finished')

  return
}

runAsync().then(() => {
  process.exit(0)
})