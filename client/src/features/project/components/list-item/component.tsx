import * as React from 'react';
import {
  Chip,
  Grid,
  Tooltip,
  Skeleton,
  Card,
  CardHeader,
  IconButton,
  CardContent,
  Typography,
  Avatar,
  CardMedia
} from '@mui/material';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { Box } from '@mui/system';
import { MomentUtil } from '../../../../util/moment.util';

interface MediaProps {
  loading?: boolean;
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.primary">
          {`${Math.round(props.value,)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export const ListItem = (props: MediaProps) => {
  const { loading = false } = props;
  const momentUtil = new MomentUtil();

  const formatTimestamp = (timestamp: any) => {
    return momentUtil.getLocalReverseFormatted(momentUtil.getFromUnix(timestamp));
  }

  const color = '#cc0000';

  return (
    <Card sx={{ m: 2 }}>
      <CardHeader sx={{ paddingBottom: 1 }}
        avatar={
          loading ? (
            <Skeleton animation="wave" variant="circular" width={40} height={40} />
          ) : (
            <Tooltip title="Placeholder" placement="top" arrow>
              <Avatar>&nbsp;</Avatar>
            </Tooltip>
          )
        }
        // action={
        //   loading ? null : (
        //     <IconButton aria-label="settings">
        //       <MoreVertIcon />
        //     </IconButton>
        //   )
        // }
        title={
          loading ? (
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          ) : (
            <Grid container>
              <Grid item xs={8} sx={{ whiteSpace: "nowrap" }}>
                <Box component="div" textOverflow="ellipsis" overflow="hidden">
                  Overflow Hiddennnnnnnnnnnnnnnnnnnnnnnnnnn
                </Box>
                <Box sx={{ position: "relative" }}>
                  <Typography variant="caption" color="GrayText">
                    {formatTimestamp('1632462812')}
                  </Typography>
                  <Typography variant="caption" color="GrayText" sx={{ position: "absolute", top: 1, right: 0 }}>
                    <b>Expired</b>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              </Grid>
            </Grid>
          )
        }
        subheader={
          loading ? (
            <Skeleton animation="wave" height={10} width="40%" />
          ) : (
            <>
            </>
          )
        }
      />
      {
        loading ? (
          <Skeleton sx={{ height: 20, marginBottom: 1 }} animation="wave" variant="rectangular" />
        ) : (
          <Box>
            {/* <CardMedia
            component="img"
            height="140"
            image="https://pi.tedcdn.com/r/talkstar-photos.s3.amazonaws.com/uploads/72bda89f-9bbf-4685-910a-2f151c4f3a8a/NicolaSturgeon_2019T-embed.jpg?w=512"
            alt="Nicola Sturgeon on a TED talk stage"
          /> */}
          </Box>
        )
      }
      <CardContent sx={{ paddingTop: 0 }}>
        {loading ? (
          <React.Fragment>
            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>
        ) : (
          <>
            {/* <Typography variant="body2" color="text.secondary" component="p">
              {
                "Why First Minister of Scotland Nicola Sturgeon thinks GDP is the wrong measure of a country's success:"
              }
            </Typography> */}
            <Box>
              <LinearProgressWithLabel value={75} />
            </Box>
            <div style={{ width: "100%", whiteSpace: "nowrap" }}>
              <Box component="div" textOverflow="ellipsis" overflow="hidden">
                <Typography variant="body2" align="center">7500 / 10000 CKB</Typography>
              </Box>
            </div>
            <Grid container rowSpacing={0} columnSpacing={2} sx={{ marginTop: 1 }}>
              <Grid item xs={6}>
                <Tooltip title="0x61d64AfBbD3b5CC2D0554A8a92aa5C7540501E7c" arrow>
                  <Chip sx={{ width: "100%" }} icon={<DescriptionOutlinedIcon />} label="0x61d64AfBbD3b5CC2D0554A8a92aa5C7540501E7c" size="small" />
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <Tooltip title="0x61d64AfBbD3b5CC2D0554A8a92aa5C7540501E7c">
                  <Chip sx={{ width: "100%" }} icon={<PersonOutlineRoundedIcon />} label="0x61d64AfBbD3b5CC2D0554A8a92aa5C7540501E7c" size="small" />
                </Tooltip>
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card >
  );
}