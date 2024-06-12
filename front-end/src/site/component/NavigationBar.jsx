import React from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from 'react-bootstrap';

import { Link } from "react-router-dom";

function NavigationBar() {

	return (
		<Navbar>
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
						<Link to="/register">Home 3</Link>
					</Nav.Link>
				</Nav>
				{ /* <Menu /> */ }
			</Container>
		</Navbar>
	);
}

export { NavigationBar };
