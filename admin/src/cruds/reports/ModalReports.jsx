import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { get_of } from '../../Api';

function ModalReports(props) {
    const [report, setReports] = useState();

    useEffect(() => {
        const fetchMessage = async () => {
            const result = await get_of('report', props.reportId);
            setReports(result);
        };

        if (props.showModal) {
            fetchMessage();
        }
    }, [props.showModal]);


    return (
        <>
            {report ? (
                <Modal show={props.showModal} onHide={props.handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Report</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formId">
                                <Form.Label>ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="id"
                                    value={report.id}
                                    readOnly
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group controlId="formReport">
                                <Form.Label>Report</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="report"
                                    value={report.message}
                                    readOnly
                                    disabled
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={props.handleCloseModal}>Close</Button>
                        <Button variant="primary" onClick={() => handleSubmit(report)}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            ) : <p>Loading...</p>}
        </>
    );
}

export { ModalReports };
