import Table from 'react-bootstrap/Table';


import { useEffect, useState } from 'react';

import { get_all_of } from '../../Api.js';
import { ModalUsers } from './ModalUsers.jsx';

function HomeUsers() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userId, setUserId] = useState();

    const handleRowClick = (id) => {
        setShowModal(true);
        setUserId(id);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(()=> {
        const fetchResource = async () => {
            const result = await get_all_of('user');
            setUsers(result);
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
                {users.map((item, index) => (
                    <tr key={item.id} onClick={() => handleRowClick(item.id)}>
                        <td>{index + 1}</td>
                        <td>{item.id}</td>
                        <td>{item.username}</td>
                    </tr>
                ))}
            </tbody>
            </Table>

            <ModalUsers 
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                userId={userId}
            />
        </>
    );
}

export { HomeUsers };