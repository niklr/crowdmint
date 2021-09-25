import React, { useRef, useState } from 'react';
import { DateTimePicker } from '@mui/lab';
import { Box, FormControl, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, Slider, Stack, TextField, Typography } from '@mui/material';
import { BigNumber } from 'ethers';
import { Editor } from '../../../common/components/editor';
import { MomentUtil } from '../../../../util/moment.util';
import { ProjectType, ProjectTypes } from '../../../../common/constants';
import { useConnectedWeb3Context } from '../../../../contexts/connectedWeb3';
import { SnackbarUtil } from '../../../../util/snackbar.util';
import { getLogger } from '../../../../util/logger';
import { Ensure } from '../../../../util/ensure';
import { ClickOnceButton } from '../../../common/components/click-once-button';

interface CreateProject {
  type: string;
  title: string;
  goal: string;
  expirationDate: Date | null;
}

const logger = getLogger();

export const ProjectCreate = () => {
  const editorRef = useRef(null);
  const momentUtil = new MomentUtil();
  const context = useConnectedWeb3Context();

  const [values, setValues] = useState<CreateProject>({
    type: ProjectTypes[ProjectType.AON].type,
    title: "",
    goal: "",
    expirationDate: momentUtil.get().add(1, "days").toDate()
  });

  const handleTypeChange = (event: SelectChangeEvent) => {
    setValues({ ...values, type: event.target.value });
  };

  const handleExpirationDateChange = (newValue: Date | null) => {
    setValues({ ...values, expirationDate: newValue });
  };

  const handleChange = (prop: keyof CreateProject) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const createProjectAsync = async () => {
    try {
      Ensure.notNullOrWhiteSpace(context.account, "context.account", "Please connect your wallet first.");
      Ensure.notNullOrWhiteSpace(values.title, "title", "Please enter a title.");
      Ensure.notNullOrWhiteSpace(values.type, "type", "Please specify a valid project type.");
      Ensure.notNullOrWhiteSpace(values.goal, "goal", "Please specify a valid goal.");
      Ensure.notNull(values.expirationDate, "expirationDate", "Please specify a valid expiration date.");
      if (values.title?.length > 48) {
        throw new Error("Title is too long.")
      }
      const now = Math.floor(Date.now() / 1000);
      const expirationDate = values.expirationDate as Date;
      const deadline = Math.floor(expirationDate.getTime() / 1000);
      if (now >= deadline) {
        throw new Error("Expiration date is in the past.");
      }
      const goal = BigNumber.from(values.goal);
      if (goal.lte(0)) {
        throw new Error("Goal is not valid.");
      }

      const id = now.toString();
      const tx = await context.datasource.createProjectAsync(id, values.type, values.title, "http://localhost:3000/#/", goal, BigNumber.from(deadline));
      console.log(tx);
    } catch (error) {
      logger.error(error)();
      SnackbarUtil.enqueueError(error);
    }
  }

  return (
    <>
      <Typography sx={{ pt: 4 }} variant="h2" component="div" gutterBottom>
        Start a new project 🚀
      </Typography>
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <Paper>
            <Box sx={{ p: 2 }}>
              <FormControl fullWidth>
                <InputLabel htmlFor="title-input">Title</InputLabel>
                <OutlinedInput
                  id="title-input"
                  value={values.title}
                  label="Title"
                  autoComplete="off"
                  onChange={handleChange('title')}
                />
              </FormControl>
            </Box>
          </Paper>
          <Paper ref={editorRef} sx={{ maxHeight: "800px", minHeight: "600px", my: 2, overflow: "auto" }}>
            <Editor editorRef={editorRef} readOnly={false} markdownUrl={'https://raw.githubusercontent.com/nhn/tui.editor/master/apps/react-editor/README.md'}></Editor>
          </Paper>
          <Paper>
            <Box sx={{ p: 2 }}>
              <Box sx={{ width: "40%", margin: "auto" }}>
                <ClickOnceButton size="medium" color="primary" callbackFn={createProjectAsync} fullWidth={true}>
                  Submit
                </ClickOnceButton>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item md={4} xs={12}>
          <Paper>
            <Box sx={{ display: 'flex', p: 2, bgcolor: "secondary.main" }}>
              <Typography variant="h5">Project details</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Stack spacing={3}>
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <InputLabel id="project-type-select-label">Type</InputLabel>
                    <Select
                      labelId="project-type-select-label"
                      id="project-type-select"
                      value={values.type}
                      label="Type"
                      autoComplete="off"
                      onChange={handleTypeChange}
                    >
                      <MenuItem value={ProjectTypes[ProjectType.AON].type}>{ProjectTypes[ProjectType.AON].name}</MenuItem>
                      <MenuItem value={ProjectTypes[ProjectType.KIA].type}>{ProjectTypes[ProjectType.KIA].name}</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="goal-input">Goal</InputLabel>
                  <OutlinedInput
                    id="goal-input"
                    value={values.goal}
                    label="Goal"
                    autoComplete="off"
                    onChange={handleChange('goal')}
                    startAdornment={<InputAdornment position="start">$CKB</InputAdornment>}
                  />
                </FormControl>
                <DateTimePicker
                  value={values.expirationDate}
                  label="Expiration date"
                  onChange={handleExpirationDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
                <TextField
                  defaultValue={1000}
                  label="NFT shares"
                  type="number"
                />
                <Box>
                  <Typography gutterBottom>
                    Overfunding distribution
                  </Typography>
                  <Slider defaultValue={50} valueLabelDisplay="auto" />
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
