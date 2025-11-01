import React, { useEffect, useState } from 'react';
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
} from '@carbon/react';
import { Edit, TrashCan } from '@carbon/icons-react';

const WardManagement = () => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [currentWard, setCurrentWard] = useState(null);

  const API_BASE = 'http://localhost:8080/medic/wards';

  // Fetch wards
  const fetchWards = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error('Failed to fetch wards');
      const data = await response.json();
      setWards(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch wards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWards();
  }, []);

  // Update ward
  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE}/${currentWard.wardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentWard),
      });
      if (!response.ok) throw new Error('Failed to update ward');

      setShowModal(false);
      await fetchWards();
    } catch (err) {
      console.error(err);
      setError('Failed to update ward');
    }
  };

  // Delete ward
  const handleDelete = async (wardId) => {
    if (!window.confirm('Are you sure you want to delete this ward?')) return;
    try {
      const response = await fetch(`${API_BASE}/${wardId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete ward');
      await fetchWards();
    } catch (err) {
      console.error(err);
      setError('Failed to delete ward');
    }
  };

  if (loading) return <p>Loading wards...</p>;

  // Filtered wards
  const filteredWards = wards.filter(
    (ward) =>
      ward.wardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ward.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headers = [
    { key: 'wardName', header: 'Ward Name' },
    { key: 'location', header: 'Location' },
    { key: 'actions', header: 'Actions' },
  ];

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

        <TableContainer title="Ward Management" style={{ marginBottom: '1rem' }}>
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch
                persistent
                placeholder="Search wards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </TableToolbarContent>
          </TableToolbar>

          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader key={header.key}>{header.header}</TableHeader>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredWards.map((ward) => (
                <TableRow key={ward.wardId}>
                  <TableCell>{ward.wardName}</TableCell>
                  <TableCell>{ward.location}</TableCell>
                  <TableCell>
                    <Button
                      renderIcon={Edit}
                      size="sm"
                      kind="secondary"
                      onClick={() => {
                        setCurrentWard(ward);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </Button>{' '}
                    <Button
                      renderIcon={TrashCan}
                      size="sm"
                      kind="danger"
                      onClick={() => handleDelete(ward.wardId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Modal */}
        {currentWard && (
          <Modal
            open={showModal}
            modalHeading="Edit Ward"
            primaryButtonText="Save"
            secondaryButtonText="Cancel"
            onRequestClose={() => setShowModal(false)}
            onRequestSubmit={handleUpdate}
            size="sm"
          >
            <TextInput
              id="wardName"
              labelText="Ward Name"
              value={currentWard.wardName || ''}
              onChange={(e) => setCurrentWard({ ...currentWard, wardName: e.target.value })}
              style={{ marginBottom: '1rem' }}
            />
            <TextInput
              id="location"
              labelText="Location"
              value={currentWard.location || ''}
              onChange={(e) => setCurrentWard({ ...currentWard, location: e.target.value })}
            />
          </Modal>
        )}
      </Column>
    </Grid>
  );
};

export default WardManagement;
