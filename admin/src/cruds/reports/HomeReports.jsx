import Table from 'react-bootstrap/Table';

import { useEffect, useState } from 'react';

import { get_all_of } from '../../Api.js';
import { ModalReports } from './ModalReports.jsx';

function HomeReports() {
    const [reports, setReports] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [reportId, setReportId] = useState();

    const handleRowClick = (id) => {
        setShowModal(true);
        setReportId(id);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

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
                </tr>
            </thead>
            <tbody>
                {reports.map((item, index) => (
                    <tr key={item.id} onClick={() => handleRowClick(item.id)}>
                        <td>{index + 1}</td>
                        <td>{item.id}</td>
                        <td>{item.message}</td>
                    </tr>
                ))}
            </tbody>
            </Table>

            <ModalReports
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                reportId={reportId}
            />
        </>
    );
}

export { HomeReports };