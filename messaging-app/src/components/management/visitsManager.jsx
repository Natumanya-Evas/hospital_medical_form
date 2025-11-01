import React, { useEffect, useState } from "react";
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
  DatePicker,
  DatePickerInput,
  Checkbox,
  InlineNotification,
  Stack,
} from "@carbon/react";

const VisitsManager = () => {
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const API_BASE = "http://localhost:8080/medic/visits";

  // Fetch visits
  const fetchVisits = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setVisits(data);
    } catch (err) {
      console.error("Error fetching visits:", err);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const headers = [
    { key: "id", header: "ID" },
    { key: "reason", header: "Reason" },
    { key: "visitType", header: "Visit Type" },
    { key: "visitDate", header: "Visit Date" },
    { key: "endDate", header: "End Date" },
    { key: "active", header: "Active" },
    { key: "actions", header: "Actions" },
  ];

  // Convert timestamps to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return "-";
    }
  };

  // Handle field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedVisit((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Update visit
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedVisit),
      });
      if (res.ok) {
        setNotification({ kind: "success", title: "Visit updated successfully" });
        setOpen(false);
        fetchVisits();
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error(err);
      setNotification({ kind: "error", title: "Error updating visit" });
    } finally {
      setLoading(false);
    }
  };

  // Delete visit
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this visit?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotification({ kind: "success", title: "Visit deleted successfully" });
        fetchVisits();
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      console.error(err);
      setNotification({ kind: "error", title: "Error deleting visit" });
    }
  };

  return (
    <div style={{marginTop:"4rem"}} className="">
     <h2>Manage Patient Visits</h2>

      {notification && (
        <InlineNotification
          kind={notification.kind}
          title={notification.title}
          onClose={() => setNotification(null)}
        />
      )}

      <DataTable title="Patient Visits" rows={visits} headers={headers}>
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
                    {row.cells.map((cell) => {
                      const headerKey = cell.info?.header || "";
                      const rawValue = cell.value;

                      let displayValue = "";
                      if (headerKey.toLowerCase().includes("date")) {
                        displayValue = formatDate(rawValue);
                      } else if (typeof rawValue === "boolean") {
                        displayValue = rawValue ? "Yes" : "No";
                      } else {
                        displayValue = rawValue ?? "-";
                      }

                      return <TableCell key={cell.id}>{displayValue}</TableCell>;
                    })}
                    <TableCell>
                      <Stack orientation="horizontal" gap={3}>
                        <Button
                          size="sm"
                          kind="tertiary"
                          onClick={() => {
                            const record = visits.find((v) => v.id === +row.id);
                            setSelectedVisit(record);
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

      {/* Edit Visit Modal */}
      {selectedVisit && (
        <Modal
          open={open}
          modalHeading="Edit Visit"
          primaryButtonText={loading ? "Saving..." : "Save Changes"}
          secondaryButtonText="Cancel"
          onRequestSubmit={handleUpdate}
          onRequestClose={() => setOpen(false)}
          primaryButtonDisabled={loading}
        >
          <Stack gap={4}>
            <TextInput
              id="reason"
              name="reason"
              labelText="Reason"
              value={selectedVisit.reason || ""}
              onChange={handleChange}
            />
            <TextInput
              id="visitType"
              name="visitType"
              labelText="Visit Type"
              value={selectedVisit.visitType || ""}
              onChange={handleChange}
            />
            <DatePicker
              datePickerType="single"
              value={
                selectedVisit.visitDate
                  ? new Date(selectedVisit.visitDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(date) =>
                setSelectedVisit((prev) => ({
                  ...prev,
                  visitDate: date?.[0] ? new Date(date[0]).getTime() : prev.visitDate,
                }))
              }
            >
              <DatePickerInput
                id="visitDate"
                labelText="Visit Date"
                placeholder="yyyy-mm-dd"
              />
            </DatePicker>
            <DatePicker
              datePickerType="single"
              value={
                selectedVisit.endDate
                  ? new Date(selectedVisit.endDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(date) =>
                setSelectedVisit((prev) => ({
                  ...prev,
                  endDate: date?.[0] ? new Date(date[0]).getTime() : prev.endDate,
                }))
              }
            >
              <DatePickerInput
                id="endDate"
                labelText="End Date"
                placeholder="yyyy-mm-dd"
              />
            </DatePicker>
            <Checkbox
              id="active"
              name="active"
              labelText="Active"
              checked={!!selectedVisit.active}
              onChange={(e) =>
                setSelectedVisit((prev) => ({
                  ...prev,
                  active: e.target.checked,
                }))
              }
            />
          </Stack>
        </Modal>
      )}
    </div>
  );
};

export default VisitsManager;
