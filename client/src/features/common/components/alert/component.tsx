import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { CommonUtil } from '../../../../util/common.util';

interface Props {
  message: string
  type: 'default' | 'warning'
  error?: any
  color?: string
  backgroundColor?: string
}

export const Alert: React.FC<Props> = (props: Props) => {
  let color = '#000000';
  let backgroundColor = '#f2f2f2';

  switch (props.type) {
    case 'warning':
      color = '#611a15';
      backgroundColor = '#fdecea';
      break;
    default:
      break;
  }

  if (props.error) {
    console.log(CommonUtil.toJsonString(props.error));
  }

  return (
    <Paper>
      <Box sx={{
        color: props.color ?? color,
        backgroundColor: props.backgroundColor ?? backgroundColor,
        padding: '15px',
        textAlign: 'center'
      }}>
        <Typography>{props.message}</Typography>
      </Box>
    </Paper>
  );
}
