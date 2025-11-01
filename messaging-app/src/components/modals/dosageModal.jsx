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
import { Medication } from '@carbon/icons-react';

// Validation schema
const dosageValidationSchema = Yup.object({
    drugName: Yup.string()
        .required('Drug name is required')
        .min(2, 'Drug name must be at least 2 characters')
        .max(100, 'Drug name must be less than 100 characters'),
    amount: Yup.string()
        .required('Amount is required')
        .max(50, 'Amount must be less than 50 characters'),
    prescription: Yup.string()
        .required('Prescription is required')
        .max(500, 'Prescription must be less than 500 characters'),
    caution: Yup.string()
        .max(200, 'Caution must be less than 200 characters'),
    note: Yup.string()
        .max(200, 'Note must be less than 200 characters')
});

const DosageModal = ({ patient, open, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [medicinePrices, setMedicinePrices] = useState([]);
    const [dispensers, setDispensers] = useState([]);
    const [loadingPrices, setLoadingPrices] = useState(false);
    const [loadingDispensers, setLoadingDispensers] = useState(false);

    // Fetch medicine prices and dispensers
    useEffect(() => {
        if (open) {
            fetchMedicinePrices();
            fetchDispensers();
        }
    }, [open]);

    const fetchMedicinePrices = async () => {
        setLoadingPrices(true);
        try {
            const response = await fetch('http://localhost:8080/medic/api/medicine-prices');
            if (response.ok) {
                const data = await response.json();
                setMedicinePrices(data);
            }
        } catch (error) {
            console.error('Error fetching medicine prices:', error);
        } finally {
            setLoadingPrices(false);
        }
    };

    const fetchDispensers = async () => {
        setLoadingDispensers(true);
        try {
            const response = await fetch('http://localhost:8080/medic/api/dispensers');
            if (response.ok) {
                const data = await response.json();
                setDispensers(data);
            }
        } catch (error) {
            console.error('Error fetching dispensers:', error);
        } finally {
            setLoadingDispensers(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            drugName: '',
            amount: '',
            prescription: '',
            caution: '',
            note: '',
            medicinePrice: null,
            dispenser: null
        },
        validationSchema: dosageValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            setSubmitting(true);
            setShowSuccess(false);
            
            try {
                const dosageData = {
                    drugName: values.drugName,
                    amount: values.amount,
                    prescription: values.prescription,
                    caution: values.caution,
                    note: values.note,
                    medicinePrice: values.medicinePrice ? { id: values.medicinePrice.id } : null,
                    dispenser: values.dispenser ? { id: values.dispenser.id } : null,
                    patient: patient ? { id: patient.id } : null
                };

                const response = await fetch('http://localhost:8080/medic/api/dosages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dosageData)
                });

                if (response.ok) {
                    console.log('Dosage created successfully');
                    setShowSuccess(true);
                    resetForm();
                    
                    // Close modal after success
                    setTimeout(() => {
                        onClose();
                        setShowSuccess(false);
                    }, 1500);
                } else {
                    console.error('Failed to create dosage');
                }
            } catch (error) {
                console.error('Error creating dosage:', error);
            } finally {
                setSubmitting(false);
            }
        }
    });

    const handleClose = () => {
        formik.resetForm();
        setShowSuccess(false);
        onClose();
    };

    // Prepare items for ComboBoxes
    const medicinePriceItems = medicinePrices.map(price => ({
        id: price.id,
        text: `${price.quantity} ${price.unitMeasure} - $${price.price}`,
        ...price
    }));

    const dispenserItems = dispensers.map(dispenser => ({
        id: dispenser.id,
        text: `${dispenser.workName} - ${dispenser.location}`,
        ...dispenser
    }));

    if (!open) return null;

    return (
        <Modal
            open={open}
            modalHeading={patient ? `Add Medication for ${patient.firstName} ${patient.lastName}` : "Add New Medication"}
            modalLabel="Medication Dosage"
            primaryButtonText={submitting ? "Adding Medication..." : "Add Medication"}
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
                    subtitle="Medication dosage added successfully!"
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

                    {/* Medication Details */}
                    <FormGroup legendText="Medication Information">
                        {/* Drug Name and Amount */}
                        <Grid narrow>
                            <Column sm={2} md={4} lg={8}>
                                <TextInput
                                    id="drugName"
                                    name="drugName"
                                    labelText="Drug Name *"
                                    placeholder="e.g., Amoxicillin, Ibuprofen"
                                    value={formik.values.drugName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.drugName && Boolean(formik.errors.drugName)}
                                    invalidText={formik.errors.drugName}
                                    disabled={submitting}
                                />
                            </Column>
                            <Column sm={2} md={4} lg={8}>
                                <TextInput
                                    id="amount"
                                    name="amount"
                                    labelText="Amount/Dosage *"
                                    placeholder="e.g., 500mg, 10ml, 2 tablets"
                                    value={formik.values.amount}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.amount && Boolean(formik.errors.amount)}
                                    invalidText={formik.errors.amount}
                                    disabled={submitting}
                                />
                            </Column>
                        </Grid>

                        {/* Medicine Price and Dispenser */}
                        <Grid narrow>
                            <Column sm={2} md={4} lg={8}>
                                <ComboBox
                                    id="medicinePrice"
                                    name="medicinePrice"
                                    titleText="Medicine Price (Optional)"
                                    items={medicinePriceItems}
                                    itemToString={(item) => item ? item.text : ''}
                                    placeholder="Select medicine price..."
                                    onChange={({ selectedItem }) => {
                                        formik.setFieldValue('medicinePrice', selectedItem || null);
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.medicinePrice ? formik.values.medicinePrice.text : ''}
                                    disabled={submitting || loadingPrices}
                                />
                                {loadingPrices && <InlineLoading description="Loading prices..." />}
                            </Column>
                            <Column sm={2} md={4} lg={8}>
                                <ComboBox
                                    id="dispenser"
                                    name="dispenser"
                                    titleText="Dispenser *"
                                    items={dispenserItems}
                                    itemToString={(item) => item ? item.text : ''}
                                    placeholder="Select dispenser..."
                                    onChange={({ selectedItem }) => {
                                        formik.setFieldValue('dispenser', selectedItem || null);
                                    }}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.dispenser ? formik.values.dispenser.text : ''}
                                    invalid={formik.touched.dispenser && !formik.values.dispenser}
                                    invalidText="Dispenser is required"
                                    disabled={submitting || loadingDispensers}
                                />
                                {loadingDispensers && <InlineLoading description="Loading dispensers..." />}
                            </Column>
                        </Grid>

                        {/* Prescription */}
                        <Grid narrow>
                            <Column sm={4} md={8} lg={16}>
                                <TextArea
                                    id="prescription"
                                    name="prescription"
                                    labelText="Prescription Instructions *"
                                    placeholder="e.g., Take one tablet three times daily after meals for 7 days..."
                                    value={formik.values.prescription}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.prescription && Boolean(formik.errors.prescription)}
                                    invalidText={formik.errors.prescription}
                                    disabled={submitting}
                                    rows={3}
                                />
                            </Column>
                        </Grid>

                        {/* Caution and Note */}
                        <Grid narrow>
                            <Column sm={2} md={4} lg={8}>
                                <TextInput
                                    id="caution"
                                    name="caution"
                                    labelText="Caution/Warning"
                                    placeholder="e.g., Take with food, Avoid alcohol..."
                                    value={formik.values.caution}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.caution && Boolean(formik.errors.caution)}
                                    invalidText={formik.errors.caution}
                                    disabled={submitting}
                                />
                            </Column>
                            <Column sm={2} md={4} lg={8}>
                                <TextInput
                                    id="note"
                                    name="note"
                                    labelText="Additional Notes"
                                    placeholder="e.g., Refrigerate, Shake well before use..."
                                    value={formik.values.note}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={formik.touched.note && Boolean(formik.errors.note)}
                                    invalidText={formik.errors.note}
                                    disabled={submitting}
                                />
                            </Column>
                        </Grid>
                    </FormGroup>

                    {/* Character Counts */}
                    <FormGroup legendText="Character Counts">
                        <Grid narrow>
                            <Column sm={2} md={4} lg={4}>
                                <div style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
                                    Prescription: {formik.values.prescription.length}/500
                                </div>
                            </Column>
                            <Column sm={2} md={4} lg={4}>
                                <div style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
                                    Caution: {formik.values.caution.length}/200
                                </div>
                            </Column>
                            <Column sm={2} md={4} lg={4}>
                                <div style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
                                    Notes: {formik.values.note.length}/200
                                </div>
                            </Column>
                        </Grid>
                    </FormGroup>

                    {/* Selected Items Preview */}
                    {(formik.values.medicinePrice || formik.values.dispenser) && (
                        <FormGroup legendText="Selected Items">
                            <Grid narrow>
                                <Column sm={4} md={8} lg={16}>
                                    <div style={{ 
                                        padding: '1rem', 
                                        backgroundColor: '#f4f4f4', 
                                        borderRadius: '4px',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        {formik.values.medicinePrice && (
                                            <div style={{ marginBottom: '0.5rem' }}>
                                                <strong>Medicine Price:</strong> {formik.values.medicinePrice.text}
                                            </div>
                                        )}
                                        {formik.values.dispenser && (
                                            <div>
                                                <strong>Dispenser:</strong> {formik.values.dispenser.text}
                                            </div>
                                        )}
                                    </div>
                                </Column>
                            </Grid>
                        </FormGroup>
                    )}
                </Stack>
            </Form>
        </Modal>
    );
};

export default DosageModal;