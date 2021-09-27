import React, { useEffect, useState } from 'react';
import Big from 'big.js';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControl, InputLabel, Input, InputAdornment } from '@mui/material';
import { Project } from '../../../../util/types';
import { ClickOnceButton } from '../../../common/components/click-once-button';
import { CommonUtil } from '../../../../util/common.util';
import { SnackbarUtil } from '../../../../util/snackbar.util';
import { CommonConstants } from '../../../../common/constants';

interface ContributeProject {
  amount: string
}

interface Props {
  open: boolean
  onClose: () => void
  project?: Maybe<Project>
}

export const ProjectContributeDialog: React.FC<Props> = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<ContributeProject>({
    amount: ""
  });

  const handleClose = () => {
    props.onClose();
    setOpen(false);
  };

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleChange = (prop: keyof ContributeProject) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleConfirmAsync = async () => {
    try {
      const amount = CommonUtil.toCKBit(values.amount);
      console.log(amount.toString(), CommonUtil.toCKByte(amount.toString()).toString())
      if (amount.lt(1)) {
        throw new Error("Invalid amount");
      }
    } catch (error) {
      SnackbarUtil.enqueueError(error);
    }
    await CommonUtil.timeout(2000);
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Contribute</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {props.project?.title}
        </DialogContentText>
        <FormControl fullWidth sx={{ mt: 2 }} variant="standard" >
          <InputLabel htmlFor="contribute-amount">Amount</InputLabel>
          <Input
            id="contribute-amount"
            value={values.amount}
            onChange={handleChange('amount')}
            type="number"
            autoFocus
            startAdornment={<InputAdornment position="start">$CKB</InputAdornment>}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <ClickOnceButton size="medium" color="primary" callbackFn={handleConfirmAsync}>
          Confirm
        </ClickOnceButton>
      </DialogActions>
    </Dialog>
  );
}