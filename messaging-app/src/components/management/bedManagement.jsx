import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Column,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableContainer,
  Button,
  Modal,
  TextInput,
  InlineNotification,
  Tile,
} from '@carbon/react';
import { Edit, TrashCan } from '@carbon/icons-react';

const BedManagement = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [currentBed, setCurrentBed] = useState(null);

  const API_BASE = 'http://localhost:8080/medic/beds';

  // Fetch beds
  const fetchBeds = async () => {
    try {
      const res = await axios.get(API_BASE);
      setBeds(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch beds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  // Update bed
  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE}/${currentBed.bedId}`, currentBed);
      setShowModal(false);
      fetchBeds();
    } catch (err) {
      console.error(err);
      setError('Failed to update bed');
    }
  };

  // Delete bed
  const handleDelete = async (bedId) => {
    if (!window.confirm('Are you sure you want to delete this bed?')) return;
    try {
      await axios.delete(`${API_BASE}/${bedId}`);
      fetchBeds();
    } catch (err) {
      console.error(err);
      setError('Failed to delete bed');
    }
  };

  if (loading) return <p>Loading beds...</p>;

  // Filter beds for search
  const filteredBeds = beds.filter(
    (bed) =>
      bed.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bed.wardId.toString().includes(searchTerm)
  );

  // Table headers
  const headers = [
    { key: 'bedNumber', header: 'Bed Number' },
    { key: 'wardId', header: 'Ward ID' },
    { key: 'bedRow', header: 'Row' },
    { key: 'bedColumn', header: 'Column' },
    { key: 'status', header: 'Status' },
    { key: 'actions', header: 'Actions' },
  ];

  // Map rows for DataTable
  const rows = filteredBeds.map((bed) => ({
    id: bed.bedId,
    bedNumber: bed.bedNumber,
    wardId: bed.wardId,
    bedRow: bed.bedRow,
    bedColumn: bed.bedColumn,
    status: bed.occupied ? 'Occupied' : 'Available',
  }));

  return (
    <Grid style={{marginTop:"3rem"}} >
      <Column lg={16} md={8} sm={4}>
        {error && (
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Data Table */}
        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getHeaderProps, getRowProps }) => (
            <TableContainer title="Bed Management">
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch
                    persistent
                    placeholder="Search beds..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </TableToolbarContent>
              </TableToolbar>
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader key={header.key} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                      <TableCell>
                        <Button
                          renderIcon={Edit}
                          size="sm"
                          kind="secondary"
                          onClick={() => {
                            const bed = beds.find((b) => b.bedId === row.id);
                            setCurrentBed(bed);
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </Button>{' '}
                        <Button
                          renderIcon={TrashCan}
                          size="sm"
                          kind="danger"
                          onClick={() => handleDelete(row.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>

        {/* Edit Modal */}
        {currentBed && (
          <Modal
            open={showModal}
            modalHeading="Edit Bed"
            primaryButtonText="Save"
            secondaryButtonText="Cancel"
            onRequestClose={() => setShowModal(false)}
            onRequestSubmit={handleUpdate}
            size="sm"
          >
            <TextInput
              id="bedNumber"
              labelText="Bed Number"
              value={currentBed.bedNumber}
              onChange={(e) => setCurrentBed({ ...currentBed, bedNumber: e.target.value })}
            />
            <TextInput
              id="wardId"
              labelText="Ward ID"
              type="number"
              value={currentBed.wardId}
              onChange={(e) => setCurrentBed({ ...currentBed, wardId: parseInt(e.target.value) })}
            />
            <TextInput
              id="bedRow"
              labelText="Row"
              type="number"
              value={currentBed.bedRow}
              onChange={(e) => setCurrentBed({ ...currentBed, bedRow: parseInt(e.target.value) })}
            />
            <TextInput
              id="bedColumn"
              labelText="Column"
              type="number"
              value={currentBed.bedColumn}
              onChange={(e) =>
                setCurrentBed({ ...currentBed, bedColumn: parseInt(e.target.value) })
              }
            />
            <TextInput
              id="occupied"
              labelText="Occupied"
              value={currentBed.occupied}
              onChange={(e) =>
                setCurrentBed({ ...currentBed, occupied: e.target.value === 'true' })
              }
            />
          </Modal>
        )}
      </Column>
    </Grid>
  );
};

export default BedManagement;
