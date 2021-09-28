import { Grid } from '@mui/material';
import { BigNumber } from 'ethers';
import { Alert } from '../../../common/components/alert';
import { ListItem } from '../list-item';

interface Props {
  total: BigNumber;
}

export const ProjectList: React.FC<Props> = (props: Props) => {
  const total = props.total.toNumber();
  const indexes: number[] = [];
  for (let index = total; indexes.length < 5 && indexes.length < total; index--) {
    indexes.push(index);
  }
  console.log("ProjectList indexes", indexes);

  if (indexes.length <= 0) {
    return (
      <Grid item key='1' xs={12} md={6}>
        <Alert message="No projects found." type="default"></Alert>
      </Grid>
    );
  }

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
