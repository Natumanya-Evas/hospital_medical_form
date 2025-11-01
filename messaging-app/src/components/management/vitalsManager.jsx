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
  InlineNotification,
  Stack,
} from "@carbon/react";

const VitalsManager = () => {
  const [vitals, setVitals] = useState([]);
  const [selectedVital, setSelectedVital] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch vitals list
  const fetchVitals = async () => {
    try {
      const res = await fetch("http://localhost:8080/medic/vitals");
      const data = await res.json();
      setVitals(data);
    } catch (err) {
      console.error("Error fetching vitals:", err);
    }
  };

  useEffect(() => {
    fetchVitals();
  }, []);

  const headers = [
    { key: "id", header: "ID" },
    { key: "temperature", header: "Temp (°C)" },
    { key: "heartRate", header: "HR (bpm)" },
    { key: "bloodPressureSystolic", header: "BP Sys" },
    { key: "bloodPressureDiastolic", header: "BP Dia" },
    { key: "respiratoryRate", header: "Resp" },
    { key: "oxygenSaturation", header: "O₂ Sat (%)" },
    { key: "note", header: "Note" },
    { key: "actions", header: "Actions" },
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedVital((prev) => ({ ...prev, [name]: value }));
  };

  // Save updated vital
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/medic/vitals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedVital),
      });
      if (res.ok) {
        setNotification({
          kind: "success",
          title: "Vitals updated successfully",
        });
        setOpen(false);
        fetchVitals();
      } else {
        throw new Error("Failed to update vitals");
      }
    } catch (err) {
      setNotification({
        kind: "error",
        title: "Error updating vitals",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete vital record
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch(`http://localhost:8080/medic/vitals/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotification({
          kind: "success",
          title: "Vitals deleted successfully",
        });
        fetchVitals();
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      setNotification({
        kind: "error",
        title: "Error deleting vitals",
      });
    }
  };

  return (
    <div  style={{marginTop:"3rem"}} >
      <h2 >Patient Vitals</h2>

      {notification && (
        <InlineNotification
          kind={notification.kind}
          title={notification.title}
          onClose={() => setNotification(null)}
        />
      )}

      <DataTable rows={vitals} headers={headers}>
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
                            const record = vitals.find((v) => v.id === +row.id);
                            setSelectedVital(record);
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
      {selectedVital && (
        <Modal
          open={open}
          modalHeading="Edit Vitals"
          primaryButtonText={loading ? "Saving..." : "Save Changes"}
          secondaryButtonText="Cancel"
          onRequestSubmit={handleUpdate}
          onRequestClose={() => setOpen(false)}
          primaryButtonDisabled={loading}
        >
          <Stack gap={4}>
            <TextInput
              id="temperature"
              name="temperature"
              labelText="Temperature (°C)"
              value={selectedVital.temperature || ""}
              onChange={handleChange}
            />
            <TextInput
              id="heartRate"
              name="heartRate"
              labelText="Heart Rate (bpm)"
              value={selectedVital.heartRate || ""}
              onChange={handleChange}
            />
            <TextInput
              id="bloodPressureSystolic"
              name="bloodPressureSystolic"
              labelText="Systolic (mmHg)"
              value={selectedVital.bloodPressureSystolic || ""}
              onChange={handleChange}
            />
            <TextInput
              id="bloodPressureDiastolic"
              name="bloodPressureDiastolic"
              labelText="Diastolic (mmHg)"
              value={selectedVital.bloodPressureDiastolic || ""}
              onChange={handleChange}
            />
            <TextInput
              id="respiratoryRate"
              name="respiratoryRate"
              labelText="Respiratory Rate"
              value={selectedVital.respiratoryRate || ""}
              onChange={handleChange}
            />
            <TextInput
              id="oxygenSaturation"
              name="oxygenSaturation"
              labelText="Oxygen Saturation (%)"
              value={selectedVital.oxygenSaturation || ""}
              onChange={handleChange}
            />
            <TextInput
              id="note"
              name="note"
              labelText="Note"
              value={selectedVital.note || ""}
              onChange={handleChange}
            />
          </Stack>
        </Modal>
      )}
    </div>
  );
};

export default VitalsManager;
