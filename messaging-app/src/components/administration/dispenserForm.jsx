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
    Tile,
    InlineNotification,
    InlineLoading
} from '@carbon/react';
import { useState } from 'react';
import { Location } from '@carbon/icons-react';

// Validation schema
const dispenserValidationSchema = Yup.object({
    workName: Yup.string()
        .required('Dispenser name is required')
        .min(2, 'Dispenser name must be at least 2 characters')
        .max(100, 'Dispenser name must be less than 100 characters'),
    location: Yup.string()
        .required('Location is required')
        .min(5, 'Location must be at least 5 characters')
        .max(200, 'Location must be less than 200 characters'),
    phone: Yup.string()
        .required('Phone number is required')
        .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
    email: Yup.string()
        .required('Email is required')
        .email('Please enter a valid email address')
        .max(100, 'Email must be less than 100 characters')
});

const DispenserForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const formik = useFormik({
        initialValues: {
            workName: '',
            location: '',
            phone: '',
            email: ''
        },
        validationSchema: dispenserValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            setSubmitting(true);
            setShowSuccess(false);
            
            try {
                const response = await fetch('http://localhost:8080/medic/api/dispensers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values)
                });

                if (response.ok) {
                    console.log('Dispenser created successfully');
                    setShowSuccess(true);
                    resetForm();
                    
                    // Reset success message after delay
                    setTimeout(() => {
                        setShowSuccess(false);
                    }, 3000);
                } else {
                    console.error('Failed to create dispenser');
                }
            } catch (error) {
                console.error('Error creating dispenser:', error);
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <>
            <Column sm={4} md={8} lg={8}>
                
                    <Stack gap={6}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Location size={24} />
                            <h3>Add Dispenser</h3>
                        </div>
                        
                        {showSuccess && (
                            <InlineNotification
                                kind="success"
                                title="Success"
                                subtitle="Dispenser added successfully!"
                                lowContrast
                            />
                        )}
                        
                        <Form onSubmit={formik.handleSubmit}>
                            <Stack gap={6}>
                                <FormGroup legendText="Dispenser Information">
                                    {/* Work Name */}
                                    
                                            <TextInput
                                                id="workName"
                                                name="workName"
                                                labelText="Dispenser Name *"
                                                placeholder="e.g., City Pharmacy, Hospital Pharmacy"
                                                value={formik.values.workName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.workName && Boolean(formik.errors.workName)}
                                                invalidText={formik.errors.workName}
                                                disabled={submitting}
                                            />
                                      

                             
                                            <TextInput
                                                id="location"
                                                name="location"
                                                labelText="Location *"
                                                placeholder="e.g., 123 Main Street, City, State"
                                                value={formik.values.location}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.location && Boolean(formik.errors.location)}
                                                invalidText={formik.errors.location}
                                                disabled={submitting}
                                            />
                             

                                  
                                            <TextInput
                                                id="phone"
                                                name="phone"
                                                labelText="Phone Number *"
                                                placeholder="e.g., +1-555-0101"
                                                value={formik.values.phone}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.phone && Boolean(formik.errors.phone)}
                                                invalidText={formik.errors.phone}
                                                disabled={submitting}
                                            />
                                     
                                            <TextInput
                                                id="email"
                                                name="email"
                                                labelText="Email Address *"
                                                placeholder="e.g., pharmacy@example.com"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.email && Boolean(formik.errors.email)}
                                                invalidText={formik.errors.email}
                                                disabled={submitting}
                                                type="email"
                                            />
                                    
                                </FormGroup>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Button
                                        type="submit"
                                        kind="primary"
                                        disabled={submitting || !formik.isValid}
                                    >
                                        {submitting ? 'Adding Dispenser...' : 'Add Dispenser'}
                                    </Button>
                                    {submitting && <InlineLoading description="Saving..." />}
                                </div>
                            </Stack>
                        </Form>
                    </Stack>
                
            </Column>
        </>
    );
};

export default DispenserForm;