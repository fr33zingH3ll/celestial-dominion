import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import { useEffect, useState } from 'react';

import { delete_of, get_all_of } from '../../Api.js';
import { ModalMessages } from './ModalMessages.jsx';

function HomeMessages() {
    const [messages, setMessages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [messageId, setMessageId] = useState();
    const [count, setCount] = useState(0);

    const handleRowClick = (id) => {
        setShowModal(true);
        setMessageId(id);
    };

    const handleSupButton = (id, index) => {
        const supMessage = async (id) => {
            await delete_of('message', id);
        };
        setCount(count + 1);
        supMessage(id);
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
    }, [count]);

    return(
        <>
            <Table striped bordered hover>
            <thead>
                <tr>
                    <th></th>
                    <th>id</th>
                    <th>description</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {messages.map((item, index) => (
                    <tr key={item.id}>
                        <td onClick={() => handleRowClick(item.id)}>{index + 1}</td>
                        <td onClick={() => handleRowClick(item.id)}>{item.id}</td>
                        <td onClick={() => handleRowClick(item.id)}>{item.message}</td>
                        <td>
                        <ButtonGroup aria-label="Basic example">
                            <Button variant="danger" onClick={() => handleSupButton(item.id, index)}>a</Button>
                        </ButtonGroup>
                        </td>
                    </tr>
                ))}
            </tbody>
            </Table>
            <ModalMessages
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                messageId={messageId}
            />
        </>
    );
}

export { HomeMessages };