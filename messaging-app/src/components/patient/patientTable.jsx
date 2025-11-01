import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DataTable,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    TableContainer,
    Button,
    Tag,
    Pagination,
    TableToolbar,
    TableToolbarContent,
    TableToolbarSearch,
    Link,
    Grid,
    Column
} from '@carbon/react';

const PatientTable = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/medic/api/patients')
            .then(res => res.json())
            .then(data => {
                setPatients(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error:', err);
                setLoading(false);
            });
    }, []);

    // Filter patients based on search term
    const filteredPatients = patients.filter(patient =>
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.middleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.contactNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalItems = filteredPatients.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

    const headers = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Patient Name' },
        { key: 'dateOfBirth', header: 'DOB' },
        { key: 'gender', header: 'Gender' },
        { key: 'contact', header: 'Contact' }
    ];

    const handleNameClick = (patientId) => {
        navigate(`/patientDetails/${patientId}`);
    };

    const rows = paginatedPatients.map(patient => ({
        id: patient.id,
        name: (
            <Link
                onClick={() => handleNameClick(patient.id)}
                style={{ cursor: 'pointer' }}
            >
                {patient.firstName} {patient.lastName}
            </Link>
        ),
        dateOfBirth: new Date(patient.dateOfBirth).toLocaleDateString(),
        gender: <Tag type={patient.gender === 'MALE' ? 'blue' : 'magenta'}>{patient.gender}</Tag>,
        contact: patient.contactNumber || 'N/A'
    }));

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    if (loading) return <div>Loading patients...</div>;

    return (
        <Grid>
            <Column lg={16} md={8} sm={4}
            className="p-4 text-end shadow-lg m-2 bg-info rounded"
            >
            <DataTable rows={rows} headers={headers}  >
                {({
                    rows,
                    headers,
                    getTableProps,
                    getHeaderProps,
                    getRowProps,
                    getTableContainerProps,
                    getToolbarProps
                }) => (
                    <TableContainer
                        title="Patients"
                        {...getTableContainerProps()}
                        style={{ position:"relative", }}
                    >
                        <TableToolbar {...getToolbarProps()}>
                            <TableToolbarContent>
                                <TableToolbarSearch
                                    persistent
                                    placeholder="Search patients..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </TableToolbarContent>
                        </TableToolbar>

                        <Table {...getTableProps()}>
                            <TableHead>
                                <TableRow>
                                    {headers.map(header => (
                                        <TableHeader {...getHeaderProps({ header })}>
                                            {header.header}
                                        </TableHeader>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map(row => (
                                    <TableRow {...getRowProps({ row })}  >
                                        {row.cells.map(cell => (
                                            <TableCell key={cell.id}>
                                                {cell.value}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DataTable>

            {/* Pagination */}
            <Pagination
                totalItems={totalItems}
                backwardText="Previous page"
                forwardText="Next page"
                pageSize={pageSize}
                pageSizes={[5, 10, 15, 20, 25]}
                itemsPerPageText="Patients per page:"
                onChange={({ page, pageSize }) => {
                    setCurrentPage(page);
                    setPageSize(pageSize);
                }}
            />
            </Column>
    </Grid>
);
};

export default PatientTable;