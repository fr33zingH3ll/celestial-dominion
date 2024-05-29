import React, { useEffect } from 'react';
import './index.js';
import { BrowserRouter } from 'react-router-dom';

import { Header } from './components/Header.jsx';
import { Content } from './components/Content.jsx';
import { Footer } from './components/Footer.jsx';

import { useThemeChange } from './contexts/useThemeChange.jsx';
function App() {
	const { themeDark } = useThemeChange();

    return (
		<div className={themeDark ? 'bg-dark text-white vh-100' : 'bg-light text-dark vh-100'} style={{ minHeight: '100vh', width: '100vw' }}>
			<BrowserRouter>
				<Header />
				<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
					<Content />
					<Footer />
				</div>
			</BrowserRouter>
		</div>
    );
}

export default App;
