import { useState } from 'react';
import { useThemeChange } from '../contexts/useThemeChange.jsx';

import Image from 'react-bootstrap/Image';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function Menu() {
    const { themeDark } = useThemeChange();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Row>
                <Col xs={0} md={0}>
                    <Image src="holder.js/171x180" onClick={handleShow} roundedCircle style={{ width: '4em', height: '4em' }} />
                </Col>
            </Row>

            <Offcanvas show={show} onHide={handleClose} placement={"end"} bg={themeDark ? 'dark' : 'light'} variant={themeDark ? 'dark' : 'light'}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    Some text as placeholder. In real life you can have the elements you
                    have chosen. Like, text, images, lists, etc.
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export { Menu };