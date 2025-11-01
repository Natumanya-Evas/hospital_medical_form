import React, { useState } from 'react';
import {
  Button,
  TextInput,
  Grid,
  Column,
  Stack,
  Heading,
  Tile,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
  Accordion,
  AccordionItem,
  Loading,
  InlineNotification,
  Section
} from '@carbon/react';
import { Download, Printer, Search, DocumentPdf } from '@carbon/icons-react';
import axios from 'axios';

const MedicalReport = () => {
  const [patientId, setPatientId] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:8080/medic/api/reports';

  const loadReport = async () => {
    if (!patientId) {
      setError('Please enter a Patient ID');
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await axios.get(`${API_BASE}/patient/${patientId}`);
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to load patient report');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!patientId) return;

    try {
      const response = await axios.get(`${API_BASE}/patient/${patientId}/pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `medical-report-patient-${patientId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download PDF');
    }
  };

  const printReport = () => {
    window.print();
  };

  const clearReport = () => {
    setPatientId('');
    setReport(null);
    setError(null);
  };

  const getStatusTag = (isCritical) => {
    return isCritical ? (
      <Tag type="red">Critical</Tag>
    ) : (
      <Tag type="green">Stable</Tag>
    );
  };

  const getBMITag = (bmi) => {
    if (!bmi) return <Tag>Unknown</Tag>;
    if (bmi < 18.5) return <Tag type="cyan">Underweight</Tag>;
    if (bmi < 25) return <Tag type="green">Normal</Tag>;
    if (bmi < 30) return <Tag type="yellow">Overweight</Tag>;
    return <Tag type="red">Obese</Tag>;
  };

  return (
    <Grid style={{marginTop:"4rem"}} className="medical-report-app">
      <Column lg={16} md={8} sm={4}>
        <Stack gap={6}>
          {/* Header */}
          <Section>
            <Stack gap={4}>
              <Heading>Medical Report System</Heading>
              <p className="cds--type-body-01">
                Generate comprehensive medical reports and PDF exports
              </p>
            </Stack>
          </Section>

          {/* Search Section */}
          <Section>
            <Tile>
              <Stack gap={6}>
                <Heading level={3}>Search Patient Report</Heading>
                <Grid>
                  <Column lg={8} md={4} sm={4}>
                    <Stack gap={4}>
                      <TextInput
                        id="patient-id"
                        labelText="Patient ID"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        placeholder="Enter Patient ID"
                        type="number"
                      />
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <Button
                          onClick={loadReport}
                          renderIcon={Search}
                          disabled={loading}
                        >
                          Generate Report
                        </Button>
                        <Button
                          kind="secondary"
                          onClick={clearReport}
                          disabled={loading}
                        >
                          Clear
                        </Button>
                      </div>
                    </Stack>
                  </Column>
                </Grid>
              </Stack>
            </Tile>
          </Section>

          {/* Loading State */}
          {loading && (
            <Section>
              <Tile>
                <Stack gap={4} align="center">
                  <Loading withOverlay={false} />
                  <p>Generating medical report...</p>
                </Stack>
              </Tile>
            </Section>
          )}

          {/* Error State */}
          {error && (
            <Section>
              <InlineNotification
                kind="error"
                title="Error"
                subtitle={error}
                onClose={() => setError(null)}
              />
            </Section>
          )}

          {/* Report Display */}
          {report && (
            <Stack gap={6}>
              {/* Action Buttons */}
              <Section>
                <Tile>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Button
                      onClick={downloadPDF}
                      renderIcon={DocumentPdf}
                      kind="primary"
                    >
                      Download PDF
                    </Button>
                    <Button
                      onClick={printReport}
                      renderIcon={Printer}
                      kind="secondary"
                    >
                      Print Report
                    </Button>
                  </div>
                </Tile>
              </Section>

              {/* Report Header */}
              <Section>
                <Tile>
                  <Stack gap={4}>
                    <Heading level={3}>Medical Report</Heading>
                    <Grid>
                      <Column lg={8} md={4} sm={4}>
                        <DataTable rows={[]} headers={[]}>
                          {() => (
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell>
                                    <strong>Patient Name:</strong>
                                  </TableCell>
                                  <TableCell>{report.patientName}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>
                                    <strong>Patient ID:</strong>
                                  </TableCell>
                                  <TableCell>{report.id}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>
                                    <strong>Report Date:</strong>
                                  </TableCell>
                                  <TableCell>
                                    {new Date(report.reportDate).toLocaleString()}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          )}
                        </DataTable>
                      </Column>
                    </Grid>
                  </Stack>
                </Tile>
              </Section>

              {/* Patient Information & Status */}
              <Grid>
                <Column lg={8} md={4} sm={4}>
                  <Tile>
                    <Stack gap={4}>
                      <Heading level={4}>Patient Information</Heading>
                      <DataTable rows={[]} headers={[]}>
                        {() => (
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell>Gender</TableCell>
                                <TableCell>{report.gender}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Age</TableCell>
                                <TableCell>{report.age} years</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        )}
                      </DataTable>
                    </Stack>
                  </Tile>
                </Column>
                <Column lg={8} md={4} sm={4}>
                  <Tile>
                    <Stack gap={4}>
                      <Heading level={4}>Health Status</Heading>
                      <DataTable rows={[]} headers={[]}>
                        {() => (
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell>BMI</TableCell>
                                <TableCell>
                                  {report.bmi ? report.bmi.toFixed(1) : 'N/A'}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>BMI Category</TableCell>
                                <TableCell>
                                  {getBMITag(report.bmi)}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Critical Status</TableCell>
                                <TableCell>
                                  {getStatusTag(report.hasCriticalVitals)}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        )}
                      </DataTable>
                    </Stack>
                  </Tile>
                </Column>
              </Grid>

              {/* Vitals & Biometrics */}
              <Grid>
                <Column lg={8} md={4} sm={4}>
                  <Tile>
                    <Stack gap={4}>
                      <Heading level={4}>Vital Signs</Heading>
                      {report.vitals ? (
                        <DataTable rows={[]} headers={[]}>
                          {() => (
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell>Temperature</TableCell>
                                  <TableCell>{report.vitals.temperature} °C</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Heart Rate</TableCell>
                                  <TableCell>{report.vitals.heartRate} bpm</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Blood Pressure</TableCell>
                                  <TableCell>
                                    {report.vitals.bloodPressureSystolic}/
                                    {report.vitals.bloodPressureDiastolic} mmHg
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Respiratory Rate</TableCell>
                                  <TableCell>{report.vitals.respiratoryRate} breaths/min</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Oxygen Saturation</TableCell>
                                  <TableCell>{report.vitals.oxygenSaturation}%</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          )}
                        </DataTable>
                      ) : (
                        <p>No vitals data available</p>
                      )}
                    </Stack>
                  </Tile>
                </Column>
                <Column lg={8} md={4} sm={4}>
                  <Tile>
                    <Stack gap={4}>
                      <Heading level={4}>Biometrics</Heading>
                      {report.biometrics ? (
                        <DataTable rows={[]} headers={[]}>
                          {() => (
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell>Weight</TableCell>
                                  <TableCell>{report.biometrics.mass} kg</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Height</TableCell>
                                  <TableCell>{report.biometrics.height} cm</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Waist Circumference</TableCell>
                                  <TableCell>{report.biometrics.waistCircumference} cm</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          )}
                        </DataTable>
                      ) : (
                        <p>No biometrics data available</p>
                      )}
                    </Stack>
                  </Tile>
                </Column>
              </Grid>

              {/* Diagnosis */}
              <Section>
                <Tile>
                  <Stack gap={4}>
                    <Heading level={4}>Diagnosis</Heading>
                    {report.diagnosis && report.diagnosis.length > 0 ? (
                      <Accordion>
                        {report.diagnosis.map((diag, index) => (
                          <AccordionItem
                            key={diag.id}
                            title={diag.diagnosed}
                          >
                            <Stack gap={3}>
                              {diag.symptoms && (
                                <div>
                                  <strong>Symptoms:</strong> {diag.symptoms}
                                </div>
                              )}
                              {diag.signs && (
                                <div>
                                  <strong>Signs:</strong> {diag.signs}
                                </div>
                              )}
                              {diag.treatment && (
                                <div>
                                  <strong>Treatment:</strong> {diag.treatment}
                                </div>
                              )}
                            </Stack>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <p>No diagnoses recorded</p>
                    )}
                  </Stack>
                </Tile>
              </Section>

              {/* Medications */}
              <Section>
                <Tile>
                  <Stack gap={4}>
                    <Heading level={4}>Medications</Heading>
                    {report.dosage && report.dosage.length > 0 ? (
                      <Accordion>
                        {report.dosage.map((med, index) => (
                          <AccordionItem
                            key={med.id}
                            title={`${med.drugName} - ${med.amount}`}
                          >
                            <Stack gap={3}>
                              {med.prescription && (
                                <div>
                                  <strong>Prescription:</strong> {med.prescription}
                                </div>
                              )}
                              {med.caution && (
                                <div>
                                  <strong>Caution:</strong> {med.caution}
                                </div>
                              )}
                              {med.note && (
                                <div>
                                  <strong>Notes:</strong> {med.note}
                                </div>
                              )}
                              {med.medicinePrice && (
                                <div>
                                  <strong>Price:</strong> ${med.medicinePrice.price} 
                                  ({med.medicinePrice.quantity} {med.medicinePrice.unitMeasure})
                                </div>
                              )}
                            </Stack>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <p>No medications prescribed</p>
                    )}
                  </Stack>
                </Tile>
              </Section>

              {/* Test Results */}
              <Section>
                <Tile>
                  <Stack gap={4}>
                    <Heading level={4}>Test Results</Heading>
                    {report.result && report.result.length > 0 ? (
                      <Accordion>
                        {report.result.map((result, index) => (
                          <AccordionItem
                            key={result.id}
                            title={`${result.resultCode} - ${result.description}`}
                          >
                            <Stack gap={3}>
                              <div>
                                <strong>Type:</strong> {result.resultType}
                              </div>
                              <div>
                                <strong>Method:</strong> {result.testMethod}
                              </div>
                              {result.notes && (
                                <div>
                                  <strong>Notes:</strong> {result.notes}
                                </div>
                              )}
                              <div>
                                <strong>Date:</strong> {new Date(result.createdAt).toLocaleDateString()}
                              </div>
                            </Stack>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <p>No test results available</p>
                    )}
                  </Stack>
                </Tile>
              </Section>
            </Stack>
          )}
        </Stack>
      </Column>
    </Grid>
  );
};

export default MedicalReport;