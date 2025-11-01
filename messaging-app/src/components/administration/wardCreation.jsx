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
    Tile
} from '@carbon/react';
import { useState } from 'react';

const wardValidationSchema = Yup.object({
    name: Yup.string()
        .required('Ward name is required')
        .min(2, 'Ward name must be at least 2 characters')
        .max(100, 'Ward name must be less than 100 characters'),
    location: Yup.string()
        .required('Location is required')
        .min(5, 'Location must be at least 5 characters')
        .max(200, 'Location must be less than 200 characters')
});

const WardCreationForm = () => {
    const [submitting, setSubmitting] = useState(false);
    
    const wardFormik = useFormik({
        initialValues: {
            name: '',
            location: ''
        },
        validationSchema: wardValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            setSubmitting(true);
            try {
                const response = await fetch('http://localhost:8080/medic/wards', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values)
                });

                if (response.ok) {
                    console.log('Ward created successfully');
                    resetForm();
                } else {
                    console.error('Failed to create ward');
                }
            } catch (error) {
                console.error('Error creating ward:', error);
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <>
            <Column sm={4} md={4} lg={8}>
                
                    
                        <h3>Create New Ward</h3>
                        
                        <Form onSubmit={wardFormik.handleSubmit}>
                                <FormGroup legendText="Ward Information">
                                    
                                            <TextInput
                                                id="wardName"
                                                name="name"
                                                labelText="Ward Name *"
                                                placeholder="e.g., Emergency Ward, ICU"
                                                value={wardFormik.values.wardName}
                                                onChange={wardFormik.handleChange}
                                                onBlur={wardFormik.handleBlur}
                                                invalid={wardFormik.touched.wardName && Boolean(wardFormik.errors.wardName)}
                                                invalidText={wardFormik.errors.wardName}
                                                disabled={submitting}
                                            />
                                  

                                  
                                            <TextInput
                                                id="location"
                                                name="location"
                                                labelText="Location *"
                                                placeholder="e.g., Ground Floor, Building A"
                                                value={wardFormik.values.location}
                                                onChange={wardFormik.handleChange}
                                                onBlur={wardFormik.handleBlur}
                                                invalid={wardFormik.touched.location && Boolean(wardFormik.errors.location)}
                                                invalidText={wardFormik.errors.location}
                                                disabled={submitting}
                                            />
                                      
                                </FormGroup>

                                <Button
                                    type="submit"
                                    kind="primary"
                                    disabled={submitting || !wardFormik.isValid}
                                >
                                    {submitting ? 'Creating Ward...' : 'Create Ward'}
                                </Button>
                        
                        </Form>
                    
                
            </Column>
        </>
    );
};

export default WardCreationForm;