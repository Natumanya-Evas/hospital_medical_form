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
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Button,
  Modal,
  TextInput,
  InlineNotification,
} from '@carbon/react';
import { Edit, TrashCan, Add } from '@carbon/icons-react';

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);

  const API_BASE = 'http://localhost:8080/medic/api/addresses';

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(API_BASE);
      setAddresses(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const filteredAddresses = addresses.filter(
    addr =>
      addr.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addr.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addr.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addr.zipCode.includes(searchTerm)
  );

  const handleSave = async () => {
    try {
      if (currentAddress.id) {
        // Update
        await axios.put(`${API_BASE}/${currentAddress.id}`, currentAddress);
      } else {
        // Create
        await axios.post(API_BASE, currentAddress);
      }
      setShowModal(false);
      setCurrentAddress(null);
      fetchAddresses();
    } catch (err) {
      console.error(err);
      setError('Failed to save address');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchAddresses();
    } catch (err) {
      console.error(err);
      setError('Failed to delete address');
    }
  };

  if (loading) return <p>Loading addresses...</p>;

  const headers = [
    { key: 'street', header: 'Street' },
    { key: 'city', header: 'City' },
    { key: 'state', header: 'State' },
    { key: 'zipCode', header: 'Zip Code' },
    { key: 'actions', header: 'Actions' },
  ];

  const rows = filteredAddresses.map(addr => ({
    id: addr.id,
    street: addr.street,
    city: addr.city,
    state: addr.state,
    zipCode: addr.zipCode,
    actions: addr,
  }));

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

        {/* Toolbar Add Button */}
        <Button
          renderIcon={Add}
          kind="primary"
          style={{ marginBottom: '1rem' }}
          onClick={() => {
            setCurrentAddress({ street: '', city: '', state: '', zipCode: '' });
            setShowModal(true);
          }}
        >
          Add Address
        </Button>

        {/* DataTable */}
        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <TableContainer title="Address Management">
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch
                    persistent
                    placeholder="Search addresses..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </TableToolbarContent>
              </TableToolbar>

              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map(header => (
                      <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <TableRow {...getRowProps({ row })} key={row.id}>
                      <TableCell>{row.street}</TableCell>
                      <TableCell>{row.city}</TableCell>
                      <TableCell>{row.state}</TableCell>
                      <TableCell>{row.zipCode}</TableCell>
                      <TableCell>
                        <Button
                          renderIcon={Edit}
                          size="sm"
                          kind="secondary"
                          onClick={() => {
                            setCurrentAddress(row.actions);
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </Button>{' '}
                        <Button
                          renderIcon={TrashCan}
                          size="sm"
                          kind="danger"
                          onClick={() => handleDelete(row.actions.id)}
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

        {/* Modal for Add/Edit */}
        {currentAddress && (
          <Modal
            open={showModal}
            modalHeading={currentAddress.id ? 'Edit Address' : 'Add Address'}
            primaryButtonText="Save"
            secondaryButtonText="Cancel"
            onRequestClose={() => setShowModal(false)}
            onRequestSubmit={handleSave}
            size="sm"
          >
            <TextInput
              id="street"
              labelText="Street"
              value={currentAddress.street}
              onChange={e => setCurrentAddress({ ...currentAddress, street: e.target.value })}
            />
            <TextInput
              id="city"
              labelText="City"
              value={currentAddress.city}
              onChange={e => setCurrentAddress({ ...currentAddress, city: e.target.value })}
            />
            <TextInput
              id="state"
              labelText="State"
              value={currentAddress.state}
              onChange={e => setCurrentAddress({ ...currentAddress, state: e.target.value })}
            />
            <TextInput
              id="zipCode"
              labelText="Zip Code"
              value={currentAddress.zipCode}
              onChange={e => setCurrentAddress({ ...currentAddress, zipCode: e.target.value })}
            />
          </Modal>
        )}
      </Column>
    </Grid>
  );
};

export default AddressManagement;
