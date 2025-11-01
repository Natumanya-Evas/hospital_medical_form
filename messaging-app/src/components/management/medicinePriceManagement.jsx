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
  InlineNotification
} from '@carbon/react';
import { Add, Edit, TrashCan } from '@carbon/icons-react';

const API_BASE = 'http://localhost:8080/medic/api';

const MedicinePriceManagement = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [currentPrice, setCurrentPrice] = useState({ quantity: '', unitMeasure: '', price: '' });

  const fetchPrices = async () => {
    try {
      const res = await axios.get(`${API_BASE}/medicine-prices`);
      setPrices(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch medicine prices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleSavePrice = async () => {
    try {
      if (currentPrice.id) {
        await axios.put(`${API_BASE}/medicine-prices/${currentPrice.id}`, currentPrice);
      } else {
        await axios.post(`${API_BASE}/medicine-prices`, currentPrice);
      }
      setShowModal(false);
      setCurrentPrice({ quantity: '', unitMeasure: '', price: '' });
      fetchPrices();
    } catch (err) {
      console.error(err);
      setError('Failed to save medicine price');
    }
  };

  const handleDeletePrice = async id => {
    if (!window.confirm('Are you sure you want to delete this price?')) return;
    try {
      await axios.delete(`${API_BASE}/medicine-prices/${id}`);
      fetchPrices();
    } catch (err) {
      console.error(err);
      setError('Failed to delete medicine price');
    }
  };

  if (loading) return <p>Loading medicine prices...</p>;

  const filteredPrices = prices.filter(
    p =>
      p.unitMeasure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.quantity.toString().includes(searchTerm) ||
      p.price.toString().includes(searchTerm)
  );

  const headers = [
    { key: 'quantity', header: 'Quantity' },
    { key: 'unitMeasure', header: 'Unit Measure' },
    { key: 'price', header: 'Price' },
    { key: 'actions', header: 'Actions' },
  ];

  const rows = filteredPrices.map(p => ({
    id: p.id,
    quantity: p.quantity,
    unitMeasure: p.unitMeasure,
    price: p.price,
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

        <Button
          renderIcon={Add}
          kind="primary"
          style={{ marginBottom: '1rem' }}
          onClick={() => {
            setCurrentPrice({ quantity: '', unitMeasure: '', price: '' });
            setShowModal(true);
          }}
        >
          Add Medicine Price
        </Button>

        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getHeaderProps, getRowProps }) => (
            <TableContainer title="Medicine Prices">
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch
                    persistent
                    placeholder="Search prices..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </TableToolbarContent>
              </TableToolbar>

              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map(header => (
                      <TableHeader key={header.key} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <TableRow key={row.id} {...getRowProps({ row })}>
                      {row.cells.map(cell => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                      <TableCell>
                        <Button
                          renderIcon={Edit}
                          size="sm"
                          kind="secondary"
                          onClick={() => {
                            setCurrentPrice(row);
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </Button>{' '}
                        <Button
                          renderIcon={TrashCan}
                          size="sm"
                          kind="danger"
                          onClick={() => handleDeletePrice(row.id)}
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

        <Modal
          open={showModal}
          modalHeading={currentPrice.id ? 'Edit Price' : 'Add Medicine Price'}
          primaryButtonText="Save"
          secondaryButtonText="Cancel"
          onRequestClose={() => setShowModal(false)}
          onRequestSubmit={handleSavePrice}
          size="sm"
        >
          <TextInput
            id="quantity"
            labelText="Quantity"
            type="number"
            value={currentPrice.quantity}
            onChange={e => setCurrentPrice({ ...currentPrice, quantity: e.target.value })}
          />
          <TextInput
            id="unitMeasure"
            labelText="Unit Measure"
            value={currentPrice.unitMeasure}
            onChange={e => setCurrentPrice({ ...currentPrice, unitMeasure: e.target.value })}
          />
          <TextInput
            id="price"
            labelText="Price"
            type="number"
            step="0.01"
            value={currentPrice.price}
            onChange={e => setCurrentPrice({ ...currentPrice, price: e.target.value })}
          />
        </Modal>
      </Column>
    </Grid>
  );
};

export default MedicinePriceManagement;
