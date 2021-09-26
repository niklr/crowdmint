import { Container, Grid, IconButton, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useQuery } from '@apollo/client';
import { BigNumber } from 'ethers';
import { GetTotalProjects } from '../../../../queries/__generated__/GetTotalProjects';
import { GET_TOTAL_PROJECTS_QUERY } from '../../../../queries/project';
import { Alert } from '../../../common/components/alert';
import { FormatUtil } from '../../../../util/format.util';
import { ProjectList } from '../list';

export const LatestProjects = () => {
  const totalProjectsQuery = useQuery<GetTotalProjects>(GET_TOTAL_PROJECTS_QUERY, {
    fetchPolicy: 'network-only'
  });

  const error = totalProjectsQuery.error;
  const loading = totalProjectsQuery.loading;

  const refetchAll = async () => {
    await totalProjectsQuery.refetch();
  };

  return (
    <Container sx={{ pt: 6, pb: 6 }} maxWidth="lg">
      <Typography sx={{ fontWeight: 500, ml: "36px" }} textAlign="center">
        Latest projects
        <IconButton sx={{ float: 'right' }} aria-label="refresh" onClick={() => refetchAll()}>
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Typography>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {loading || error ? (
          <Grid item key='1' xs={12} md={6}>
            {loading ? (
              <Alert message="Loading..." type="default" ></Alert>
            ) : (
              <Alert message={FormatUtil.formatMessage(error)} type="warning"></Alert>
            )}
          </Grid>
        ) : (
          <ProjectList total={BigNumber.from(totalProjectsQuery.data?.totalProjects ?? 0)}></ProjectList>
        )}
      </Grid>
    </Container>
  );
}
