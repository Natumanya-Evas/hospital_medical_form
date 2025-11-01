import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Column,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Button,
  Modal,
  TextInput,
  InlineNotification
} from '@carbon/react';
import { Edit, TrashCan, Add } from '@carbon/icons-react';

const API_BASE = 'http://localhost:8080/medic/api/dispensers';

const DispenserManagement = () => {
  const [dispensers, setDispensers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [currentDispenser, setCurrentDispenser] = useState(null);

  // Fetch all dispensers
  const fetchDispensers = async () => {
    try {
      const res = await axios.get(API_BASE);
      setDispensers(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dispensers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispensers();
  }, []);

  // Save (add or update) dispenser
  const handleSave = async () => {
    try {
      if (currentDispenser.id) {
        await axios.put(`${API_BASE}/${currentDispenser.id}`, currentDispenser);
      } else {
        await axios.post(API_BASE, currentDispenser);
      }
      setShowModal(false);
      setCurrentDispenser(null);
      fetchDispensers();
    } catch (err) {
      console.error(err);
      setError('Failed to save dispenser');
    }
  };

  // Delete dispenser
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dispenser?')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchDispensers();
    } catch (err) {
      console.error(err);
      setError('Failed to delete dispenser');
    }
  };

  if (loading) return <p>Loading dispensers...</p>;

  const filteredDispensers = dispensers.filter(
    (d) =>
      d.workName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headers = [
    { key: 'workName', header: 'Work Name' },
    { key: 'location', header: 'Location' },
    { key: 'phone', header: 'Phone' },
    { key: 'email', header: 'Email' },
    { key: 'actions', header: 'Actions' },
  ];

  return (
    <Grid>
      <Column lg={16} md={8} sm={4}>
        {error && (
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error}
            onClose={() => setError(null)}
          />
        )}

        <Button
          renderIcon={Add}
          kind="primary"
          style={{ marginBottom: '1rem' }}
          onClick={() => {
            setCurrentDispenser({ workName: '', location: '', phone: '', email: '' });
            setShowModal(true);
          }}
        >
          Add Dispenser
        </Button>

        <TableContainer title="Dispensers">
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch
                persistent
                placeholder="Search dispensers..."
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
              {filteredDispensers.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.workName}</TableCell>
                  <TableCell>{d.location}</TableCell>
                  <TableCell>{d.phone}</TableCell>
                  <TableCell>{d.email}</TableCell>
                  <TableCell>
                    <Button
                      renderIcon={Edit}
                      size="sm"
                      kind="secondary"
                      onClick={() => {
                        setCurrentDispenser(d);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </Button>{' '}
                    <Button
                      renderIcon={TrashCan}
                      size="sm"
                      kind="danger"
                      onClick={() => handleDelete(d.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Modal */}
        {currentDispenser && (
          <Modal
            open={showModal}
            modalHeading={currentDispenser.id ? 'Edit Dispenser' : 'Add Dispenser'}
            primaryButtonText="Save"
            secondaryButtonText="Cancel"
            onRequestClose={() => setShowModal(false)}
            onRequestSubmit={handleSave}
            size="sm"
          >
            <TextInput
              id="workName"
              labelText="Work Name"
              value={currentDispenser.workName}
              onChange={(e) =>
                setCurrentDispenser({ ...currentDispenser, workName: e.target.value })
              }
              style={{ marginBottom: '1rem' }}
            />
            <TextInput
              id="location"
              labelText="Location"
              value={currentDispenser.location}
              onChange={(e) =>
                setCurrentDispenser({ ...currentDispenser, location: e.target.value })
              }
              style={{ marginBottom: '1rem' }}
            />
            <TextInput
              id="phone"
              labelText="Phone"
              value={currentDispenser.phone}
              onChange={(e) =>
                setCurrentDispenser({ ...currentDispenser, phone: e.target.value })
              }
              style={{ marginBottom: '1rem' }}
            />
            <TextInput
              id="email"
              labelText="Email"
              value={currentDispenser.email}
              onChange={(e) =>
                setCurrentDispenser({ ...currentDispenser, email: e.target.value })
              }
            />
          </Modal>
        )}
      </Column>
    </Grid>
  );
};

export default DispenserManagement;
