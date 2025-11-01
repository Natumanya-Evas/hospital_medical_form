import React, { useState, useEffect } from 'react';
import {
    Modal,
    Button,
    Form,
    FormGroup,
    Dropdown,
    Loading,
    InlineLoading,
    Stack,
    Grid,
    Column
} from '@carbon/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const BedAssignmentModal = ({ 
    patient,
    open,
    onClose
}) => {
    const [availableBeds, setAvailableBeds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Validation schema
    const validationSchema = Yup.object({
        bedId: Yup.number()
            .nullable()
            .required('Bed selection is required')
    });

    const formik = useFormik({
        initialValues: {
            bedId: patient?.bed?.bedId || null
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setSubmitting(true);
            try {
                const response = await fetch(`http://localhost:8080/medic/api/patients/${patient.id}/bed`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        bedId: values.bedId
                    }),
                });

                if (response.ok) {
                   
                    setTimeout(() => {
                        onClose();
                        formik.resetForm();
                    }, 1500);
                } else {
                    throw new Error('Failed to assign bed');
                }
            } catch (error) {
                console.error('Error assigning bed:', error);

            } finally {
                setSubmitting(false);
            }
        }
    });

    // Fetch available beds
    const fetchAvailableBeds = async () => {
        setLoading(true);
        try {
            // Replace with your actual endpoint to fetch available beds
            const response = await fetch('http://localhost:8080/medic/beds/');
            if (response.ok) {
                const beds = await response.json();
                setAvailableBeds(beds);
            } else {
                throw new Error('Failed to fetch beds');
            }
        } catch (error) {
            console.error('Error fetching beds:', error);
           
        } finally {
            setLoading(false);
        }
    };


    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    useEffect(() => {
        if (open) {
            fetchAvailableBeds();
            // Set current bed if patient already has one
            if (patient?.bed) {
                formik.setFieldValue('bedId', patient.bed.bedId);
            }
        }
    }, [open, patient]);

    const bedOptions = availableBeds.map(bed => ({
        id: bed.bedId,
        label: `Bed ${bed.bedNumber} - Ward ${bed.wardId} (Row: ${bed.bedRow}, Column: ${bed.bedColumn})`,
        value: bed.bedId
    }));

    return (
        <>
            <Modal
                open={open}
                onRequestClose={handleClose}
                modalHeading={`Assign Bed to ${patient?.firstName} ${patient?.lastName}`}
                primaryButtonText={
                    submitting ? <InlineLoading description="Assigning..." /> : "Assign Bed"
                }
                secondaryButtonText="Cancel"
                onRequestSubmit={formik.handleSubmit}
                onSecondarySubmit={handleClose}
                size="md"
                primaryButtonDisabled={submitting || !formik.isValid}
            >
                <Form onSubmit={formik.handleSubmit}>
                    <Stack gap={6}>
                        {/* Patient Information */}
                        <FormGroup legendText="Patient Information">
                            <Stack gap={3}>
                                <div className="patient-info">
                                    <strong>Name:</strong> {patient?.firstName} {patient?.lastName}
                                </div>
                                <div className="patient-info">
                                    <strong>Patient ID:</strong> {patient?.id}
                                </div>
                                {patient?.bed && (
                                    <div className="patient-info current-bed">
                                        <strong>Current Bed:</strong> Bed {patient.bed.bedNumber} 
                                        {patient.bed.wardId && ` (Ward ${patient.bed.wardId})`}
                                    </div>
                                )}
                            </Stack>
                        </FormGroup>

                        {/* Bed Selection */}
                        <FormGroup legendText="Bed Assignment">
                            {loading ? (
                                <Loading description="Loading available beds..." withOverlay={false} />
                            ) : (
                                <Stack gap={3}>
                                    <Dropdown
                                        id="bedId"
                                        name="bedId"
                                        titleText="Select Bed *"
                                        label="Choose a bed"
                                        items={bedOptions}
                                        itemToString={(item) => item?.label || ''}
                                        selectedItem={bedOptions.find(item => item.value === formik.values.bedId)}
                                        onChange={({ selectedItem }) => {
                                            formik.setFieldValue('bedId', selectedItem?.value || null);
                                        }}
                                        onBlur={formik.handleBlur}
                                        invalid={formik.touched.bedId && Boolean(formik.errors.bedId)}
                                        invalidText={formik.errors.bedId}
                                        disabled={submitting}
                                    />
                                    
                                    <div className="cds--form__helper-text">
                                        {availableBeds.length === 0 
                                            ? 'No available beds found.' 
                                            : `${availableBeds.length} available bed(s) found.`
                                        }
                                    </div>
                                </Stack>
                            )}
                        </FormGroup>

                        {/* Bed Information Preview */}
                        {formik.values.bedId && (
                            <FormGroup legendText="Selected Bed Information">
                                <Grid condensed>
                                    <Column sm={2} md={4} lg={8}>
                                        <div className="bed-info">
                                            <strong>Bed Number:</strong>{' '}
                                            {availableBeds.find(bed => bed.id === formik.values.bedId)?.bedNumber}
                                        </div>
                                    </Column>
                                    <Column sm={2} md={4} lg={8}>
                                        <div className="bed-info">
                                            <strong>Location:</strong>{' '}
                                            Row {availableBeds.find(bed => bed.id === formik.values.bedId)?.bedRow}, 
                                            Column {availableBeds.find(bed => bed.id === formik.values.bedId)?.bedColumn}
                                        </div>
                                    </Column>
                                    <Column sm={4} md={8} lg={16}>
                                        <div className="bed-info">
                                            <strong>Ward:</strong>{' '}
                                            Ward {availableBeds.find(bed => bed.id === formik.values.bedId)?.wardId}
                                        </div>
                                    </Column>
                                </Grid>
                            </FormGroup>
                        )}
                    </Stack>
                </Form>
            </Modal>

        
        </>
    );
};

export default BedAssignmentModal;