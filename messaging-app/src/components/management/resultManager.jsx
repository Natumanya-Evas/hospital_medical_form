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

const ResultManager = () => {
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch all results
  const fetchResults = async () => {
    try {
      const res = await fetch("http://localhost:8080/medic/api/results");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Error fetching results:", err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedResult((prev) => ({ ...prev, [name]: value }));
  };

  // Update result
  const handleUpdate = async () => {
    if (!selectedResult) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/medic/api/results/${selectedResult.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedResult),
        }
      );
      if (res.ok) {
        setNotification({
          kind: "success",
          title: "Result updated successfully",
        });
        setOpen(false);
        fetchResults();
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      setNotification({
        kind: "error",
        title: "Error updating result",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete result
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return;
    try {
      const res = await fetch(
        `http://localhost:8080/medic/api/results/${id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setNotification({
          kind: "success",
          title: "Result deleted successfully",
        });
        fetchResults();
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      setNotification({
        kind: "error",
        title: "Error deleting result",
      });
    }
  };

  const headers = [
    { key: "id", header: "ID" },
    { key: "resultCode", header: "Code" },
    { key: "description", header: "Description" },
    { key: "resultType", header: "Type" },
    { key: "testMethod", header: "Method" },
    { key: "notes", header: "Notes" },
    { key: "createdAt", header: "Created At" },
    { key: "actions", header: "Actions" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Lab Results</h2>

      {notification && (
        <InlineNotification
          kind={notification.kind}
          title={notification.title}
          onClose={() => setNotification(null)}
        />
      )}

      <DataTable
        rows={results.map((r) => ({
          ...r,
          id: r.id.toString(),
          createdAt: new Date(r.createdAt).toLocaleString(),
        }))}
        headers={headers}
      >
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
                            setSelectedResult(results.find((r) => r.id === +row.id));
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
      {selectedResult && (
        <Modal
          open={open}
          modalHeading="Edit Result"
          primaryButtonText={loading ? "Saving..." : "Save Changes"}
          secondaryButtonText="Cancel"
          onRequestSubmit={handleUpdate}
          onRequestClose={() => setOpen(false)}
          primaryButtonDisabled={loading}
        >
          <Stack gap={4}>
            <TextInput
              id="resultCode"
              labelText="Result Code"
              name="resultCode"
              value={selectedResult.resultCode || ""}
              onChange={handleChange}
            />
            <TextInput
              id="description"
              labelText="Description"
              name="description"
              value={selectedResult.description || ""}
              onChange={handleChange}
            />
            <TextInput
              id="resultType"
              labelText="Result Type"
              name="resultType"
              value={selectedResult.resultType || ""}
              onChange={handleChange}
            />
            <TextInput
              id="testMethod"
              labelText="Test Method"
              name="testMethod"
              value={selectedResult.testMethod || ""}
              onChange={handleChange}
            />
            <TextInput
              id="notes"
              labelText="Notes"
              name="notes"
              value={selectedResult.notes || ""}
              onChange={handleChange}
            />
          </Stack>
        </Modal>
      )}
    </div>
  );
};

export default ResultManager;
