import { Grid } from '@mui/material';
import { BigNumber } from 'ethers';
import { ListItem } from '../list-item';

interface Props {
  total: BigNumber;
}

export const ProjectList: React.FC<Props> = (props: Props) => {
  const total = props.total.toNumber();
  const indexes: number[] = [];
  for (let index = total; indexes.length < 5; index--) {
    indexes.push(index);
  }
  console.log("ProjectList indexes", indexes);
  return (
    <>
      {indexes.map((index: number) => (
        <Grid item key={index} xs={12} sm={6} md={4} sx={{ minWidth: "350px" }}>
          <ListItem index={BigNumber.from(index)}></ListItem>
        </Grid>
      ))}
    </>
  );
}
