import { Container, Grid, IconButton, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ListItem } from '../list-item';

export const ProjectList = () => {
  return (
    <>
      <Container sx={{ pt: 6, pb: 6 }} maxWidth="lg">
        <Typography sx={{ fontWeight: 500, ml: "36px" }} textAlign="center">
          Latest projects
          <IconButton sx={{ float: 'right' }} aria-label="refresh">
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item key='1' xs={12} sm={6} md={4} sx={{ minWidth: "350px" }}>
            <ListItem loading={true}></ListItem>
          </Grid>
          <Grid item key='2' xs={12} sm={6} md={4} sx={{ minWidth: "350px" }}>
            <ListItem loading={true}></ListItem>
          </Grid>
          <Grid item key='3' xs={12} sm={6} md={4} sx={{ minWidth: "350px" }}>
            <ListItem loading={true}></ListItem>
          </Grid>
          <Grid item key='4' xs={12} sm={6} md={4} sx={{ minWidth: "350px" }}>
            <ListItem loading={true}></ListItem>
          </Grid>
          <Grid item key='5' xs={12} sm={6} md={4} sx={{ minWidth: "350px" }}>
            <ListItem loading={false}></ListItem>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
