import React, { useState, useEffect } from 'react';
import { Alert, Container } from 'react-bootstrap';

function MessageManager() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Récupérer les messages du localStorage
        const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
        setMessages(storedMessages);
    }, []);

    return (
        <Container className="mt-5">
            {messages.length > 0 ? (
                messages.map((message, index) => (
                    <Alert key={index} variant={message.variant || 'info'} className="mt-3">
                        {message.text}
                    </Alert>
                ))
            ) : (
                <Alert variant="info" className="mt-3">
                    No messages to display.
                </Alert>
            )}
        </Container>
    );
}

export { MessageManager };