import { Route, Routes } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import { AuthProvider } from '../context/useAuth.jsx';

import { Logout } from '../assets/Logout.jsx';
import { Login } from '../assets/Login.jsx';
import { Home } from '../assets/Home.jsx';
import { NotFound } from '../assets/NotFound.jsx';
import { Register } from '../assets/Register.jsx';

function MainRouter() {
    return (
		<>
            <AuthProvider>
                <Container>
                    <Routes>
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Container>
            </AuthProvider>
		</>
    );
}

export { MainRouter };