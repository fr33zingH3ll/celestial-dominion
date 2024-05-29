import React from 'react';
import { useThemeChange } from '../contexts/useThemeChange.jsx';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from 'react-bootstrap';

import { Link } from "react-router-dom";

function NavigationBar() {
	const { themeDark, toggleDarkMode } = useThemeChange();

	return (
		<Navbar bg={themeDark ? 'dark' : 'light'} variant={themeDark ? 'dark' : 'light'}>
			<Container>
				<Navbar.Brand href="#home">Navbar</Navbar.Brand>
				<Nav className="me-auto">
					<Nav.Link>
						<Link to="/">Home 1</Link>
					</Nav.Link>
					<Nav.Link>
						<Link to="/login">Home 2</Link>
					</Nav.Link>
					<Nav.Link>
						<Link to="/">Home 3</Link>
					</Nav.Link>
				</Nav>
				<Button onClick={() => toggleDarkMode(!themeDark)}>
					{themeDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
				</Button>
				{ /* <Menu /> */ }
			</Container>
		</Navbar>
	);
}

export { NavigationBar };
