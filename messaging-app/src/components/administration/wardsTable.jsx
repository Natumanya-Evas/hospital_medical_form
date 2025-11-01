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
    Grid,
    Column,
    Stack,
    Tag,
    Pagination,
    Search,
    InlineLoading,
    Tile,
    Accordion,
    AccordionItem,
    Link
} from '@carbon/react';
import { useState, useEffect } from 'react';
import { View, Edit, Hospital } from '@carbon/icons-react';

const WardsTable = () => {
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [firstRowIndex, setFirstRowIndex] = useState(0);
    const [currentPageSize, setCurrentPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch wards data
    useEffect(() => {
        const fetchWards = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:8080/medic/wards');
                if (!response.ok) {
                    throw new Error('Failed to fetch wards');
                }
                const data = await response.json();
                setWards(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching wards:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWards();
    }, []);

    // Filter wards based on search term
    const filteredWards = wards.filter(ward =>
        ward.wardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ward.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ward.beds?.some(bed => bed.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination
    const totalRows = filteredWards.length;
    const currentPageWards = filteredWards.slice(
        firstRowIndex,
        firstRowIndex + currentPageSize
    );

    // Table headers
    const headers = [
        { key: 'wardName', header: 'Ward Name' },
        { key: 'location', header: 'Location' },
        { key: 'totalBeds', header: 'Total Beds' },
        { key: 'occupiedBeds', header: 'Occupied Beds' },
        { key: 'availableBeds', header: 'Available Beds' },
        { key: 'actions', header: 'Actions' }
    ];

    // Calculate bed statistics
    const getBedStats = (ward) => {
        const beds = ward.beds || [];
        const totalBeds = beds.length;
        const occupiedBeds = beds.filter(bed => bed.occupied).length;
        const availableBeds = totalBeds - occupiedBeds;
        
        return { totalBeds, occupiedBeds, availableBeds };
    };

    if (loading) {
        return (
            <Grid>
                <Column sm={4} md={8} lg={16}>
                    <Tile>
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                            <InlineLoading description="Loading wards..." />
                        </div>
                    </Tile>
                </Column>
            </Grid>
        );
    }

    if (error) {
        return (
            <Grid>
                <Column sm={4} md={8} lg={16}>
                    <Tile>
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#da1e28' }}>
                            <p>Error loading wards: {error}</p>
                            <Button onClick={() => window.location.reload()}>
                                Retry
                            </Button>
                        </div>
                    </Tile>
                </Column>
            </Grid>
        );
    }

    return (
        <>
            <Column sm={4} md={8} lg={16}>
                <Stack gap={6}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Hospital size={24} />
                            <h2>Wards Management</h2>
                        </div>
                        <Tag type="blue">
                            {wards.length} {wards.length === 1 ? 'Ward' : 'Wards'}
                        </Tag>
                    </div>

                    {/* Search */}
                    <Search
                        size="lg"
                        placeholder="Search by ward name, location, or bed number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        closeButtonLabelText="Clear search"
                    />

                    {/* Main Table */}
                    <Tile>
                        <DataTable rows={currentPageWards} headers={headers}>
                            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                                <TableContainer title="Wards Overview" description="List of all wards and their bed occupancy">
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
                                                const ward = row;
                                                const { totalBeds, occupiedBeds, availableBeds } = getBedStats(ward);
                                                
                                                return (
                                                    <TableRow key={ward.id} {...getRowProps({ row })}>
                                                        <TableCell>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <Hospital size={16} />
                                                                <strong>{ward.wardName}</strong>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{ward.location}</TableCell>
                                                        <TableCell>
                                                            <Tag type={totalBeds === 0 ? 'red' : 'blue'}>
                                                                {totalBeds} {totalBeds === 1 ? 'Bed' : 'Beds'}
                                                            </Tag>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tag type={occupiedBeds > 0 ? 'red' : 'gray'}>
                                                                {occupiedBeds} Occupied
                                                            </Tag>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tag type={availableBeds > 0 ? 'green' : 'red'}>
                                                                {availableBeds} Available
                                                            </Tag>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                <Button
                                                                    kind="ghost"
                                                                    size="sm"
                                                                    renderIcon={View}
                                                                    onClick={() => console.log('View ward:', ward.wardId)}
                                                                >
                                                                    View
                                                                </Button>
                                                                <Button
                                                                    kind="ghost"
                                                                    size="sm"
                                                                    renderIcon={Edit}
                                                                    onClick={() => console.log('Edit ward:', ward.wardId)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </DataTable>

                        {/* Pagination */}
                        {totalRows > 0 && (
                            <Pagination
                                totalItems={totalRows}
                                backwardText="Previous page"
                                forwardText="Next page"
                                pageSize={currentPageSize}
                                pageSizes={[5, 10, 20, 30]}
                                itemsPerPageText="Items per page:"
                                onChange={({ page, pageSize }) => {
                                    if (pageSize !== currentPageSize) {
                                        setCurrentPageSize(pageSize);
                                    }
                                    setFirstRowIndex(pageSize * (page - 1));
                                }}
                            />
                        )}

                        {totalRows === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#6f6f6f' }}>
                                <p>No wards found {searchTerm && `matching "${searchTerm}"`}</p>
                            </div>
                        )}
                    </Tile>

                    {/* Detailed Beds View */}
                    <Tile>
                        <h3 style={{ marginBottom: '1rem' }}>Bed Details by Ward</h3>
                        <Accordion>
                            {currentPageWards.map((ward) => {
                                const { totalBeds, occupiedBeds, availableBeds } = getBedStats(ward);
                                
                                return (
                                    <AccordionItem
                                        key={ward.wardId}
                                        title={
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                <span>
                                                    <strong>{ward.wardName}</strong> - {ward.location}
                                                </span>
                                                <div style={{ display: 'flex', gap: '1rem' }}>
                                                    <Tag type="blue">{totalBeds} Total</Tag>
                                                    <Tag type="red">{occupiedBeds} Occupied</Tag>
                                                    <Tag type="green">{availableBeds} Available</Tag>
                                                </div>
                                            </div>
                                        }
                                    >
                                        {ward.beds && ward.beds.length > 0 ? (
                                            <div style={{ padding: '1rem 0' }}>
                                                <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableHeader>Bed Number</TableHeader>
                                                                <TableHeader>Location</TableHeader>
                                                                <TableHeader>Status</TableHeader>
                                                                <TableHeader>Actions</TableHeader>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {ward.beds.map((bed) => (
                                                                <TableRow key={bed.bedId}>
                                                                    <TableCell>
                                                                        <strong>{bed.bedNumber}</strong>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        Row {bed.bedRow}, Column {bed.bedColumn}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Tag type={bed.occupied ? 'red' : 'green'}>
                                                                            {bed.occupied ? 'Occupied' : 'Available'}
                                                                        </Tag>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            kind="ghost"
                                                                            size="sm"
                                                                            onClick={() => console.log('Manage bed:', bed.bedId)}
                                                                        >
                                                                            Manage
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '2rem', color: '#6f6f6f' }}>
                                                <p>No beds assigned to this ward</p>
                                                <Button
                                                    kind="ghost"
                                                    onClick={() => console.log('Add beds to ward:', ward.wardId)}
                                                >
                                                    Add Beds
                                                </Button>
                                            </div>
                                        )}
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    </Tile>

                    {/* Summary Statistics */}
                    <Tile>
                        <h3 style={{ marginBottom: '1rem' }}>Hospital Bed Summary</h3>
                        <Grid narrow>
                            <Column sm={2} md={4} lg={4}>
                                <div style={{ textAlign: 'center', padding: '1rem' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f62fe' }}>
                                        {wards.length}
                                    </div>
                                    <div style={{ color: '#6f6f6f' }}>Total Wards</div>
                                </div>
                            </Column>
                            <Column sm={2} md={4} lg={4}>
                                <div style={{ textAlign: 'center', padding: '1rem' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f62fe' }}>
                                        {wards.reduce((total, ward) => total + (ward.beds?.length || 0), 0)}
                                    </div>
                                    <div style={{ color: '#6f6f6f' }}>Total Beds</div>
                                </div>
                            </Column>
                            <Column sm={2} md={4} lg={4}>
                                <div style={{ textAlign: 'center', padding: '1rem' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#da1e28' }}>
                                        {wards.reduce((total, ward) => total + (ward.beds?.filter(bed => bed.occupied).length || 0), 0)}
                                    </div>
                                    <div style={{ color: '#6f6f6f' }}>Occupied Beds</div>
                                </div>
                            </Column>
                            <Column sm={2} md={4} lg={4}>
                                <div style={{ textAlign: 'center', padding: '1rem' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#24a148' }}>
                                        {wards.reduce((total, ward) => total + (ward.beds?.filter(bed => !bed.occupied).length || 0), 0)}
                                    </div>
                                    <div style={{ color: '#6f6f6f' }}>Available Beds</div>
                                </div>
                            </Column>
                        </Grid>
                    </Tile>
                </Stack>
            </Column>
        </>
    );
};

export default WardsTable;