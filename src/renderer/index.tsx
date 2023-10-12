import { createRoot } from 'react-dom/client';
import './service/ipc-service';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import App from './App';

// A custom theme for this app
const theme = createTheme({
  palette: {
    error: {
      main: red.A400,
    },
  },
});
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <App />
  </ThemeProvider>,
);
