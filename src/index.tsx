import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'

import theme from './data/uiTheme'
import CssBaseline from '@mui/material/CssBaseline'

import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
	<ThemeProvider theme={theme}>
		<CssBaseline />
		<App />
	</ThemeProvider>
)
