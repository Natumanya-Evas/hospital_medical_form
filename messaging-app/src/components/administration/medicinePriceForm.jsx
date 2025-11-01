import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Button,
    TextInput,
    NumberInput,
    Form,
    FormGroup,
    Stack,
    Grid,
    Column,
    Tile,
    InlineNotification,
    InlineLoading,
    ComboBox
} from '@carbon/react';
import { useState } from 'react';
import { Money } from '@carbon/icons-react';

// Validation schema
const medicinePriceValidationSchema = Yup.object({
    quantity: Yup.number()
        .required('Quantity is required')
        .min(1, 'Quantity must be at least 1')
        .integer('Quantity must be a whole number'),
    unitMeasure: Yup.string()
        .required('Unit measure is required'),
    price: Yup.number()
        .required('Price is required')
        .min(0.01, 'Price must be greater than 0')
});

const MedicinePriceForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Common unit measures
    const unitMeasures = [
        { id: 'tablets', text: 'Tablets' },
        { id: 'capsules', text: 'Capsules' },
        { id: 'ml', text: 'Milliliters (ml)' },
        { id: 'mg', text: 'Milligrams (mg)' },
        { id: 'g', text: 'Grams (g)' },
        { id: 'injections', text: 'Injections' },
        { id: 'bottles', text: 'Bottles' },
        { id: 'packets', text: 'Packets' },
        { id: 'puffs', text: 'Puffs' },
        { id: 'patches', text: 'Patches' }
    ];

    const formik = useFormik({
        initialValues: {
            quantity: '',
            unitMeasure: '',
            price: ''
        },
        validationSchema: medicinePriceValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            setSubmitting(true);
            setShowSuccess(false);
            
            try {
                const response = await fetch('http://localhost:8080/medic/api/medicine-prices', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values)
                });

                if (response.ok) {
                    console.log('Medicine price created successfully');
                    setShowSuccess(true);
                    resetForm();
                    
                    // Reset success message after delay
                    setTimeout(() => {
                        setShowSuccess(false);
                    }, 3000);
                } else {
                    console.error('Failed to create medicine price');
                }
            } catch (error) {
                console.error('Error creating medicine price:', error);
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        < >
            <Column sm={4} md={8} lg={8}>
                
                    <Stack gap={6}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Money size={24} />
                            <h3>Add Medicine Price</h3>
                        </div>
                        
                        {showSuccess && (
                            <InlineNotification
                                kind="success"
                                title="Success"
                                subtitle="Medicine price added successfully!"
                                lowContrast
                            />
                        )}
                        
                        <Form onSubmit={formik.handleSubmit}>
                            <Stack gap={6}>
                                <FormGroup legendText="Medicine Pricing Information">
                                    {/* Quantity and Unit Measure */}
                                   
                                            <NumberInput
                                                id="quantity"
                                                name="quantity"
                                                label="Quantity *"
                                                min={1}
                                                value={formik.values.quantity}
                                                onChange={(event, { value }) => {
                                                    formik.setFieldValue('quantity', value);
                                                }}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.quantity && Boolean(formik.errors.quantity)}
                                                invalidText={formik.errors.quantity}
                                                disabled={submitting}
                                            />
                                       
                                            <ComboBox
                                                id="unitMeasure"
                                                name="unitMeasure"
                                                titleText="Unit Measure *"
                                                items={unitMeasures}
                                                itemToString={(item) => item ? item.text : ''}
                                                placeholder="Select unit measure..."
                                                onChange={({ selectedItem }) => {
                                                    formik.setFieldValue('unitMeasure', selectedItem ? selectedItem.text : '');
                                                }}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.unitMeasure}
                                                invalid={formik.touched.unitMeasure && Boolean(formik.errors.unitMeasure)}
                                                invalidText={formik.errors.unitMeasure}
                                                disabled={submitting}
                                            />
                                     

                                    {/* Price */}
                                  
                                            <NumberInput
                                                id="price"
                                                name="price"
                                                label="Price ($) *"
                                                min={0.01}
                                                step={0.01}
                                                value={formik.values.price}
                                                onChange={(event, { value }) => {
                                                    formik.setFieldValue('price', value);
                                                }}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.price && Boolean(formik.errors.price)}
                                                invalidText={formik.errors.price}
                                                disabled={submitting}
                                            />
                                      

                                    {/* Price Calculation Preview */}
                                    {formik.values.quantity && formik.values.price && (
                                        
                                                <div style={{ 
                                                    padding: '1rem', 
                                                    backgroundColor: '#f4f4f4', 
                                                    borderRadius: '4px',
                                                    border: '1px solid #e0e0e0'
                                                }}>
                                                    <div style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
                                                        <strong>Price Summary:</strong><br/>
                                                        {formik.values.quantity} {formik.values.unitMeasure} at ${formik.values.price} each
                                                        <br/>
                                                        <strong>Total: ${(formik.values.quantity * formik.values.price).toFixed(2)}</strong>
                                                    </div>
                                                </div>
                                         
                                    )}
                                </FormGroup>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Button
                                        type="submit"
                                        kind="primary"
                                        disabled={submitting || !formik.isValid}
                                    >
                                        {submitting ? 'Adding Price...' : 'Add Medicine Price'}
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

export default MedicinePriceForm;