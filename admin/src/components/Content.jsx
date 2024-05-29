import { Route, Routes, Navigate } from 'react-router-dom';

import { Logout } from '../assets/Logout.jsx';
import { Login } from '../assets/login.jsx';
import { Home } from '../assets/Home.jsx';
import { NotFound } from '../assets/NotFound.jsx';

import { AuthProvider } from '../contexts/useAuth.jsx';

import Container from 'react-bootstrap/Container';

function Content() {

    return(
        <>
            <AuthProvider>
                <Container>
                    <Routes>
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Container>
            </AuthProvider>
        </>
    );
}

export { Content };