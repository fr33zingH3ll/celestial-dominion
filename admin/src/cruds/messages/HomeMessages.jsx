import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { useEffect, useState } from 'react';

import { get_all_of } from '../../Api.js';

function HomeMessages() {
    const [messages, setMessages] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleRowClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(()=> {
        const fetchResource = async () => {
            const result = await get_all_of('message');
            setMessages(result);
        };
        fetchResource();
    }, []);

    return(
        <>
            <Table striped bordered hover>
            <thead>
                <tr>
                    <th></th>
                    <th>id</th>
                    <th>description</th>
                </tr>
            </thead>
            <tbody>
                {messages.map((item, index) => (
                    <tr key={item.id} onClick={handleRowClick}>
                        <td>{index + 1}</td>
                        <td>{item.id}</td>
                        <td>{item.description}</td>
                    </tr>
                ))}
            </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal Title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Modal Content</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export { HomeMessages };