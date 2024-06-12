import { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

import { useAuth } from '../context/useAuth.jsx';

import { login } from '../../../api.js';

function Login() {
    const { logged } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let result;

        await login(formData.username, formData.password);
    };

    return (
        <Container style={{ display : 'flex',justifyContent: 'center', alignItems : 'center', minHeight : '100vh' }}>
            <Form style={{ maxWidth : '20vw' }} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Pseudonyme</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter pseudonyme"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <Form.Text className="text-muted">
                        Pseudonyme is your username in game.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export { Login };
