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

const DosageManagement = () => {
  const [dosages, setDosages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [currentDosage, setCurrentDosage] = useState({
    drugName: '',
    amount: '',
    prescription: '',
    caution: '',
    note: '',
  });

  const fetchDosages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/dosages`);
      setDosages(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dosages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDosages();
  }, []);

  const handleSaveDosage = async () => {
    try {
      if (currentDosage.id) {
        await axios.put(`${API_BASE}/dosages/${currentDosage.id}`, currentDosage);
      } else {
        await axios.post(`${API_BASE}/dosages`, currentDosage);
      }
      setShowModal(false);
      setCurrentDosage({ drugName: '', amount: '', prescription: '', caution: '', note: '' });
      fetchDosages();
    } catch (err) {
      console.error(err);
      setError('Failed to save dosage');
    }
  };

  const handleDeleteDosage = async id => {
    if (!window.confirm('Are you sure you want to delete this dosage?')) return;
    try {
      await axios.delete(`${API_BASE}/dosages/${id}`);
      fetchDosages();
    } catch (err) {
      console.error(err);
      setError('Failed to delete dosage');
    }
  };

  if (loading) return <p>Loading dosages...</p>;

  const filteredDosages = dosages.filter(d =>
    d.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.prescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headers = [
    { key: 'drugName', header: 'Drug Name' },
    { key: 'amount', header: 'Amount' },
    { key: 'prescription', header: 'Prescription' },
    { key: 'caution', header: 'Caution' },
    { key: 'note', header: 'Note' },
    { key: 'actions', header: 'Actions' },
  ];

  const rows = filteredDosages.map(d => ({
    id: d.id,
    drugName: d.drugName,
    amount: d.amount,
    prescription: d.prescription,
    caution: d.caution,
    note: d.note,
  }));

  return (
    <>
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
            setCurrentDosage({ drugName: '', amount: '', prescription: '', caution: '', note: '' });
            setShowModal(true);
          }}
        >
          Add Dosage
        </Button>

        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getHeaderProps, getRowProps }) => (
            <TableContainer title="Dosages">
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch
                    persistent
                    placeholder="Search dosages..."
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
                            setCurrentDosage(row);
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </Button>{' '}
                        <Button
                          renderIcon={TrashCan}
                          size="sm"
                          kind="danger"
                          onClick={() => handleDeleteDosage(row.id)}
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

        {/* Modal */}
        <Modal
          open={showModal}
          modalHeading={currentDosage.id ? 'Edit Dosage' : 'Add Dosage'}
          primaryButtonText="Save"
          secondaryButtonText="Cancel"
          onRequestClose={() => setShowModal(false)}
          onRequestSubmit={handleSaveDosage}
          size="sm"
        >
          <TextInput
            id="drugName"
            labelText="Drug Name"
            value={currentDosage.drugName}
            onChange={e => setCurrentDosage({ ...currentDosage, drugName: e.target.value })}
          />
          <TextInput
            id="amount"
            labelText="Amount"
            value={currentDosage.amount}
            onChange={e => setCurrentDosage({ ...currentDosage, amount: e.target.value })}
          />
          <TextInput
            id="prescription"
            labelText="Prescription"
            value={currentDosage.prescription}
            onChange={e => setCurrentDosage({ ...currentDosage, prescription: e.target.value })}
          />
          <TextInput
            id="caution"
            labelText="Caution"
            value={currentDosage.caution}
            onChange={e => setCurrentDosage({ ...currentDosage, caution: e.target.value })}
          />
          <TextInput
            id="note"
            labelText="Note"
            value={currentDosage.note}
            onChange={e => setCurrentDosage({ ...currentDosage, note: e.target.value })}
          />
        </Modal>
      </Column>
    </>
  );
};

export default DosageManagement;
