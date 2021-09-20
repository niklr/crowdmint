import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';

interface Props {
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  variant?: 'text' | 'outlined' | 'contained'
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  autoFocus?: boolean
  callbackFn: () => Promise<void>
}

export const ClickOnceButton: React.FC<Props> = (props: Props) => {
  const [isDisabled, setIsDisabled] = React.useState(false)

  const handleClick = async () => {
    setIsDisabled(true)
    try {
      await props.callbackFn()
    } catch (error) {
      console.log(error)
    }
    setIsDisabled(false)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <Button
          size={props.size ?? "small"}
          variant={props.variant ?? "contained"}
          color={props.color ?? "primary"}
          onClick={handleClick}
          disabled={isDisabled}
          autoFocus={props.autoFocus}>
          {props.children}
        </Button>
        {isDisabled && <CircularProgress size={20} sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: -10,
          marginLeft: -12,
        }} />}
      </Box>
    </Box>
  );
}
