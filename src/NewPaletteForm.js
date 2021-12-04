import React from 'react';
import { styled /*useTheme*/ } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Button from '@mui/material/Button';
import DraggableColorBox from './DraggableColorBox';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { ChromePicker } from 'react-color';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import ListItem from '@mui/material/ListItem';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 400;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
	({ theme, open }) => ({
		flexGrow: 1,
		height: 'calc(100vh - 64px)',
		padding: theme.spacing(3),
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: `-${drawerWidth}px`,
		...(open && {
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
			marginLeft: 0,
		}),
	})
);

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	transition: theme.transitions.create(['margin', 'width'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: `${drawerWidth}px`,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: 'flex-end',
}));

export default function NewPaletteForm() {
	// const theme = useTheme();
	// const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const [currentColor, setColor] = React.useState('teal');
	const [colors, setNewColor] = React.useState([
		{ color: 'blue', name: 'blue' },
	]);
	const [newName, setNewName] = React.useState('');

	React.useEffect(() => {
		// validation for color Name
		ValidatorForm.addValidationRule('isColorNameUnique', (value) => {
			return colors.every(
				({ name }) => name.toLowerCase() !== value.toLowerCase()
			);
		});
		// validation for color itself
		ValidatorForm.addValidationRule('isColorUnique', (value) => {
			return colors.every(({ color }) => color !== currentColor);
		});
	});

	const changeColor = (newColor) => {
		setColor(newColor.hex);
	};

	function addNewColor() {
		const newColor = {
			color: currentColor,
			name: newName,
		};
		setNewColor((oldColors) => [...oldColors, newColor]);
		setNewName('');
	}

	const handleChange = (event) => {
		setNewName(event.target.value);
	};

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar position="fixed" open={open}>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						sx={{ mr: 2, ...(open && { display: 'none' }) }}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div">
						Persistent drawer
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
					},
				}}
				variant="persistent"
				anchor="left"
				open={open}
			>
				<DrawerHeader>
					<IconButton onClick={handleDrawerClose}>
						<ChevronLeftIcon />
					</IconButton>
				</DrawerHeader>
				<Divider />
				<Typography variant="h4">Design Your Palette</Typography>
				<div>
					<Button variant="contained" color="error">
						Clear Palette
					</Button>
					<Button variant="contained" color="primary">
						Random Color
					</Button>
				</div>
				<ChromePicker color={currentColor} onChange={changeColor} />
				<ValidatorForm onSubmit={addNewColor}>
					<TextValidator
						value={newName}
						onChange={handleChange}
						validators={[
                            'required',
                            'isColorNameUnique',
                            'isColorUnique']}
						errorMessages={[
							'Enter a color name',
							'Colorname should be unique',
							'Color already used',
						]}
					/>
					<Button
						variant="contained"
						type="submit"
						color="primary"
						style={{ backgroundColor: currentColor }}
					>
						ADD BUTTON
					</Button>
				</ValidatorForm>
			</Drawer>
			<Main open={open}>
				<DrawerHeader />
				{colors.map((color) => (
					<DraggableColorBox color={color.color} name={color.name} />
				))}
			</Main>
		</Box>
	);
}
