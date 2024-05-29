import Table from 'react-bootstrap/Table';

import { useEffect, useState } from 'react';

import { get_all_of } from '../../Api.js';

function HomePosts() {
    const [posts, setPosts] = useState([]);

    useEffect(()=> {
        const fetchResource = async () => {
            const result = await get_all_of('post');
            setPosts(result);
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
                {posts.map((item, index) => (
                    <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.id}</td>
                        <td>{item.username}</td>
                    </tr>
                ))}
            </tbody>
            </Table>
        </>
    );
}

export { HomePosts };