import { createRoot } from 'react-dom/client'
import { createTheme, ThemeProvider } from '@mui/material'

import CssBaseline from '@mui/material/CssBaseline'

import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
	<ThemeProvider
		theme={createTheme({
			palette: { mode: 'dark', text: { primary: '#C7C7C7' } },
			typography: { fontFamily: 'monospace' },
		})}
	>
		<CssBaseline />
		<App />
	</ThemeProvider>
)
