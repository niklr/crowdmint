import { getNervosClient } from '../../../../clients/nervos.client';
import { useConnectedWeb3Context } from '../../../../contexts/connectedWeb3';

export const ProjectList = () => {
  const context = useConnectedWeb3Context();
  const nervosClient = getNervosClient();
  const test = async () => {
    if (context.account) {
      const balance = await nervosClient.rpcProvider.getBalance(context.account);
      console.log(context.account, 'Balance:', balance.toString());

      const projectManager = nervosClient.getProjectManager(context.account);
      const owner = await projectManager.owner();
      const totalProjects = await projectManager.totalProjects();
      console.log('ProjectManager owner:', owner, 'totalProjects:', totalProjects.toString());
    }
  }
  test();
  return (
    <>
      ...
    </>
  );
}
