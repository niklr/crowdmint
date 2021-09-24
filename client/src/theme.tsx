import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
// https://github.com/mui-org/material-ui/tree/master/examples/create-react-app-with-typescript
// 284aa4 c5d5ff c5b7f7 d693de ec3a76 dc0530 cc0000
const theme = createTheme({
  palette: {
    primary: {
      main: '#c5d5ff',
    },
    secondary: {
      main: '#284aa4',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;