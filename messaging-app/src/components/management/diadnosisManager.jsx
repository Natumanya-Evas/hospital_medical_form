import React, { useState, useEffect } from "react";
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
  Modal,
  TextInput,
  InlineNotification,
  Stack,
} from "@carbon/react";

const DiagnosisManager = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch all diagnoses
  const fetchDiagnoses = async () => {
    try {
      const res = await fetch("http://localhost:8080/medic/diagnoses");
      const data = await res.json();
      setDiagnoses(data);
    } catch (err) {
      console.error("Error fetching diagnoses:", err);
    }
  };

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedDiagnosis((prev) => ({ ...prev, [name]: value }));
  };

  // Update diagnosis
  const handleUpdate = async () => {
    if (!selectedDiagnosis) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/medic/diagnoses/${selectedDiagnosis.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedDiagnosis),
        }
      );
      if (res.ok) {
        setNotification({
          kind: "success",
          title: "Diagnosis updated successfully",
        });
        setOpen(false);
        fetchDiagnoses();
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      setNotification({
        kind: "error",
        title: "Error updating diagnosis",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete diagnosis
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this diagnosis?"))
      return;
    try {
      const res = await fetch(`http://localhost:8080/medic/diagnoses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotification({
          kind: "success",
          title: "Diagnosis deleted successfully",
        });
        fetchDiagnoses();
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      setNotification({
        kind: "error",
        title: "Error deleting diagnosis",
      });
    }
  };

  const headers = [
    { key: "id", header: "ID" },
    { key: "diagnosed", header: "Diagnosis" },
    { key: "symptoms", header: "Symptoms" },
    { key: "signs", header: "Signs" },
    { key: "treatment", header: "Treatment" },
    { key: "actions", header: "Actions" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Diagnosis Management</h2>

      {notification && (
        <InlineNotification
          kind={notification.kind}
          title={notification.title}
          onClose={() => setNotification(null)}
        />
      )}

      <DataTable rows={diagnoses} headers={headers}>
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
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                    <TableCell>
                      <Stack orientation="horizontal" gap={3}>
                        <Button
                          size="sm"
                          kind="tertiary"
                          onClick={() => {
                            setSelectedDiagnosis(
                              diagnoses.find((d) => d.id === +row.id)
                            );
                            setOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          kind="danger--tertiary"
                          onClick={() => handleDelete(row.id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>

      {/* Edit Modal */}
      {selectedDiagnosis && (
        <Modal
          open={open}
          modalHeading="Edit Diagnosis"
          primaryButtonText={loading ? "Saving..." : "Save Changes"}
          secondaryButtonText="Cancel"
          onRequestSubmit={handleUpdate}
          onRequestClose={() => setOpen(false)}
          primaryButtonDisabled={loading}
        >
          <Stack gap={4}>
            <TextInput
              id="diagnosed"
              labelText="Diagnosis"
              name="diagnosed"
              value={selectedDiagnosis.diagnosed || ""}
              onChange={handleChange}
            />
            <TextInput
              id="symptoms"
              labelText="Symptoms"
              name="symptoms"
              value={selectedDiagnosis.symptoms || ""}
              onChange={handleChange}
            />
            <TextInput
              id="signs"
              labelText="Signs"
              name="signs"
              value={selectedDiagnosis.signs || ""}
              onChange={handleChange}
            />
            <TextInput
              id="treatment"
              labelText="Treatment"
              name="treatment"
              value={selectedDiagnosis.treatment || ""}
              onChange={handleChange}
            />
          </Stack>
        </Modal>
      )}
    </div>
  );
};

export default DiagnosisManager;
