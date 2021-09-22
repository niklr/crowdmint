import { Button, Container, Grid, IconButton, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { BigNumber } from 'ethers';
import { getNervosClient } from '../../../../clients/nervos.client';
import { useConnectedWeb3Context } from '../../../../contexts/connectedWeb3';
import { ListItem } from '../list-item';

export const ProjectList = () => {
  const context = useConnectedWeb3Context();
  const nervosClient = getNervosClient();
  const test = async () => {
    if (context.account) {
      const balance = await nervosClient.rpcProvider.getBalance(context.account);
      console.log(context.account, 'Balance:', balance.toString());

      const projectManager = nervosClient.getProjectManager(context.account);
      const timestamp = await projectManager.getTimestamp();
      const totalProjects = await projectManager.totalProjects();
      console.log('ProjectManager timestamp:', timestamp.toString(), 'totalProjects:', totalProjects.toString());
    }
  }
  test();
  const createProjectAsync = async () => {
    try {
      if (context.account) {
        const projectManager = nervosClient.getProjectManager(context.account);
        const id = Math.floor(Date.now() / 1000).toString();
        const deadline = BigNumber.from(Math.floor(Date.now() / 1000) + 3600);
        const tx = await projectManager.create(id, "KIA", "hello world", "http://localhost:3000/#/", BigNumber.from(1234), deadline);
        console.log(tx);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Button sx={{ marginTop: 2 }} variant="contained" color="primary" onClick={createProjectAsync}>
        Create project
      </Button>
      <Container sx={{ paddingTop: 6, paddingBottom: 6 }} maxWidth="md">
        <Typography sx={{ fontWeight: 500 }} textAlign="center">
          Latest projects
          <IconButton sx={{ float: 'right' }} aria-label="refresh">
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Typography>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item key='1' xs={12} sm={6} md={4}>
            <ListItem loading={true}></ListItem>
          </Grid>
          <Grid item key='2' xs={12} sm={6} md={4}>
            <ListItem loading={false}></ListItem>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
