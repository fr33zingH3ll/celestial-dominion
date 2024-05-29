import Nav from 'react-bootstrap/Nav';

import { Navigate } from 'react-router-dom';

import { useAuth } from '../contexts/useAuth.jsx';
import { useState } from 'react';

import { HomeMessages } from '../cruds/messages/HomeMessages.jsx';
import { HomeUsers } from '../cruds/users/HomeUsers.jsx';
import { HomePosts } from '../cruds/posts/HomePosts.jsx';
import { HomeReports } from '../cruds/reports/HomeReports.jsx';

function Home() {
    const [activeKey, setActiveKey] = useState("link-1");
    const { logged } = useAuth();

    const handleSelect = (selectedKey) => {
        setActiveKey(selectedKey);
    };

    return(
        <>
            {!logged && <Navigate to="/login" />}
            <Nav variant="tabs" activeKey={activeKey} onSelect={handleSelect}>
                <Nav.Item>
                    <Nav.Link eventKey="link-1">Utilisateurs</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">Messages</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-3">Posts</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-4">Reports</Nav.Link>
                </Nav.Item>
            </Nav>

            {activeKey === 'link-1' && (
                <HomeUsers />
            )}

            {activeKey === 'link-2' && (
                <HomeMessages />
            )}

            {activeKey === 'link-3' && (
                <HomePosts />
            )}
            
            {activeKey === 'link-4' && (
                <HomeReports />
            )}
        </>
    );
}

export { Home };