import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/useAuth';

function Home() {
    const { logged } = useAuth();

    const handleClick = () => {
        location.replace('/game.html');
    };

    return(
        <>
            {!logged && <Navigate to="/login" />}
            <Button variant="primary" onClick={handleClick}>
                Jouer !
            </Button>
        </>
    );
}

export { Home };