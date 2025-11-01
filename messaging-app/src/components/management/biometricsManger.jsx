import React, { useEffect, useState } from "react";
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Button,
  Modal,
  TextInput,
  InlineNotification,
  Stack,
} from "@carbon/react";

const BiometricsManager = () => {
  const [biometrics, setBiometrics] = useState([]);
  const [selectedBiometric, setSelectedBiometric] = useState(null);
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load biometrics from backend
  const fetchBiometrics = async () => {
    try {
      const res = await fetch("http://localhost:8080/medic/biometrics");
      const data = await res.json();
      setBiometrics(data);
    } catch (err) {
      console.error("Error fetching biometrics:", err);
    }
  };

  useEffect(() => {
    fetchBiometrics();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedBiometric((prev) => ({ ...prev, [name]: value }));
  };

  // Update biometric
  const handleUpdate = async () => {
    if (!selectedBiometric) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/medic/vitals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedBiometric),
      });
      if (res.ok) {
        setNotification({
          kind: "success",
          title: "Biometric updated successfully",
        });
        setOpen(false);
        fetchBiometrics();
      } else {
        throw new Error("Failed to update biometric");
      }
    } catch (err) {
      setNotification({
        kind: "error",
        title: "Error updating biometric",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete biometric
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this biometric?"))
      return;
    try {
      const res = await fetch(`http://localhost:8080/medic/vitals/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotification({
          kind: "success",
          title: "Biometric deleted successfully",
        });
        fetchBiometrics();
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      setNotification({
        kind: "error",
        title: "Error deleting biometric",
      });
    }
  };

  const headers = [
    { key: "id", header: "ID" },
    { key: "mass", header: "Mass (kg)" },
    { key: "height", header: "Height (cm)" },
    { key: "waistCircumference", header: "Waist (cm)" },
    { key: "bmi", header: "BMI" },
    { key: "actions", header: "Actions" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Biometric Records</h2>

      {notification && (
        <InlineNotification
          kind={notification.kind}
          title={notification.title}
          onClose={() => setNotification(null)}
        />
      )}

      <DataTable rows={biometrics} headers={headers}>
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
                            const biometric = biometrics.find(
                              (b) => b.id === +row.id
                            );
                            setSelectedBiometric(biometric);
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
      {selectedBiometric && (
        <Modal
          open={open}
          modalHeading="Edit Biometric"
          primaryButtonText={loading ? "Saving..." : "Save Changes"}
          secondaryButtonText="Cancel"
          onRequestSubmit={handleUpdate}
          onRequestClose={() => setOpen(false)}
          primaryButtonDisabled={loading}
        >
          <Stack gap={4}>
            <TextInput
              id="mass"
              labelText="Mass (kg)"
              name="mass"
              value={selectedBiometric.mass || ""}
              onChange={handleChange}
            />
            <TextInput
              id="height"
              labelText="Height (cm)"
              name="height"
              value={selectedBiometric.height || ""}
              onChange={handleChange}
            />
            <TextInput
              id="waistCircumference"
              labelText="Waist Circumference (cm)"
              name="waistCircumference"
              value={selectedBiometric.waistCircumference || ""}
              onChange={handleChange}
            />
            <TextInput
              id="bmi"
              labelText="BMI"
              name="bmi"
              value={selectedBiometric.bmi || ""}
              onChange={handleChange}
            />
          </Stack>
        </Modal>
      )}
    </div>
  );
};

export default BiometricsManager;
