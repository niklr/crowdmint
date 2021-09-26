import { Grid } from '@mui/material';
import { BigNumber } from 'ethers';
import { ListItem } from '../list-item';

interface Props {
  total: BigNumber;
}

export const ProjectList: React.FC<Props> = (props: Props) => {
  console.log(props.total);
  return (
    <>
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
    </>
  );
}
