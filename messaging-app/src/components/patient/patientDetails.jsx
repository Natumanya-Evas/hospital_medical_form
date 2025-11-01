import { Grid, Column, Stack, Tile, Button } from '@carbon/react';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Add, UserAvatar } from '@carbon/icons-react';
import VitalsModal from '../modals/vitalsModal';
import BiometricsModal from '../modals/biometricsModal';
import AddressModal from '../modals/addressModal';
import ResultModal from '../modals/resultModal';
import DosageModal from '../modals/dosageModal';
import DiagnosisModal from '../modals/diagnosisModal';
import VisitModal from '../modals/visitModal';
import BedAssignmentModal from '../modals/assignBedModal';

const PatientDetails = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showVitalsModal, setShowVitalsModal] = useState(false);
    const [showBiometricsModal, setShowBiometricsModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showDosageModal, setShowDosageModal] = useState(false);
    const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
    const [showVisitModal, setShowVisitModal] = useState(false);
    const [showBedModal, setShowBedModal] = useState(false);
    const navigate = useNavigate()




    useEffect(() => {
        // Fetch patient data
        const fetchPatient = async () => {
            try {
                const response = await fetch(`http://localhost:8080/medic/api/patients/${id}`);
                const data = await response.json();
                setPatient(data);
            } catch (error) {
                console.error('Error fetching patient:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!patient) return <div>Patient not found</div>;

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleDateString();
    };

    const formatDateTime = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleString();
    };

    // Handler functions for adding items
    const handleAddAddress = () => {
        setShowAddressModal(true);
    };

    const handleAddBed = () => {
        setShowBedModal(true);
    };

    const handleAddVitals = () => {
        setShowVitalsModal(true);
        // Implement add vitals logic
    };

    const handleAddBiometrics = () => {
        setShowBiometricsModal(true);
        console.log('Add biometrics for patient:', patient.id);
        // Implement add biometrics logic
    };

    const handleAddVisit = () => {
        setShowVisitModal(true);
    };

    const handleAddMedication = () => {
        setShowDosageModal(true);

    };

    const handleAddDiagnosis = () => {
        setShowDiagnosisModal(true);
    };

    const handleAddTestResult = () => {
     setShowResultModal(true);
    };

    return (
        <div style={{marginTop:"4rem"}} >
            {/* Patient Basic Information */}
            <Column sm={4} md={8} lg={16}  style={{border:"solid #ddd 1px"}} className='m-3 rounded p-3 '>


                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ marginBottom: '1rem' }}>Personal Details</h4>
                                <Button kind="ghost" renderIcon={Add} onClick={()=>navigate(`/report/${patient.id}`)}>
                                    View Full Report
                                </Button>
                            </div>
<div style={{display:"flex"}} >
                                    <Stack gap={2} style={{margin:"5px"}} >
                                        <div>
                                            <UserAvatar size={50} />
                                        </div>
                                        <div>
                                            <strong>Patient ID:</strong>
                                            <div>{patient.id}</div>
                                        </div>
                                        <div>
                                            <strong>First Name:</strong>
                                            <div>{patient.firstName}</div>
                                        </div>
                                        <div>
                                            <strong>Middle Name:</strong>
                                            <div>{patient.middleName || 'N/A'}</div>
                                        </div>
                                    </Stack>
                                
                                
                                    <Stack gap={2}>
                                        <div>
                                            <strong>Last Name:</strong>
                                            <div>{patient.lastName}</div>
                                        </div>
                                        <div>
                                            <strong>Date of Birth:</strong>
                                            <div>{formatDate(patient.dateOfBirth)}</div>
                                        </div>
                                        <div>
                                            <strong>Gender:</strong>
                                            <div>{patient.gender}</div>
                                        </div>
                                    </Stack>
            
                            
                            <div style={{ marginTop: '1rem' }}>
                                <strong>Contact Number:</strong>
                                <div>{patient.contactNumber}</div>
                            </div>
            </div>
                        </Column>

            {/* Address Information */}
            <Column sm={4} md={8} lg={16} className='m-3 shadow '>
                <Tile style={{borderRadius:"10px", backgroundColor:"white"}} >  
                    <Stack gap={4}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Address</h4>
                            <Button 
                                kind="ghost" 
                                renderIcon={Add} 
                                onClick={handleAddAddress}
                            >
                                {patient.address ? 'Edit' : 'Add'} Address
                            </Button>
                        </div>
                        {patient.address ? (
                            <Grid narrow>
                                <Column sm={2} md={4} lg={8}>
                                    <Stack gap={2}>
                                        <div>
                                            <strong>Street:</strong>
                                            <div>{patient.address.street}</div>
                                        </div>
                                        <div>
                                            <strong>City:</strong>
                                            <div>{patient.address.city}</div>
                                        </div>
                                    </Stack>
                                </Column>
                                <Column sm={2} md={4} lg={8}>
                                    <Stack gap={2}>
                                        <div>
                                            <strong>State:</strong>
                                            <div>{patient.address.state}</div>
                                        </div>
                                        <div>
                                            <strong>Zip Code:</strong>
                                            <div>{patient.address.zipCode}</div>
                                        </div>
                                    </Stack>
                                </Column>
                            </Grid>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#8a8d90' }}>
                                <p>No address information available</p>
                            </div>
                        )}
                        {patient.address && (
                            <div>
                                <strong>Country:</strong>
                                <div>{patient.address.country}</div>
                            </div>
                        )}
                    </Stack>
                </Tile>
            </Column>

            {/* Bed Information */}
            <Column sm={4} md={8} lg={16} className='m-3 shadow'>
                <Tile style={{borderRadius:"10px", backgroundColor:"white"}} >
                    <Stack gap={4}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Bed Assignment</h4>
                            <Button 
                                kind="ghost" 
                                renderIcon={Add} 
                                onClick={handleAddBed}
                            >
                                {patient.bed ? 'Change' : 'Assign'} Bed
                            </Button>
                        </div>
                        {patient.bed ? (
                            <Grid narrow>
                                <Column sm={2} md={4} lg={8}>
                                    <Stack gap={2}>
                                        <div>
                                            <strong>Bed Number:</strong>
                                            <div>{patient.bed.bedNumber}</div>
                                        </div>
                                        <div>
                                            <strong>Ward ID:</strong>
                                            <div>{patient.bed.wardId}</div>
                                        </div>
                                    </Stack>
                                </Column>
                                <Column sm={2} md={4} lg={8}>
                                    <Stack gap={2}>
                                        <div>
                                            <strong>Location:</strong>
                                            <div>Row {patient.bed.bedRow}, Column {patient.bed.bedColumn}</div>
                                        </div>
                                        <div>
                                            <strong>Status:</strong>
                                            <div>{patient.bed.occupied ? 'Occupied' : 'Available'}</div>
                                        </div>
                                    </Stack>
                                </Column>
                            </Grid>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#8a8d90' }}>
                                <p>No bed assignment</p>
                            </div>
                        )}
                    </Stack>
                </Tile>
            </Column>

            {/* Vitals */}
            <Column sm={4} md={8} lg={16} className='m-3 shadow'>
                <Tile style={{borderRadius:"10px", backgroundColor:"white"}} >
                    <Stack gap={4}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Vitals</h4>
                            <Button 
                                kind="ghost" 
                                renderIcon={Add} 
                                onClick={handleAddVitals}
                            >
                                {patient.vitals ? 'Update' : 'Add'} Vitals
                            </Button>
                        </div>
                        {patient.vitals ? (
                            <Grid narrow>
                                <Column sm={2} md={4} lg={4}>
                                    <Stack gap={2}>
                                        <div>
                                            <strong>Temperature:</strong>
                                            <div>{patient.vitals.temperature}°C</div>
                                        </div>
                                        <div>
                                            <strong>Heart Rate:</strong>
                                            <div>{patient.vitals.heartRate} bpm</div>
                                        </div>
                                    </Stack>
                                </Column>
                                <Column sm={2} md={4} lg={4}>
                                    <Stack gap={2}>
                                        <div>
                                            <strong>Blood Pressure:</strong>
                                            <div>{patient.vitals.bloodPressureSystolic}/{patient.vitals.bloodPressureDiastolic}</div>
                                        </div>
                                        <div>
                                            <strong>Respiratory Rate:</strong>
                                            <div>{patient.vitals.respiratoryRate} bpm</div>
                                        </div>
                                    </Stack>
                                </Column>
                                <Column sm={2} md={4} lg={8}>
                                    <Stack gap={2}>
                                        <div>
                                            <strong>Oxygen Saturation:</strong>
                                            <div>{patient.vitals.oxygenSaturation}%</div>
                                        </div>
                                        {patient.vitals.note && (
                                            <div>
                                                <strong>Notes:</strong>
                                                <div>{patient.vitals.note}</div>
                                            </div>
                                        )}
                                    </Stack>
                                </Column>
                            </Grid>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#8a8d90' }}>
                                <p>No vitals recorded</p>
                            </div>
                        )}
                    </Stack>
                </Tile>
            </Column>

            {/* Biometrics */}
            <Column sm={4} md={8} lg={16} className='m-3 shadow'>
                <Tile style={{borderRadius:"10px", backgroundColor:"white"}} >
                    <Stack gap={4}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Biometrics</h4>
                            <Button 
                                kind="ghost" 
                                renderIcon={Add} 
                                onClick={handleAddBiometrics}
                            >
                                {patient.biometrics ? 'Update' : 'Add'} Biometrics
                            </Button>
                        </div>
                        {patient.biometrics ? (
                            <Grid narrow>
                                <Column sm={2} md={4} lg={4}>
                                    <Stack gap={2}>
                                        <div>
                                            <strong>Height:</strong>
                                            <div>{patient.biometrics.height} cm</div>
                                        </div>
                                        <div>
                                            <strong>Mass:</strong>
                                            <div>{patient.biometrics.mass} kg</div>
                                        </div>
                                    </Stack>
                                </Column>
                                <Column sm={2} md={4} lg={4}>
                                    <Stack gap={2}>
                                        <div>
                                            <strong>BMI:</strong>
                                            <div>{patient.biometrics.bmi}</div>
                                        </div>
                                        <div>
                                            <strong>Waist:</strong>
                                            <div>{patient.biometrics.waistCircumference} cm</div>
                                        </div>
                                    </Stack>
                                </Column>
                            </Grid>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#8a8d90' }}>
                                <p>No biometrics recorded</p>
                            </div>
                        )}
                    </Stack>
                </Tile>
            </Column>

            {/* Visits */}
            <Column sm={4} md={8} lg={16} className='m-3 shadow'>
                <Tile style={{borderRadius:"10px", backgroundColor:"white"}} >
                    <Stack gap={4}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Recent Visits</h4>
                            <Button 
                                kind="ghost" 
                                renderIcon={Add} 
                                onClick={handleAddVisit}
                            >
                                Add Visit
                            </Button>
                        </div>
                        {patient.visits && patient.visits.length > 0 ? (
                            patient.visits.map((visit) => (
                                <div key={visit.id} style={{ 
                                    padding: '1rem', 
                                    border: '1px solid #e0e0e0', 
                                    borderRadius: '4px',
                                    marginBottom: '0.5rem'
                                }}>
                                    <Stack gap={2}>
                                        <div><strong>Reason:</strong> {visit.reason}</div>
                                        <div><strong>Type:</strong> {visit.visitType}</div>
                                        <div><strong>Visit Date:</strong> {formatDateTime(visit.visitDate)}</div>
                                        {visit.endDate && (
                                            <div><strong>End Date:</strong> {formatDateTime(visit.endDate)}</div>
                                        )}
                                        <div><strong>Status:</strong> {visit.active ? 'Active' : 'Completed'}</div>
                                    </Stack>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#8a8d90' }}>
                                <p>No visits recorded</p>
                            </div>
                        )}
                    </Stack>
                </Tile>
            </Column>

            {/* Medications */}
            <Column sm={4} md={8} lg={16} className='m-3 shadow'>
                <Tile style={{borderRadius:"10px", backgroundColor:"white"}} >
                    <Stack gap={4}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Current Medications</h4>
                            <Button 
                                kind="ghost" 
                                renderIcon={Add} 
                                onClick={handleAddMedication}
                            >
                                Add Medication
                            </Button>
                        </div>
                        {patient.dosages && patient.dosages.length > 0 ? (
                            patient.dosages.map((dosage) => (
                                <div key={dosage.id} style={{ 
                                    padding: '1rem', 
                                    border: '1px solid #e0e0e0', 
                                    borderRadius: '4px',
                                    marginBottom: '0.5rem'
                                }}>
                                    <Stack gap={2}>
                                        <div><strong>Drug:</strong> {dosage.drugName}</div>
                                        <div><strong>Dosage:</strong> {dosage.amount}</div>
                                        <div><strong>Prescription:</strong> {dosage.prescription}</div>
                                        {dosage.caution && (
                                            <div style={{ color: '#da1e28' }}>
                                                <strong>Caution:</strong> {dosage.caution}
                                            </div>
                                        )}
                                        {dosage.note && (
                                            <div><strong>Note:</strong> {dosage.note}</div>
                                        )}
                                    </Stack>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#8a8d90' }}>
                                <p>No medications prescribed</p>
                            </div>
                        )}
                    </Stack>
                </Tile>
            </Column>

            {/* Diagnoses */}
            <Column sm={4} md={8} lg={16} className='m-3 shadow'>
                <Tile style={{borderRadius:"10px", backgroundColor:"white"}} >
                    <Stack gap={4}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Diagnoses</h4>
                            <Button 
                                kind="ghost" 
                                renderIcon={Add} 
                                onClick={handleAddDiagnosis}
                            >
                                Add Diagnosis
                            </Button>
                        </div>
                        {patient.diagnoses && patient.diagnoses.length > 0 ? (
                            patient.diagnoses.map((diagnosis) => (
                                <div key={diagnosis.id} style={{ 
                                    padding: '1rem', 
                                    border: '1px solid #e0e0e0', 
                                    borderRadius: '4px',
                                    marginBottom: '0.5rem'
                                }}>
                                    <Stack gap={2}>
                                        <div><strong>Condition:</strong> {diagnosis.diagnosed}</div>
                                        {diagnosis.symptoms && (
                                            <div><strong>Symptoms:</strong> {diagnosis.symptoms}</div>
                                        )}
                                        {diagnosis.signs && (
                                            <div><strong>Signs:</strong> {diagnosis.signs}</div>
                                        )}
                                        {diagnosis.treatment && (
                                            <div><strong>Treatment:</strong> {diagnosis.treatment}</div>
                                        )}
                                    </Stack>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#8a8d90' }}>
                                <p>No diagnoses recorded</p>
                            </div>
                        )}
                    </Stack>
                </Tile>
            </Column>

            {/* Test Results */}
            <Column sm={4} md={8} lg={16} className='m-3 rounded bg-white shadow'>
                <Tile  style={{borderRadius:"10px", backgroundColor:"white"}} >
                    <Stack gap={4}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Test Results</h4>
                            <Button 
                                kind="ghost" 
                                renderIcon={Add} 
                                onClick={handleAddTestResult}
                            >
                                Add Test Result
                            </Button>
                        </div>
                        {patient.results && patient.results.length > 0 ? (
                            patient.results.map((result) => (
                                <div key={result.id} style={{ 
                                    padding: '1rem', 
                                    border: '1px solid #e0e0e0', 
                                    borderRadius: '4px',
                                    marginBottom: '0.5rem'
                                }}>
                                    <Stack gap={2}>
                                        <div><strong>Test:</strong> {result.resultCode}</div>
                                        <div><strong>Description:</strong> {result.description}</div>
                                        <div><strong>Type:</strong> {result.resultType}</div>
                                        <div><strong>Method:</strong> {result.testMethod}</div>
                                        {result.notes && (
                                            <div><strong>Notes:</strong> {result.notes}</div>
                                        )}
                                        <div><strong>Date:</strong> {formatDateTime(result.createdAt)}</div>
                                    </Stack>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#8a8d90' }}>
                                <p>No test results available</p>
                            </div>
                        )}
                    </Stack>
                </Tile>
            </Column>
            <VitalsModal
                patient={patient}
                open={showVitalsModal}
                onClose={() => setShowVitalsModal(false)}
               
            />
            <BiometricsModal
                patient={patient}
                open={showBiometricsModal}
                onClose={() => setShowBiometricsModal(false)}
            />
            <ResultModal
                patient={patient}
                open={showResultModal}
                onClose={() => setShowResultModal(false)}
            />
            <AddressModal
                patient={patient}
                open={showAddressModal}
                onClose={() => setShowAddressModal(false)}
            />
                <DosageModal
                patient={patient}
                open={showDosageModal}
                onClose={() => setShowDosageModal(false)}
            />
            <DiagnosisModal
                patient={patient}
                open={showDiagnosisModal}
                onClose={() => setShowDiagnosisModal(false)}
            />
            <VisitModal
        patient={patient}
        open={showVisitModal}
        onClose={() => setShowVisitModal(false)}
      />
      <BedAssignmentModal
                patient={patient}
                open={showBedModal}
                onClose={() => setShowBedModal(false)}
            />


        </div>
    );
}

export default PatientDetails;