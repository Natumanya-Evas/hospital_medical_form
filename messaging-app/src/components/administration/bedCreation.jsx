import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  TextInput,
  ComboBox,
  Form,
  FormGroup,
  Stack,
  Column,
  Checkbox
} from '@carbon/react';

// ✅ Validation Schema with nested ward.id
const bedValidationSchema = Yup.object({
  bedNumber: Yup.string()
    .required('Bed number is required')
    .matches(/^[A-Za-z0-9\-_]+$/, 'Only letters, numbers, hyphens, and underscores allowed'),
  bedRow: Yup.number()
    .required('Row is required')
    .positive('Row must be positive')
    .integer('Row must be a whole number'),
  bedColumn: Yup.number()
    .required('Column is required')
    .positive('Column must be positive')
    .integer('Column must be a whole number'),
  occupied: Yup.boolean(),
  ward: Yup.object({
    id: Yup.number()
      .required('Ward is required')
      .positive('Please select a valid ward')
  }).required('Ward is required')
});

const BedCreationForm = () => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Fetch wards for ComboBox
  useEffect(() => {
    const fetchWards = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/medic/wards');
        const data = await response.json();
        setWards(data);
      } catch (error) {
        console.error('Error fetching wards:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWards();
  }, []);

  // ✅ Formik configuration
  const formik = useFormik({
    initialValues: {
      bedNumber: '',
      bedRow: '',
      bedColumn: '',
      occupied: false,
      ward: { id: '' } // 👈 nested ward object
    },
    validationSchema: bedValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      try {
        const response = await fetch('http://localhost:8080/medic/beds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values) // ✅ directly send with nested ward
        });

        if (response.ok) {
          console.log('✅ Bed created successfully');
          resetForm();
        } else {
          console.error('❌ Failed to create bed');
        }
      } catch (error) {
        console.error('⚠️ Error creating bed:', error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  // ✅ ComboBox items
  const wardItems = wards.map(ward => ({
    id: ward.wardId?.toString() || ward.id?.toString(),
    text: `${ward.wardName} - ${ward.location || ''}`,
    wardId: ward.wardId || ward.id
  }));

  return (
    <Column sm={4} md={8} lg={8}>
      <Stack gap={6}>
        <h3>Create New Bed</h3>

        <Form onSubmit={formik.handleSubmit}>
          <Stack gap={6}>

            {/* 🏥 Ward Selection */}
            <FormGroup legendText="Select Ward">
              <ComboBox
                id="ward"
                name="ward"
                titleText="Ward *"
                items={wardItems}
                itemToString={(item) => (item ? item.text : '')}
                placeholder="Select a ward..."
                onChange={({ selectedItem }) => {
                  formik.setFieldValue('ward', selectedItem ? { id: selectedItem.wardId } : { id: '' });
                }}
                onBlur={formik.handleBlur}
                value={
                  formik.values.ward.id
                    ? wardItems.find(item => item.wardId === formik.values.ward.id)?.text || ''
                    : ''
                }
                invalid={formik.touched.ward?.id && Boolean(formik.errors.ward?.id)}
                invalidText={formik.errors.ward?.id}
                disabled={loading || submitting}
              />
              {loading && <p>Loading wards...</p>}
            </FormGroup>

            {/* 🛏️ Bed Details */}
            <FormGroup legendText="Bed Information">
              <TextInput
                id="bedNumber"
                name="bedNumber"
                labelText="Bed Number *"
                placeholder="e.g., A-101, ICU-001"
                value={formik.values.bedNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.bedNumber && Boolean(formik.errors.bedNumber)}
                invalidText={formik.errors.bedNumber}
                disabled={submitting}
              />

              <TextInput
                id="bedRow"
                name="bedRow"
                labelText="Row *"
                placeholder="e.g., 1"
                type="number"
                value={formik.values.bedRow}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.bedRow && Boolean(formik.errors.bedRow)}
                invalidText={formik.errors.bedRow}
                disabled={submitting}
              />

              <TextInput
                id="bedColumn"
                name="bedColumn"
                labelText="Column *"
                placeholder="e.g., 2"
                type="number"
                value={formik.values.bedColumn}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.bedColumn && Boolean(formik.errors.bedColumn)}
                invalidText={formik.errors.bedColumn}
                disabled={submitting}
              />

              <Checkbox
                id="occupied"
                name="occupied"
                labelText="Bed is currently occupied"
                checked={formik.values.occupied}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={submitting}
              />
            </FormGroup>

            {/* 🟢 Submit Button */}
            <Button
              type="submit"
              kind="primary"
              disabled={submitting || !formik.isValid}
            >
              {submitting ? 'Creating Bed...' : 'Create Bed'}
            </Button>
          </Stack>
        </Form>
      </Stack>
    </Column>
  );
};

export default BedCreationForm;
