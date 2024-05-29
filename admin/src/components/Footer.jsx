import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';

function Footer() {
    return(
        <footer style={{ marginTop: 'auto' }}>
          <Container>
            <Row>
              <Col>
                Footer
              </Col>
            </Row>
          </Container>
        </footer>
    );
}

export { Footer };