import React, { useRef } from 'react';
import { DateTimePicker } from '@mui/lab';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import { Editor } from '../../../common/components/editor';
import { MomentUtil } from '../../../../util/moment.util';
import { ProjectType, ProjectTypes } from '../../../../common/constants';

export const ProjectCreate = () => {
  const editorRef = useRef(null);
  const momentUtil = new MomentUtil();

  const [type, setType] = React.useState(ProjectTypes[ProjectType.AON].type);
  const [expirationDate, setExpirationDate] = React.useState<Date>(
    momentUtil.get().add(1, 'days').toDate(),
  );

  const handleTypeChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    if (newValue) {
      setType(newValue as string);
    }
  };

  const handleExpirationDateChange = (newValue: Date | null) => {
    if (newValue) {
      setExpirationDate(newValue);
    }
  };

  return (
    <>
      <Typography sx={{ pt: 4 }} variant="h2" component="div" gutterBottom>
        Start a new project 🚀
      </Typography>
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <Paper>
            <Box sx={{ p: 2 }}>
              <TextField label="Title" variant="outlined" fullWidth />
            </Box>
          </Paper>
          <Paper ref={editorRef} sx={{ maxHeight: "800px", minHeight: "600px", my: 2, overflow: "auto" }}>
            <Editor editorRef={editorRef} readOnly={false} markdownUrl={'https://raw.githubusercontent.com/nhn/tui.editor/master/apps/react-editor/README.md'}></Editor>
          </Paper>
          <Paper>
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Button sx={{ width: "40%" }} variant="contained" color="primary">
                Submit
              </Button>
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
                      value={type}
                      label="Type"
                      onChange={handleTypeChange}
                    >
                      <MenuItem value={ProjectTypes[ProjectType.AON].type}>{ProjectTypes[ProjectType.AON].name}</MenuItem>
                      <MenuItem value={ProjectTypes[ProjectType.KIA].type}>{ProjectTypes[ProjectType.KIA].name}</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <DateTimePicker
                  label="Expiration date"
                  value={expirationDate}
                  onChange={handleExpirationDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
