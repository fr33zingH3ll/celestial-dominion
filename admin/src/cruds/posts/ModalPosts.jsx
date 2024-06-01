import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { get_of } from '../../Api';

function ModalPosts(props) {
    const [post, setPost] = useState();

    useEffect(() => {
        const fetchPost = async () => {
            const result = await get_of('post', props.postId);
            setPost(result);
        };

        if (props.showModal) {
            fetchPost();
        }
    }, [props.showModal]);


    return (
        <>
            {post ? (
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
                                    value={post.id}
                                    readOnly
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group controlId="formPost">
                                <Form.Label>Post</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="message"
                                    value={post.message}
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

export { ModalPosts };
