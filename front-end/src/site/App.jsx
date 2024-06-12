import "./index.js";

import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Alert, Button } from 'react-bootstrap';

import { Header } from "./component/Header.jsx";
import { MainRouter } from "./component/MainRouter.jsx";
import { Footer } from "./component/Footer.jsx";


function App() {
	const [show, setShow] = useState(true);

    return (
		<>
		    <div className="container mt-5">
				{show && (
					<Alert variant="success" onClose={() => setShow(false)} dismissible>
						<Alert.Heading>Hey, nice to see you</Alert.Heading>
						<p>
							This is a success alert with a button to dismiss it.
						</p>
					</Alert>
				)}
			</div>
			<BrowserRouter>
				<Header />
				<MainRouter />
				<Footer />
			</BrowserRouter>
		</>
    );
}

export default App;
