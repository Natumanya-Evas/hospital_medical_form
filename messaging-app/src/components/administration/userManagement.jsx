import React, { useEffect, useState } from "react";
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Button,
  Modal,
  Pagination,
  TextInput,
} from "@carbon/react";
import { Add, Edit, TrashCan } from "@carbon/icons-react";

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    phone_number: "",
    email_email: "",
    account_number: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("http://localhost:4000");
      const data = await res.json();
      setCustomers(data);
      setFiltered(data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // CRUD
  const handleSave = async () => {
    const method = editingCustomer ? "PUT" : "POST";
    const url = editingCustomer
      ? `http://localhost:4000/customer/${editingCustomer.id}`
      : "http://localhost:4000/customer";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      fetchCustomers();
      setShowModal(false);
      setEditingCustomer(null);
      resetForm();
    } catch (err) {
      console.error("Failed to save customer:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await fetch(`http://localhost:4000/customer/${id}`, { method: "DELETE" });
      fetchCustomers();
    } catch (err) {
      console.error("Failed to delete customer:", err);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      middle_name: "",
      last_name: "",
      date_of_birth: "",
      phone_number: "",
      email_email: "",
      account_number: "",
    });
  };

  // Search
  const handleSearch = (value) => {
    setSearch(value);
    if (value === "") {
      setFiltered(customers);
    } else {
      const f = customers.filter((c) =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(f);
    }
  };

  // Pagination
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentPageData = filtered.slice(startIdx, endIdx);

  // Carbon DataTable headers
  const headers = [
    { key: "id", header: "ID" },
    { key: "first_name", header: "First Name" },
    { key: "middle_name", header: "Middle Name" },
    { key: "last_name", header: "Last Name" },
    { key: "phone_number", header: "Phone" },
    { key: "email_email", header: "Email" },
    { key: "account_number", header: "Account" },
    { key: "actions", header: "Actions" },
  ];

  // 🟢 Format data properly for Carbon DataTable
  const rows = currentPageData.map((cust) => ({
    id: cust.id.toString(),
    ...cust,
    actions: cust.id, // keep ID for button actions
  }));

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Customer Management</h3>
        <div className="flex gap-3">
          <TextInput
            id="search"
            labelText=""
            placeholder="Search customers..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Button
            renderIcon={Add}
            onClick={() => {
              resetForm();
              setEditingCustomer(null);
              setShowModal(true);
            }}
            kind="primary"
          >
            Add Customer
          </Button>
        </div>
      </div>

      {/* 🧮 DataTable */}
      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getHeaderProps }) => (
          <Table size="md" useZebraStyles={true}>
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
                    <TableCell key={cell.id}>
                      {cell.info.header === "actions" ? (
                        <div className="flex gap-2">
                          <Button
                            kind="tertiary"
                            size="sm"
                            renderIcon={Edit}
                            onClick={() =>
                              handleEdit(
                                currentPageData.find((c) => c.id.toString() === row.id)
                              )
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            kind="danger"
                            size="sm"
                            renderIcon={TrashCan}
                            onClick={() => handleDelete(row.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      ) : (
                        cell.value
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>

      {/* Pagination */}
      <Pagination
        totalItems={filtered.length}
        pageSize={pageSize}
        pageSizes={[5, 10, 20]}
        page={page}
        onChange={({ page, pageSize }) => {
          setPage(page);
          setPageSize(pageSize);
        }}
        className="mt-4"
      />

      {/* Modal */}
      <Modal
        open={showModal}
        modalHeading={editingCustomer ? "Edit Customer" : "Add Customer"}
        primaryButtonText={editingCustomer ? "Update" : "Create"}
        secondaryButtonText="Cancel"
        onRequestClose={() => setShowModal(false)}
        onRequestSubmit={handleSave}
      >
        <div className="grid grid-cols-2 gap-4 mt-4">
          {Object.keys(formData).map((key) => (
            <TextInput
              key={key}
              id={key}
              labelText={key.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              type={
                key === "date_of_birth"
                  ? "date"
                  : key === "email_email"
                  ? "email"
                  : "text"
              }
              value={formData[key] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [key]: e.target.value,
                })
              }
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default CustomerTable;
