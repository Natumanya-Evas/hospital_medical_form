import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Button,
    TextInput,
    TextArea,
    Form,
    FormGroup,
    Stack,
    Grid,
    Column,
    Modal,
    InlineNotification,
    InlineLoading,
    ComboBox
} from '@carbon/react';
import { useState, useEffect } from 'react';
import { Document } from '@carbon/icons-react';

// Validation schema
const diagnosisValidationSchema = Yup.object({
    diagnosed: Yup.string()
        .required('Diagnosis is required')
        .min(2, 'Diagnosis must be at least 2 characters')
        .max(200, 'Diagnosis must be less than 200 characters'),
    symptoms: Yup.string()
        .max(1000, 'Symptoms must be less than 1000 characters'),
    signs: Yup.string()
        .max(1000, 'Signs must be less than 1000 characters'),
    treatment: Yup.string()
        .max(1000, 'Treatment must be less than 1000 characters')
});

const DiagnosisModal = ({ patient, open, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [existingDiagnosis, setExistingDiagnosis] = useState(null);

    // Common diagnoses for quick selection
    const commonDiagnoses = [
        { id: 'hypertension', text: 'Hypertension' },
        { id: 'diabetes', text: 'Type 2 Diabetes' },
        { id: 'asthma', text: 'Asthma' },
        { id: 'copd', text: 'COPD' },
        { id: 'arthritis', text: 'Osteoarthritis' },
        { id: 'depression', text: 'Major Depressive Disorder' },
        { id: 'anxiety', text: 'Generalized Anxiety Disorder' },
        { id: 'hyperlipidemia', text: 'Hyperlipidemia' },
        { id: 'heart_failure', text: 'Congestive Heart Failure' },
        { id: 'mi', text: 'Myocardial Infarction' }
    ];

    const formik = useFormik({
        initialValues: {
            diagnosed: '',
            symptoms: '',
            signs: '',
            treatment: ''
        },
        validationSchema: diagnosisValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            setSubmitting(true);
            setShowSuccess(false);
            
            try {
                const url = 'http://localhost:8080/medic/diagnoses';
                const method = existingDiagnosis ? 'PUT' : 'POST';
                
                const diagnosisData = existingDiagnosis 
                    ? { ...values, id: existingDiagnosis.id, patient: patient ? { id: patient.id } : null }
                    : { ...values, patient: patient ? { id: patient.id } : null };

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(diagnosisData)
                });

                if (response.ok) {
                    console.log('Diagnosis saved successfully');
                    setShowSuccess(true);
                    resetForm();
                    
                    // Close modal after success
                    setTimeout(() => {
                        onClose();
                        setShowSuccess(false);
                    }, 1500);
                } else {
                    console.error('Failed to save diagnosis');
                }
            } catch (error) {
                console.error('Error saving diagnosis:', error);
            } finally {
                setSubmitting(false);
            }
        },
        enableReinitialize: true
    });

    const handleClose = () => {
        formik.resetForm();
        setShowSuccess(false);
        setExistingDiagnosis(null);
        onClose();
    };

    if (!open) return null;

    return (
        <Modal
            open={open}
            modalHeading={existingDiagnosis ? "Update Diagnosis" : "Add New Diagnosis"}
            modalLabel="Medical Diagnosis"
            primaryButtonText={submitting ? "Saving..." : (existingDiagnosis ? "Update Diagnosis" : "Add Diagnosis")}
            secondaryButtonText="Cancel"
            onRequestSubmit={formik.handleSubmit}
            onRequestClose={handleClose}
            primaryButtonDisabled={submitting || !formik.isValid}
            size="lg"
        >
            {showSuccess && (
                <InlineNotification
                    kind="success"
                    title="Success"
                    subtitle="Diagnosis saved successfully!"
                    lowContrast
                    style={{ marginBottom: '1rem' }}
                />
            )}

            <Form onSubmit={formik.handleSubmit}>
                <Stack gap={6}>
                    {/* Patient Info (if provided) */}
                    {patient && (
                        <FormGroup legendText="Patient Information">
                            <Grid narrow>
                                <Column sm={2} md={4} lg={8}>
                                    <strong>Patient:</strong> {patient.firstName} {patient.lastName}
                                </Column>
                                <Column sm={2} md={4} lg={8}>
                                    <strong>Patient ID:</strong> {patient.id}
                                </Column>
                            </Grid>
                        </FormGroup>
                    )}

                    {/* Diagnosis Information */}
                    <FormGroup legendText="Diagnosis Details">
                        {/* Diagnosis */}
                        <Grid narrow>
                            <Column sm={4} md={8} lg={16}>
                                <ComboBox
                                    id="diagnosed"
                                    name="diagnosed"
                                    titleText="Diagnosis *"
                                    items={commonDiagnoses}
                                    itemToString={(item) => item ? item.text : ''}
                                    placeholder="Select or type a diagnosis..."
                                    onChange={({ selectedItem }) => {
                                        formik.setFieldValue('diagnosed', selectedItem ? selectedItem.text : '');
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.diagnosed}
                                    invalid={formik.touched.diagnosed && Boolean(formik.errors.diagnosed)}
                                    invalidText={formik.errors.diagnosed}
                                    disabled={submitting}
                                />
                            </Column>
                        </Grid>

                        {/* Symptoms */}
                        <Grid narrow>
                            <Column sm={4} md={8} lg={16}>
                                <TextArea
                                    id="symptoms"
                                    name="symptoms"
                                    labelText="Symptoms"
                                    placeholder="Describe patient-reported symptoms (e.g., headaches, fatigue, pain...)"
                                    value={formik.values.symptoms}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.symptoms && Boolean(formik.errors.symptoms)}
                                    invalidText={formik.errors.symptoms}
                                    disabled={submitting}
                                    rows={3}
                                />
                            </Column>
                        </Grid>

                        {/* Signs */}
                        <Grid narrow>
                            <Column sm={4} md={8} lg={16}>
                                <TextArea
                                    id="signs"
                                    name="signs"
                                    labelText="Clinical Signs"
                                    placeholder="Describe objective clinical findings (e.g., elevated BP, rash, abnormal labs...)"
                                    value={formik.values.signs}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.signs && Boolean(formik.errors.signs)}
                                    invalidText={formik.errors.signs}
                                    disabled={submitting}
                                    rows={3}
                                />
                            </Column>
                        </Grid>

                        {/* Treatment */}
                        <Grid narrow>
                            <Column sm={4} md={8} lg={16}>
                                <TextArea
                                    id="treatment"
                                    name="treatment"
                                    labelText="Treatment Plan"
                                    placeholder="Describe prescribed treatment, medications, therapy, or recommendations..."
                                    value={formik.values.treatment}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.treatment && Boolean(formik.errors.treatment)}
                                    invalidText={formik.errors.treatment}
                                    disabled={submitting}
                                    rows={3}
                                />
                            </Column>
                        </Grid>
                    </FormGroup>

                    {/* Character Counts */}
                    <FormGroup legendText="Character Counts">
                        <Grid narrow>
                            <Column sm={2} md={4} lg={4}>
                                <div style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
                                    Symptoms: {formik.values.symptoms.length}/1000
                                </div>
                            </Column>
                            <Column sm={2} md={4} lg={4}>
                                <div style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
                                    Signs: {formik.values.signs.length}/1000
                                </div>
                            </Column>
                            <Column sm={2} md={4} lg={4}>
                                <div style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
                                    Treatment: {formik.values.treatment.length}/1000
                                </div>
                            </Column>
                        </Grid>
                    </FormGroup>
                </Stack>
            </Form>
        </Modal>
    );
};

export default DiagnosisModal;