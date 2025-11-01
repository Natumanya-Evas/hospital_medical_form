import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Button,
    Form,
    FormGroup,
    Stack,
    Grid,
    Column,
    Modal,
    NumberInput,
    InlineNotification,
    InlineLoading
} from '@carbon/react';
import { useState, useEffect } from 'react';

// Validation schema
const biometricsValidationSchema = Yup.object({
    mass: Yup.number()
        .required('Weight is required')
        .min(20, 'Weight too low (min 20 kg)')
        .max(300, 'Weight too high (max 300 kg)'),
    height: Yup.number()
        .required('Height is required')
        .min(100, 'Height too low (min 100 cm)')
        .max(250, 'Height too high (max 250 cm)'),
    waistCircumference: Yup.number()
        .required('Waist circumference is required')
        .min(50, 'Waist circumference too low (min 50 cm)')
        .max(200, 'Waist circumference too high (max 200 cm)'),
    bmi: Yup.number()
        .required('BMI is required')
        .min(10, 'BMI too low (min 10)')
        .max(60, 'BMI too high (max 60)')
});

const BiometricsModal = ({ patient, open, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [existingBiometrics, setExistingBiometrics] = useState(null);

    // Check if patient already has biometrics
    useEffect(() => {
        if (patient && open) {
            const checkExistingBiometrics = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/medic/api/patient/${patient.id}`);
                    if (response.ok) {
                        const biometrics = await response.json();
                        setExistingBiometrics(biometrics);
                    } else {
                        setExistingBiometrics(null);
                    }
                } catch (error) {
                    console.error('Error checking existing biometrics:', error);
                    setExistingBiometrics(null);
                }
            };
            checkExistingBiometrics();
        }
    }, [patient, open]);

    const formik = useFormik({
        initialValues: {
            mass: '',
            height: '',
            waistCircumference: '',
            bmi: ''
        },
        validationSchema: biometricsValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            setSubmitting(true);
            setShowSuccess(false);
            
            try {
                const url = 'http://localhost:8080/medic/biometrics';
                const method = existingBiometrics ? 'PUT' : 'POST';
                
                const biometricsData = existingBiometrics 
                    ? { ...values, id: existingBiometrics.id, patient: { id: patient.id } }
                    : { ...values, patient: { id: patient.id } };

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(biometricsData)
                });

                if (response.ok) {
                    console.log('Biometrics saved successfully');
                    setShowSuccess(true);
                    resetForm();
                    
                    // Close modal after success
                    setTimeout(() => {
                        onClose();
                        setShowSuccess(false);
                    }, 1500);
                } else {
                    console.error('Failed to save biometrics');
                }
            } catch (error) {
                console.error('Error saving biometrics:', error);
            } finally {
                setSubmitting(false);
            }
        },
        enableReinitialize: true
    });

    // Auto-calculate BMI when mass or height changes
    useEffect(() => {
        if (formik.values.mass && formik.values.height) {
            const mass = parseFloat(formik.values.mass);
            const height = parseFloat(formik.values.height) / 100; // Convert cm to meters
            if (mass > 0 && height > 0) {
                const calculatedBmi = mass / (height * height);
                formik.setFieldValue('bmi', calculatedBmi.toFixed(1));
            }
        }
    }, [formik.values.mass, formik.values.height]);

    const handleClose = () => {
        formik.resetForm();
        setShowSuccess(false);
        setExistingBiometrics(null);
        onClose();
    };

    // Set form values if editing existing biometrics
    useEffect(() => {
        if (existingBiometrics && open) {
            formik.setValues({
                mass: existingBiometrics.mass || '',
                height: existingBiometrics.height || '',
                waistCircumference: existingBiometrics.waistCircumference || '',
                bmi: existingBiometrics.bmi || ''
            });
        }
    }, [existingBiometrics, open]);

    if (!patient) return null;

    return (
        <Modal
            open={open}
            modalHeading={existingBiometrics ? "Update Patient Biometrics" : "Record Patient Biometrics"}
            modalLabel="Body Measurements"
            primaryButtonText={submitting ? "Saving..." : (existingBiometrics ? "Update Biometrics" : "Record Biometrics")}
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
                    subtitle="Biometrics recorded successfully!"
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
                        {existingBiometrics && (
                            <p style={{ color: '#da1e28', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                ⚠️ Updating existing biometrics record
                            </p>
                        )}
                    </FormGroup>

                    {/* Body Measurements */}
                    <FormGroup legendText="Body Measurements">
                        <Grid narrow>
                            {/* Weight */}
                            <Column sm={2} md={4} lg={4}>
                                <NumberInput
                                    id="mass"
                                    name="mass"
                                    label="Weight (kg) *"
                                    min={20}
                                    max={300}
                                    step={0.1}
                                    value={formik.values.mass}
                                    onChange={(event, { value }) => {
                                        formik.setFieldValue('mass', value);
                                    }}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.mass && Boolean(formik.errors.mass)}
                                    invalidText={formik.errors.mass}
                                    disabled={submitting}
                                />
                            </Column>

                            {/* Height */}
                            <Column sm={2} md={4} lg={4}>
                                <NumberInput
                                    id="height"
                                    name="height"
                                    label="Height (cm) *"
                                    min={100}
                                    max={250}
                                    step={0.1}
                                    value={formik.values.height}
                                    onChange={(event, { value }) => {
                                        formik.setFieldValue('height', value);
                                    }}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.height && Boolean(formik.errors.height)}
                                    invalidText={formik.errors.height}
                                    disabled={submitting}
                                />
                            </Column>

                            {/* Waist Circumference */}
                            <Column sm={2} md={4} lg={4}>
                                <NumberInput
                                    id="waistCircumference"
                                    name="waistCircumference"
                                    label="Waist Circumference (cm) *"
                                    min={50}
                                    max={200}
                                    step={0.1}
                                    value={formik.values.waistCircumference}
                                    onChange={(event, { value }) => {
                                        formik.setFieldValue('waistCircumference', value);
                                    }}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.waistCircumference && Boolean(formik.errors.waistCircumference)}
                                    invalidText={formik.errors.waistCircumference}
                                    disabled={submitting}
                                />
                            </Column>

                            {/* BMI (Auto-calculated) */}
                            <Column sm={2} md={4} lg={4}>
                                <NumberInput
                                    id="bmi"
                                    name="bmi"
                                    label="BMI *"
                                    min={10}
                                    max={60}
                                    step={0.1}
                                    value={formik.values.bmi}
                                    onChange={(event, { value }) => {
                                        formik.setFieldValue('bmi', value);
                                    }}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.bmi && Boolean(formik.errors.bmi)}
                                    invalidText={formik.errors.bmi}
                                    disabled={submitting}
                                    readOnly={formik.values.mass && formik.values.height}
                                />
                                {formik.values.mass && formik.values.height && (
                                    <p style={{ fontSize: '0.75rem', color: '#6f6f6f', marginTop: '0.25rem' }}>
                                        Auto-calculated
                                    </p>
                                )}
                            </Column>
                        </Grid>
                    </FormGroup>

                    {/* BMI Classification */}
                    {formik.values.bmi && (
                        <FormGroup legendText="BMI Classification">
                            <Grid narrow>
                                <Column sm={4} md={8} lg={16}>
                                    <div style={{ 
                                        padding: '1rem', 
                                        backgroundColor: '#f4f4f4', 
                                        borderRadius: '4px',
                                        textAlign: 'center'
                                    }}>
                                        <strong>BMI: {formik.values.bmi}</strong>
                                        <div style={{ marginTop: '0.5rem' }}>
                                            {formik.values.bmi < 18.5 && (
                                                <span style={{ color: '#da1e28', fontWeight: 'bold' }}>Underweight</span>
                                            )}
                                            {formik.values.bmi >= 18.5 && formik.values.bmi < 25 && (
                                                <span style={{ color: '#24a148', fontWeight: 'bold' }}>Normal weight</span>
                                            )}
                                            {formik.values.bmi >= 25 && formik.values.bmi < 30 && (
                                                <span style={{ color: '#f1c21b', fontWeight: 'bold' }}>Overweight</span>
                                            )}
                                            {formik.values.bmi >= 30 && (
                                                <span style={{ color: '#da1e28', fontWeight: 'bold' }}>Obese</span>
                                            )}
                                        </div>
                                    </div>
                                </Column>
                            </Grid>
                        </FormGroup>
                    )}

                    {/* Reference Ranges */}
                    <FormGroup legendText="Reference Ranges">
                        <Grid narrow>
                            <Column sm={2} md={4} lg={4}>
                                <div style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
                                    <strong>BMI Categories:</strong><br/>
                                    Underweight: &lt;18.5<br/>
                                    Normal: 18.5-24.9<br/>
                                    Overweight: 25-29.9<br/>
                                    Obese: ≥30
                                </div>
                            </Column>
                            <Column sm={2} md={4} lg={4}>
                                <div style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
                                    <strong>Waist Circumference Risk:</strong><br/>
                                    Men: &lt;94cm (low)<br/>
                                    Women: &lt;80cm (low)
                                </div>
                            </Column>
                        </Grid>
                    </FormGroup>
                </Stack>
            </Form>
        </Modal>
    );
};

export default BiometricsModal;