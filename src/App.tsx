import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

export default function App() {
	return (
		<Container sx={{ minHeight: '100vh', width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
			<Box>Header</Box>
			<Box minHeight="90%">
				<div>hi</div>
				<div>hi</div>
				<div>hi</div>
				<div>hi</div>
				<div>hi</div>
				<div>hi</div>
				<div>hi</div>
				<div>hi</div>
				<div>hi</div>
				<div>hi</div>
				<div>hi</div>
			</Box>
			<Box>Footer</Box>
		</Container>
	);
}
