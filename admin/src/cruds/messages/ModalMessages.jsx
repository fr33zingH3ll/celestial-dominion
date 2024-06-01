import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { get_of } from '../../Api';

function ModalMessages(props) {
    const [message, setMessage] = useState();

    useEffect(() => {
        const fetchMessage = async () => {
            const result = await get_of('message', props.messageId);
            setMessage(result);
        };

        if (props.showModal) {
            fetchMessage();
        }
    }, [props.showModal]);


    return (
        <>
            {message ? (
                <Modal show={props.showModal} onHide={props.handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formId">
                                <Form.Label>ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="id"
                                    value={message.id}
                                    readOnly
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group controlId="formMessage">
                                <Form.Label>Message</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="message"
                                    value={message.message}
                                    readOnly
                                    disabled
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={props.handleCloseModal}>Close</Button>
                        <Button variant="primary" onClick={() => handleSubmit(message)}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            ) : <p>Loading...</p>}
        </>
    );
}

export { ModalMessages };
