import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Input, InputAdornment, InputLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getCommonContext } from '../../../../contexts/common.context';
import { SnackbarUtil } from '../../../../util/snackbar.util';
import { TransformUtil } from '../../../../util/transform.util';
import { Project } from '../../../../util/types';
import { ClickOnceButton } from '../../../common/components/click-once-button';

interface ContributeProject {
  amount: string
}

interface Props {
  open: boolean
  onClose: (success: boolean) => void
  project?: Maybe<Project>
}

export const ProjectContributeDialog: React.FC<Props> = (props: Props) => {
  const commonContext = getCommonContext();

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<ContributeProject>({
    amount: ""
  });

  const handleClose = (success: boolean) => {
    props.onClose(success);
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
      if (!props.project) {
        throw new Error("Project could not be loaded.");
      }
      const amount = TransformUtil.toCKBit(values.amount);
      // console.log(amount.toString(), TransformUtil.toCKByte(amount.toString()).toString())
      if (amount.lt(1)) {
        throw new Error("Invalid amount");
      }
      await commonContext.datasource.contributeAsync(props.project.address, amount);
      handleClose(true);
    } catch (error) {
      SnackbarUtil.enqueueError(error);
    }
  }

  return (
    <Dialog open={open} onClose={() => { handleClose(false) }} maxWidth="xs" fullWidth>
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
        <Button onClick={() => { handleClose(false) }}>Cancel</Button>
        <ClickOnceButton size="medium" color="primary" callbackFn={handleConfirmAsync}>
          Confirm
        </ClickOnceButton>
      </DialogActions>
    </Dialog>
  );
}