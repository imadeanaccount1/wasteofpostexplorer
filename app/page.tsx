

import * as React from 'react';
import { StyledEngineProvider } from '@mui/joy/styles';

export default function Home() {

return (  <React.StrictMode>
    <StyledEngineProvider injectFirst>
    </StyledEngineProvider>
  </React.StrictMode>
);
}