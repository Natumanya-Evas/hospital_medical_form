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
    InlineNotification,
    InlineLoading
} from '@carbon/react';
import { useState, useEffect } from 'react';
import { Location } from '@carbon/icons-react';

// Validation schema
const addressValidationSchema = Yup.object({
    street: Yup.string()
        .required('Street address is required')
        .min(5, 'Street address must be at least 5 characters')
        .max(100, 'Street address must be less than 100 characters'),
    city: Yup.string()
        .required('City is required')
        .min(2, 'City must be at least 2 characters')
        .max(50, 'City must be less than 50 characters'),
    state: Yup.string()
        .required('State is required')
        .min(2, 'State must be 2 characters')
        .max(2, 'State must be 2 characters'),
    zipCode: Yup.string()
        .required('ZIP code is required')
        .matches(/^\d{5}(-\d{4})?$/, 'ZIP code must be in format 12345 or 12345-6789')
});

const AddressModal = ({ patient, open, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [existingAddress, setExistingAddress] = useState(null);

    // Check if patient already has an address
    useEffect(() => {
        if (patient && open) {
            const checkExistingAddress = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/medic/api/addresses/${patient.id}`);
                    if (response.ok) {
                        const address = await response.json();
                        setExistingAddress(address);
                    } else {
                        setExistingAddress(null);
                    }
                } catch (error) {
                    console.error('Error checking existing address:', error);
                    setExistingAddress(null);
                }
            };
            checkExistingAddress();
        }
    }, [patient, open]);

    const formik = useFormik({
        initialValues: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
        },
        validationSchema: addressValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            setSubmitting(true);
            setShowSuccess(false);
            
            try {
                const url = 'http://localhost:8080/medic/api/addresses';
                const method = existingAddress ? 'PUT' : 'POST';
                
                const addressData = existingAddress 
                    ? { ...values, id: existingAddress.id, patient: { id: patient.id } }
                    : { ...values, patient: { id: patient.id } };

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(addressData)
                });

                if (response.ok) {
                    console.log('Address saved successfully');
                    setShowSuccess(true);
                    resetForm();
                    
                    // Close modal after success
                    setTimeout(() => {
                        onClose();
                        setShowSuccess(false);
                    }, 1500);
                } else {
                    console.error('Failed to save address');
                }
            } catch (error) {
                console.error('Error saving address:', error);
            } finally {
                setSubmitting(false);
            }
        },
        enableReinitialize: true
    });

    const handleClose = () => {
        formik.resetForm();
        setShowSuccess(false);
        setExistingAddress(null);
        onClose();
    };

    // Set form values if editing existing address
    useEffect(() => {
        if (existingAddress && open) {
            formik.setValues({
                street: existingAddress.street || '',
                city: existingAddress.city || '',
                state: existingAddress.state || '',
                zipCode: existingAddress.zipCode || ''
            });
        }
    }, [existingAddress, open]);

    if (!patient) return null;

    return (
        <Modal
            open={open}
            modalHeading={existingAddress ? "Update Patient Address" : "Add Patient Address"}
            modalLabel="Address Information"
            primaryButtonText={submitting ? "Saving..." : (existingAddress ? "Update Address" : "Add Address")}
            secondaryButtonText="Cancel"
            onRequestSubmit={formik.handleSubmit}
            onRequestClose={handleClose}
            primaryButtonDisabled={submitting || !formik.isValid}
            size="md"
        >
            {showSuccess && (
                <InlineNotification
                    kind="success"
                    title="Success"
                    subtitle="Address saved successfully!"
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
                        {existingAddress && (
                            <p style={{ color: '#da1e28', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                ⚠️ Updating existing address record
                            </p>
                        )}
                    </FormGroup>

                    {/* Address Information */}
                    <FormGroup legendText="Address Details">
                        {/* Street Address */}
                        <Grid narrow>
                            <Column sm={4} md={8} lg={16}>
                                <TextInput
                                    id="street"
                                    name="street"
                                    labelText="Street Address *"
                                    placeholder="e.g., 123 Main Street"
                                    value={formik.values.street}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.street && Boolean(formik.errors.street)}
                                    invalidText={formik.errors.street}
                                    disabled={submitting}
                                />
                            </Column>
                        </Grid>

                        {/* City, State, ZIP */}
                        <Grid narrow>
                            <Column sm={2} md={4} lg={8}>
                                <TextInput
                                    id="city"
                                    name="city"
                                    labelText="City *"
                                    placeholder="e.g., New York"
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.city && Boolean(formik.errors.city)}
                                    invalidText={formik.errors.city}
                                    disabled={submitting}
                                />
                            </Column>
                            <Column sm={1} md={2} lg={4}>
                                <TextInput
                                    id="state"
                                    name="state"
                                    labelText="State *"
                                    placeholder="e.g., NY"
                                    value={formik.values.state}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.state && Boolean(formik.errors.state)}
                                    invalidText={formik.errors.state}
                                    disabled={submitting}
                                    maxLength={2}
                                    style={{ textTransform: 'uppercase' }}
                                />
                            </Column>
                            <Column sm={1} md={2} lg={4}>
                                <TextInput
                                    id="zipCode"
                                    name="zipCode"
                                    labelText="ZIP Code *"
                                    placeholder="e.g., 10001"
                                    value={formik.values.zipCode}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                                    invalidText={formik.errors.zipCode}
                                    disabled={submitting}
                                />
                            </Column>
                        </Grid>
                    </FormGroup>

                    {/* Address Preview */}
                    {(formik.values.street || formik.values.city || formik.values.state || formik.values.zipCode) && (
                        <FormGroup legendText="Address Preview">
                            <div style={{ 
                                padding: '1rem', 
                                backgroundColor: '#f4f4f4', 
                                borderRadius: '4px',
                                border: '1px solid #e0e0e0'
                            }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                    {formik.values.street || 'Street Address'}
                                </div>
                                <div>
                                    {[
                                        formik.values.city,
                                        formik.values.state,
                                        formik.values.zipCode
                                    ].filter(Boolean).join(', ')}
                                </div>
                            </div>
                        </FormGroup>
                    )}
                </Stack>
            </Form>
        </Modal>
    );
};

export default AddressModal;