import Table from 'react-bootstrap/Table';

import { useEffect, useState } from 'react';

import { get_all_of } from '../../Api.js';

import { ModalPosts } from './ModalPosts.jsx';

function HomePosts() {
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [postId, setPostId] = useState();

    const handleRowClick = (id) => {
        setShowModal(true);
        setPostId(id);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

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
                    <tr key={item.id} onClick={() => handleRowClick(item.id)}>
                        <td>{index + 1}</td>
                        <td>{item.id}</td>
                        <td>{item.message}</td>
                    </tr>
                ))}
            </tbody>
            </Table>

            <ModalPosts 
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                postId={postId}
            />
        </>
    );
}

export { HomePosts };