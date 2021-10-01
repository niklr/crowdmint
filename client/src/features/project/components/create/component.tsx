import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { DateTimePicker } from '@mui/lab';
import { Box, FormControl, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, Slider, Stack, TextField, Typography } from '@mui/material';
import { Editor } from '../../../common/components/editor';
import { MomentUtil } from '../../../../util/moment.util';
import { ProjectType, ProjectTypes } from '../../../../common/constants';
import { useConnectedWeb3Context } from '../../../../contexts/connectedWeb3';
import { SnackbarUtil } from '../../../../util/snackbar.util';
import { getLogger } from '../../../../util/logger';
import { ClickOnceButton } from '../../../common/components/click-once-button';
import { getProjectService } from '../../../../services/project.service';
import { SaveProject } from '../../../../util/types';
import { TransformUtil } from '../../../../util/transform.util';

const logger = getLogger();

export const ProjectCreate = () => {
  const history = useHistory();
  const containerRef = useRef(null);
  const editorRef = React.createRef<any>();
  const momentUtil = new MomentUtil();
  const context = useConnectedWeb3Context();
  const projectService = getProjectService();
  const baseMarkdownUrl = 'https://raw.githubusercontent.com/niklr/hopr-network-graph/main/README.md';

  const [values, setValues] = useState<SaveProject>({
    category: ProjectTypes[ProjectType.AON].type,
    title: "",
    description: "",
    goal: "",
    expirationTimestamp: TransformUtil.toTimestamp(momentUtil.get().add(1, "days").toDate())
  });

  const getDate = (timestamp: any) => {
    return momentUtil.getFromUnix(timestamp).toDate();
  }

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setValues({ ...values, category: event.target.value });
  };

  const handleExpirationDateChange = (newValue: Date | null) => {
    setValues({ ...values, expirationTimestamp: TransformUtil.toTimestamp(new Date(newValue?.toString() ?? 0)) });
  };

  const handleChange = (prop: keyof SaveProject) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const createProjectAsync = async () => {
    try {
      const markdown = editorRef?.current?.getInstance().getMarkdown();
      const projectAddress = await projectService.createAsync(context, values, markdown);
      SnackbarUtil.enqueueMessage("Project created!");
      history.push(`/projects/${projectAddress}`);
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
          <Paper ref={containerRef} sx={{ maxHeight: "800px", minHeight: "670px", my: 2, overflow: "auto" }}>
            <Editor containerRef={containerRef} editorRef={editorRef} readOnly={false} markdownUrl={baseMarkdownUrl}></Editor>
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
                <FormControl fullWidth>
                  <InputLabel htmlFor="description-input">Description</InputLabel>
                  <OutlinedInput
                    id="description-input"
                    value={values.description}
                    label="Description"
                    autoComplete="off"
                    multiline
                    rows={4}
                    size="small"
                    onChange={handleChange('description')}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="project-category-select-label">Type</InputLabel>
                  <Select
                    labelId="project-category-select-label"
                    id="project-category-select"
                    value={values.category}
                    label="Category"
                    autoComplete="off"
                    onChange={handleCategoryChange}
                  >
                    <MenuItem value={ProjectTypes[ProjectType.AON].type}>{ProjectTypes[ProjectType.AON].name}</MenuItem>
                    <MenuItem value={ProjectTypes[ProjectType.KIA].type}>{ProjectTypes[ProjectType.KIA].name}</MenuItem>
                  </Select>
                </FormControl>
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
                  value={getDate(values.expirationTimestamp)}
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
