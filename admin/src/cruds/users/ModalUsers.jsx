import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { get_of } from '../../Api';

function ModalUsers(props) {
    const [user, setUser] = useState();

    useEffect(() => {
        const fetchUser = async () => {
            const result = await get_of('user', props.userId);
            setUser(result);
        };

        if (props.showModal) {
            fetchUser();
        }
    }, [props.showModal]);


    return (
        <>
            {user ? (
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
                                    value={user.id}
                                    placeholder="ID"
                                    readOnly
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={user.username}
                                    placeholder={user.username}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={props.handleCloseModal}>Close</Button>
                        <Button variant="primary" onClick={() => handleSubmit(user)}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            ) : <p>Loading...</p>}
        </>
    );
}

export { ModalUsers };
