import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Button,
    TextInput,
    Form,
    FormGroup,
    Stack,
    Grid,
    Column,
    Modal,
    NumberInput,
    TextArea,
    InlineNotification,
    InlineLoading
} from '@carbon/react';
import { useState, useEffect } from 'react';
import { Add } from '@carbon/icons-react';

// Validation schema
const vitalsValidationSchema = Yup.object({
    temperature: Yup.number()
        .required('Temperature is required')
        .min(35, 'Temperature too low (min 35°C)')
        .max(42, 'Temperature too high (max 42°C)'),
    heartRate: Yup.number()
        .required('Heart rate is required')
        .min(40, 'Heart rate too low (min 40 bpm)')
        .max(200, 'Heart rate too high (max 200 bpm)')
        .integer('Must be a whole number'),
    bloodPressureSystolic: Yup.number()
        .required('Systolic BP is required')
        .min(70, 'Systolic BP too low (min 70 mmHg)')
        .max(200, 'Systolic BP too high (max 200 mmHg)')
        .integer('Must be a whole number'),
    bloodPressureDiastolic: Yup.number()
        .required('Diastolic BP is required')
        .min(40, 'Diastolic BP too low (min 40 mmHg)')
        .max(130, 'Diastolic BP too high (max 130 mmHg)')
        .integer('Must be a whole number'),
    respiratoryRate: Yup.number()
        .required('Respiratory rate is required')
        .min(8, 'Respiratory rate too low (min 8 breaths/min)')
        .max(40, 'Respiratory rate too high (max 40 breaths/min)')
        .integer('Must be a whole number'),
    oxygenSaturation: Yup.number()
        .required('Oxygen saturation is required')
        .min(70, 'Oxygen saturation too low (min 70%)')
        .max(100, 'Oxygen saturation cannot exceed 100%'),
    note: Yup.string()
        .max(500, 'Note must be less than 500 characters')
});

const VitalsModal = ({ patient, open, onClose, onVitalsAdded }) => {
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [existingVitals, setExistingVitals] = useState(null);

    // Check if patient already has vitals
    useEffect(() => {
        if (patient && open) {
            const checkExistingVitals = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/medic/vitals/patient/${patient.id}`);
                    if (response.ok) {
                        const vitals = await response.json();
                        setExistingVitals(vitals);
                    } else {
                        setExistingVitals(null);
                    }
                } catch (error) {
                    console.error('Error checking existing vitals:', error);
                    setExistingVitals(null);
                }
            };
            checkExistingVitals();
        }
    }, [patient, open]);

    const formik = useFormik({
        initialValues: {
            temperature: '',
            heartRate: '',
            bloodPressureSystolic: '',
            bloodPressureDiastolic: '',
            respiratoryRate: '',
            oxygenSaturation: '',
            note: ''
        },
        validationSchema: vitalsValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            setSubmitting(true);
            setShowSuccess(false);
            
            try {
                const url = existingVitals 
                    ? 'http://localhost:8080/medic/vitals'  // PUT for update
                    : 'http://localhost:8080/medic/vitals'; // POST for create

                const method = existingVitals ? 'PUT' : 'POST';
                
                const vitalsData = existingVitals 
                    ? { ...values, id: existingVitals.id, patient: { id: patient.id } }
                    : { ...values, patient: { id: patient.id } };

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(vitalsData)
                });

                if (response.ok) {
                    console.log('Vitals saved successfully');
                    setShowSuccess(true);
                    resetForm();
                    
                    // Callback to refresh parent component
                    if (onVitalsAdded) {
                        onVitalsAdded();
                    }
                    
                    // Close modal after success
                    setTimeout(() => {
                        onClose();
                        setShowSuccess(false);
                    }, 1500);
                } else {
                    console.error('Failed to save vitals');
                }
            } catch (error) {
                console.error('Error saving vitals:', error);
            } finally {
                setSubmitting(false);
            }
        },
        enableReinitialize: true
    });

    const handleClose = () => {
        formik.resetForm();
        setShowSuccess(false);
        setExistingVitals(null);
        onClose();
    };

    // Set form values if editing existing vitals
    useEffect(() => {
        if (existingVitals && open) {
            formik.setValues({
                temperature: existingVitals.temperature || '',
                heartRate: existingVitals.heartRate || '',
                bloodPressureSystolic: existingVitals.bloodPressureSystolic || '',
                bloodPressureDiastolic: existingVitals.bloodPressureDiastolic || '',
                respiratoryRate: existingVitals.respiratoryRate || '',
                oxygenSaturation: existingVitals.oxygenSaturation || '',
                note: existingVitals.note || ''
            });
        }
    }, [existingVitals, open]);

    if (!patient) return null;

    return (
        <Modal
            open={open}
            modalHeading={existingVitals ? "Update Patient Vitals" : "Record Patient Vitals"}
            modalLabel="Medical Vitals"
            primaryButtonText={submitting ? "Saving..." : (existingVitals ? "Update Vitals" : "Record Vitals")}
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
                    subtitle="Vitals recorded successfully!"
                    lowContrast
                    style={{ marginBottom: '1rem' }}
                />
            )}

            <Form onSubmit={formik.handleSubmit}>
                <Stack gap={6}>
                    {/* Patient Info */}
                    <FormGroup legendText="Patient Information">
                        <Grid narrow>
                            <Column sm={2} md={4} lg={8}>
                                <strong>Patient:</strong> {patient.firstName} {patient.lastName}
                            </Column>
                            <Column sm={2} md={4} lg={8}>
                                <strong>Patient ID:</strong> {patient.id}
                            </Column>
                        </Grid>
                        {existingVitals && (
                            <p style={{ color: '#da1e28', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                ⚠️ Updating existing vitals record
                            </p>
                        )}
                    </FormGroup>

                    {/* Vital Signs */}
                    <FormGroup legendText="Vital Signs">
                        <Grid narrow>
                            {/* Temperature */}
                            <Column sm={2} md={4} lg={4}>
                                <NumberInput
                                    id="temperature"
                                    name="temperature"
                                    label="Temperature (°C) *"
                                    min={35}
                                    max={42}
                                    step={0.1}
                                    value={formik.values.temperature}
                                    onChange={(event, { value }) => {
                                        formik.setFieldValue('temperature', value);
                                    }}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.temperature && Boolean(formik.errors.temperature)}
                                    invalidText={formik.errors.temperature}
                                    disabled={submitting}
                                />
                            </Column>

                            {/* Heart Rate */}
                            <Column sm={2} md={4} lg={4}>
                                <NumberInput
                                    id="heartRate"
                                    name="heartRate"
                                    label="Heart Rate (BPM) *"
                                    min={40}
                                    max={200}
                                    value={formik.values.heartRate}
                                    onChange={(event, { value }) => {
                                        formik.setFieldValue('heartRate', value);
                                    }}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.heartRate && Boolean(formik.errors.heartRate)}
                                    invalidText={formik.errors.heartRate}
                                    disabled={submitting}
                                />
                            </Column>

                            {/* Respiratory Rate */}
                            <Column sm={2} md={4} lg={4}>
                                <NumberInput
                                    id="respiratoryRate"
                                    name="respiratoryRate"
                                    label="Respiratory Rate *"
                                    min={8}
                                    max={40}
                                    value={formik.values.respiratoryRate}
                                    onChange={(event, { value }) => {
                                        formik.setFieldValue('respiratoryRate', value);
                                    }}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.respiratoryRate && Boolean(formik.errors.respiratoryRate)}
                                    invalidText={formik.errors.respiratoryRate}
                                    disabled={submitting}
                                />
                            </Column>

                            {/* Oxygen Saturation */}
                            <Column sm={2} md={4} lg={4}>
                                <NumberInput
                                    id="oxygenSaturation"
                                    name="oxygenSaturation"
                                    label="O₂ Saturation (%) *"
                                    min={70}
                                    max={100}
                                    step={0.1}
                                    value={formik.values.oxygenSaturation}
                                    onChange={(event, { value }) => {
                                        formik.setFieldValue('oxygenSaturation', value);
                                    }}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.oxygenSaturation && Boolean(formik.errors.oxygenSaturation)}
                                    invalidText={formik.errors.oxygenSaturation}
                                    disabled={submitting}
                                />
                            </Column>
                        </Grid>

                        {/* Blood Pressure */}
                        <Grid narrow>
                            <Column sm={2} md={4} lg={8}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
                                    <NumberInput
                                        id="bloodPressureSystolic"
                                        name="bloodPressureSystolic"
                                        label="Blood Pressure (Systolic) *"
                                        min={70}
                                        max={200}
                                        value={formik.values.bloodPressureSystolic}
                                        onChange={(event, { value }) => {
                                            formik.setFieldValue('bloodPressureSystolic', value);
                                        }}
                                        onBlur={formik.handleBlur}
                                        invalid={formik.touched.bloodPressureSystolic && Boolean(formik.errors.bloodPressureSystolic)}
                                        invalidText={formik.errors.bloodPressureSystolic}
                                        disabled={submitting}
                                    />
                                    <div style={{ 
                                        paddingBottom: '0.5rem', 
                                        fontSize: '1.25rem',
                                        fontWeight: 'bold'
                                    }}>
                                        /
                                    </div>
                                    <NumberInput
                                        id="bloodPressureDiastolic"
                                        name="bloodPressureDiastolic"
                                        label="Diastolic *"
                                        min={40}
                                        max={130}
                                        value={formik.values.bloodPressureDiastolic}
                                        onChange={(event, { value }) => {
                                            formik.setFieldValue('bloodPressureDiastolic', value);
                                        }}
                                        onBlur={formik.handleBlur}
                                        invalid={formik.touched.bloodPressureDiastolic && Boolean(formik.errors.bloodPressureDiastolic)}
                                        invalidText={formik.errors.bloodPressureDiastolic}
                                        disabled={submitting}
                                    />
                                </div>
                            </Column>
                        </Grid>
                    </FormGroup>

                    {/* Notes */}
                    <FormGroup legendText="Clinical Notes">
                        <TextArea
                            id="note"
                            name="note"
                            labelText="Notes"
                            placeholder="Enter any additional observations or comments..."
                            value={formik.values.note}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={formik.touched.note && Boolean(formik.errors.note)}
                            invalidText={formik.errors.note}
                            disabled={submitting}
                            rows={3}
                        />
                    </FormGroup>

                    {/* Normal Ranges Reference */}
                    <FormGroup legendText="Normal Ranges Reference">
                        <Grid narrow>
                            <Column sm={2} md={4} lg={4}>
                                <div style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
                                    <strong>Temperature:</strong> 36.1°C - 37.2°C
                                </div>
                            </Column>
                            <Column sm={2} md={4} lg={4}>
                                <div style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
                                    <strong>Heart Rate:</strong> 60 - 100 BPM
                                </div>
                            </Column>
                            <Column sm={2} md={4} lg={4}>
                                <div style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
                                    <strong>BP:</strong> 120/80 mmHg
                                </div>
                            </Column>
                            <Column sm={2} md={4} lg={4}>
                                <div style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
                                    <strong>O₂ Sat:</strong> 95% - 100%
                                </div>
                            </Column>
                        </Grid>
                    </FormGroup>
                </Stack>
            </Form>
        </Modal>
    );
};

export default VitalsModal;