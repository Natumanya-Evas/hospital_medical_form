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
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Pagination,
} from "@carbon/react";
import "bootstrap/dist/css/bootstrap.min.css";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 🔹 Derive category and visit status
  const deriveCategory = (patient) => (patient.bed ? "Inpatient" : "Outpatient");
  const deriveVisitStatus = (patient) =>
    patient.visits?.some((v) => v.active) ? "Active" : "Inactive";

  // 🔹 Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:8080/medic/api/patients");
        const data = await response.json();

        const enriched = data.map((p) => ({
          ...p,
          category: deriveCategory(p),
          visitStatus: deriveVisitStatus(p),
        }));

        setPatients(enriched);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, []);

  // 🔹 Table headers
  const headers = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "gender", header: "Gender" },
    { key: "contactNumber", header: "Contact" },
    { key: "category", header: "Category" }, // Inpatient / Outpatient
    { key: "visitStatus", header: "Status" }, // Active / Inactive
  ];

  // 🔹 Prepare rows for table
  const rows = patients.map((p) => ({
    id: p.id.toString(),
    name: `${p.firstName} ${p.middleName || ""} ${p.lastName}`,
    gender: p.gender,
    contactNumber: p.contactNumber,
    category: p.category,
    visitStatus: p.visitStatus,
  }));

  // 🔹 Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRows = rows.slice(startIndex, startIndex + pageSize);

  // 🔹 Color mapping for better UX
  const getCellColor = (header, value) => {
    if (header === "category") {
      return value === "Inpatient" ? "green" : "blue";
    }
    if (header === "visitStatus") {
      return value === "Active" ? "orange" : "gray";
    }
    return "black";
  };

  return (
    <div className="p-4 shadow-lg bg-light rounded" style={{marginTop:"4rem"}} >
      <h4 className="mb-3 text-primary">Patient Management Table</h4>

      <DataTable
        rows={paginatedRows}
        headers={headers}
        isSortable
        render={({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
          <TableContainer>
            {/* Toolbar with search */}
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch persistent />
              </TableToolbarContent>
            </TableToolbar>

            {/* Table */}
            <Table {...getTableProps()} size="lg">
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
                  <TableRow key={row.id} {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          fontWeight:
                            cell.info.header === "category" ||
                            cell.info.header === "visitStatus"
                              ? "600"
                              : "400",
                          color: getCellColor(cell.info.header, cell.value),
                        }}
                      >
                        {cell.value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <Pagination
              totalItems={patients.length}
              page={currentPage}
              pageSize={pageSize}
              pageSizes={[5, 10, 20]}
              onChange={({ page, pageSize }) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              }}
              size="lg"
            />
          </TableContainer>
        )}
      />
    </div>
  );
};

export default PatientList;
