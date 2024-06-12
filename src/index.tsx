import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { createTheme } from '@mui/material';

import CssBaseline from '@mui/material/CssBaseline';

import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root')!);

root.render(
	<>
		<ThemeProvider theme={createTheme({ palette: { mode: 'dark', text: { primary: '#C7C7C7' } }, typography: { fontFamily: 'monospace' } })}>
			<CssBaseline />
			<App />
		</ThemeProvider>
	</>
);
