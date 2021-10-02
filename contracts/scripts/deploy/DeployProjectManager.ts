import { Context } from "../context";

(async () => {
  const context = new Context();
  await context.initAsync();
  await context.deployProjectManager();
  process.exit(0);
})();
