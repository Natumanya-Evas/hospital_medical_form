import React, { useEffect, useState } from "react";
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Modal,
  TextInput,
  Select,
  SelectItem,
  InlineNotification,
  InlineLoading,
} from "@carbon/react";

const headers = [
  { key: "firstName", header: "First Name" },
  { key: "lastName", header: "Last Name" },
  { key: "middleName", header: "Middle Name" },
  { key: "dateOfBirth", header: "Date of Birth" },
  { key: "gender", header: "Gender" },
  { key: "contactNumber", header: "Contact Number" },
  { key: "actions", header: "Actions" },
];

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const baseUrl = "http://localhost:8080/medic/api/patients";

  // Fetch patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch(baseUrl);
      if (!response.ok) throw new Error("Failed to fetch patients");
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle Edit
  const handleEdit = (patient) => {
    setSelectedPatient({ ...patient });
    setModalOpen(true);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete patient");
      setPatients((prev) => prev.filter((p) => p.id !== id));
      setNotification({ type: "success", msg: "Patient deleted successfully" });
    } catch (err) {
      setNotification({ type: "error", msg: err.message });
    }
  };

  // Handle Save (Update)
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${baseUrl}/${selectedPatient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPatient),
      });
      if (!response.ok) throw new Error("Failed to update patient");

      setPatients((prev) =>
        prev.map((p) => (p.id === selectedPatient.id ? selectedPatient : p))
      );
      setNotification({ type: "success", msg: "Patient updated successfully" });
      setModalOpen(false);
    } catch (err) {
      setNotification({ type: "error", msg: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedPatient((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{marginTop:"3rem"}}>
      <h2>Patient Management</h2>

      {notification && (
        <InlineNotification
          kind={notification.type}
          title={notification.msg}
          onCloseButtonClick={() => setNotification(null)}
        />
      )}

      {loading ? (
        <InlineLoading description="Loading patients..." />
      ) : error ? (
        <InlineNotification kind="error" title={error} />
      ) : (
        <DataTable rows={patients} headers={headers}>
          {({ rows, headers, getHeaderProps }) => (
            <TableContainer>
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
                    <TableRow key={row.id}>
                      <TableCell>{row.cells.find(c => c.info.header === "firstName")?.value}</TableCell>
                      <TableCell>{row.cells.find(c => c.info.header === "lastName")?.value}</TableCell>
                      <TableCell>{row.cells.find(c => c.info.header === "middleName")?.value}</TableCell>
                      <TableCell>
                        {new Date(row.cells.find(c => c.info.header === "dateOfBirth")?.value).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{row.cells.find(c => c.info.header === "gender")?.value}</TableCell>
                      <TableCell>{row.cells.find(c => c.info.header === "contactNumber")?.value}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          kind="tertiary"
                          onClick={() => handleEdit(row.original)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          kind="danger--tertiary"
                          onClick={() => handleDelete(row.original.id)}
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
      )}

      {/* Edit Modal */}
      {selectedPatient && (
        <Modal
          open={modalOpen}
          modalHeading="Edit Patient"
          primaryButtonText={saving ? "Saving..." : "Save"}
          secondaryButtonText="Cancel"
          onRequestClose={() => setModalOpen(false)}
          onRequestSubmit={handleSave}
          primaryButtonDisabled={saving}
        >
          <TextInput
            id="firstName"
            name="firstName"
            labelText="First Name"
            value={selectedPatient.firstName || ""}
            onChange={handleChange}
          />
          <TextInput
            id="lastName"
            name="lastName"
            labelText="Last Name"
            value={selectedPatient.lastName || ""}
            onChange={handleChange}
          />
          <TextInput
            id="middleName"
            name="middleName"
            labelText="Middle Name"
            value={selectedPatient.middleName || ""}
            onChange={handleChange}
          />
          <TextInput
            id="dateOfBirth"
            name="dateOfBirth"
            labelText="Date of Birth"
            type="date"
            value={
              selectedPatient.dateOfBirth
                ? new Date(selectedPatient.dateOfBirth).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
          <Select
            id="gender"
            name="gender"
            labelText="Gender"
            value={selectedPatient.gender || ""}
            onChange={handleChange}
          >
            <SelectItem value="" text="Select gender" />
            <SelectItem value="MALE" text="Male" />
            <SelectItem value="FEMALE" text="Female" />
          </Select>
          <TextInput
            id="contactNumber"
            name="contactNumber"
            labelText="Contact Number"
            value={selectedPatient.contactNumber || ""}
            onChange={handleChange}
          />
        </Modal>
      )}
    </div>
  );
};

export default PatientManagement;
