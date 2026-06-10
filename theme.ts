'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-source-sans-pro)',
  },
  cssVariables: true,
});

export default theme;
