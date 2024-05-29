import Table from 'react-bootstrap/Table';

import { useEffect, useState } from 'react';

import { get_all_of } from '../../Api.js';

function HomeReports() {
    const [reports, setReports] = useState([]);

    useEffect(()=> {
        const fetchResource = async () => {
            const result = await get_all_of('report');
            setReports(result);
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
                    <th>type</th>
                    <th>description</th>
                </tr>
            </thead>
            <tbody>
                {reports.map((item, index) => (
                    <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.id}</td>
                        <td>{item.type}</td>
                        <td>{item.description}</td>
                    </tr>
                ))}
            </tbody>
            </Table>
        </>
    );
}

export { HomeReports };