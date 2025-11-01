import React, { useState, useEffect } from 'react';
import {
    DataTable,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    TableContainer,
    Pagination,
    Button,
    Link,
    Loading,
    InlineNotification,
    Search,
    Grid,
    Column,
    Dropdown
} from '@carbon/react';
import { Edit, View, TrashCan, Add } from '@carbon/icons-react';

const DispensersTable = () => {
    const [dispensers, setDispensers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const headers = [
        { key: 'id', header: 'ID' },
        { key: 'workName', header: 'Pharmacy Name' },
        { key: 'location', header: 'Location' },
        { key: 'phone', header: 'Phone' },
        { key: 'email', header: 'Email' },
        { key: 'dosagesCount', header: 'Medications' },
        { key: 'actions', header: 'Actions' }
    ];

    // Fetch dispensers data
    const fetchDispensers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/medic/api/dispensers`);
            if (!response.ok) {
                throw new Error('Failed to fetch dispensers');
            }
            const data = await response.json();
            setDispensers(data);
            setTotalItems(data.length);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDispensers();
    }, []);

    // Filter dispensers based on search term
    const filteredDispensers = dispensers.filter(dispenser =>
        dispenser.workName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispenser.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispenser.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedDispensers = filteredDispensers.slice(startIndex, endIndex);

    // Handle delete dispenser
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this dispenser?')) {
            try {
                const response = await fetch(`http://localhost:8080/medic/api/dispensers/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchDispensers(); // Refresh the list
                } else {
                    throw new Error('Failed to delete dispenser');
                }
            } catch (err) {
                setError(err.message);
            }
        }
    };

    // Handle page change
    const handlePageChange = ({ page, pageSize }) => {
        setPage(page);
        setPageSize(pageSize);
    };

    if (loading) {
        return <Loading description="Loading dispensers..." withOverlay={false} />;
    }

    return (
        <div className="dispensers-table">
            {/* Header Section */}
            <Grid condensed>
                <Column sm={4} md={8} lg={16}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2>Medication Dispensers</h2>
                        <Button
                            kind="primary"
                            renderIcon={Add}
                            onClick={() => {/* Add your create logic here */}}
                        >
                            Add New Dispenser
                        </Button>
                    </div>
                </Column>
            </Grid>

            {/* Search and Filters */}
            <Grid condensed>
                <Column sm={4} md={8} lg={16}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
                        <Search
                            size="lg"
                            placeholder="Search by name, location, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ minWidth: '300px' }}
                        />
                        <div style={{ minWidth: '200px' }}>
                            <Dropdown
                                id="page-size-selector"
                                label="Items per page"
                                items={[
                                    { id: '10', text: '10 items' },
                                    { id: '20', text: '20 items' },
                                    { id: '50', text: '50 items' }
                                ]}
                                selectedItem={{ id: pageSize.toString(), text: `${pageSize} items` }}
                                onChange={({ selectedItem }) => setPageSize(parseInt(selectedItem.id))}
                            />
                        </div>
                    </div>
                </Column>
            </Grid>

            {/* Error Notification */}
            {error && (
                <InlineNotification
                    kind="error"
                    title="Error"
                    subtitle={error}
                    onClose={() => setError(null)}
                    style={{ marginBottom: '1rem' }}
                />
            )}

            {/* Data Table */}
            <TableContainer>
                <DataTable rows={paginatedDispensers} headers={headers}>
                    {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                        <Table {...getTableProps()}>
                            <TableHead>
                                <TableRow>
                                    {headers.map((header) => (
                                        <TableHeader {...getHeaderProps({ header })}>
                                            {header.header}
                                        </TableHeader>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => {
                                    const dispenser = row.cells.reduce((acc, cell) => {
                                        acc[cell.info.header] = cell.value;
                                        return acc;
                                    }, {});

                                    return (
                                        <TableRow key={row.id} {...getRowProps({ row })}>
                                            {row.cells.map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {cell.info.header === 'actions' ? (
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <Button
                                                                kind="ghost"
                                                                size="sm"
                                                                renderIcon={View}
                                                                iconDescription="View"
                                                                hasIconOnly
                                                                onClick={() => {/* View logic */}}
                                                            />
                                                            <Button
                                                                kind="ghost"
                                                                size="sm"
                                                                renderIcon={Edit}
                                                                iconDescription="Edit"
                                                                hasIconOnly
                                                                onClick={() => {/* Edit logic */}}
                                                            />
                                                            <Button
                                                                kind="danger--ghost"
                                                                size="sm"
                                                                renderIcon={TrashCan}
                                                                iconDescription="Delete"
                                                                hasIconOnly
                                                                onClick={() => handleDelete(dispenser.id)}
                                                            />
                                                        </div>
                                                    ) : cell.info.header === 'dosagesCount' ? (
                                                        <Link
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                // View medications logic
                                                            }}
                                                        >
                                                            {dispenser.dosages?.length || 0} medications
                                                        </Link>
                                                    ) : (
                                                        cell.value
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </DataTable>
            </TableContainer>

            {/* Pagination */}
            {filteredDispensers.length > 0 && (
                <Pagination
                    page={page}
                    pageSize={pageSize}
                    pageSizes={[10, 20, 50]}
                    totalItems={filteredDispensers.length}
                    onChange={handlePageChange}
                    style={{ marginTop: '1rem' }}
                />
            )}

            {/* Empty State */}
            {filteredDispensers.length === 0 && !loading && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem', 
                    color: '#6f6f6f' 
                }}>
                    <h3>No dispensers found</h3>
                    <p>
                        {searchTerm 
                            ? `No dispensers match your search for "${searchTerm}"`
                            : 'No dispensers available. Create your first dispenser.'
                        }
                    </p>
                    {!searchTerm && (
                        <Button
                            kind="primary"
                            renderIcon={Add}
                            onClick={() => {/* Add your create logic here */}}
                            style={{ marginTop: '1rem' }}
                        >
                            Create First Dispenser
                        </Button>
                    )}
                </div>
            )}

            {/* Summary */}
            <div style={{ 
                marginTop: '1rem', 
                color: '#6f6f6f', 
                fontSize: '0.875rem',
                textAlign: 'center'
            }}>
                Showing {paginatedDispensers.length} of {filteredDispensers.length} dispensers
                {searchTerm && ` matching "${searchTerm}"`}
            </div>
        </div>
    );
};

export default DispensersTable;