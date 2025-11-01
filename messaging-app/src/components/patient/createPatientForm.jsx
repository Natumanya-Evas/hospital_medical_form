import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  TextInput,
  DatePicker,
  DatePickerInput,
  Select,
  SelectItem,
  Form,
  FormGroup,
  Stack,
  Layer,
  Loading,
  InlineNotification,
  Column,
  Grid,
  Modal,
} from '@carbon/react';
import { Close } from '@carbon/icons-react';

const PatientForm = ({ isOpen, onClose }) => {
  // Validation schema using Yup
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required('First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters'),
    lastName: Yup.string()
      .required('Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters'),
    middleName: Yup.string()
      .required('Middle name is required')
      .min(2, 'Middle name must be at least 2 characters')
      .max(50, 'Middle name must be less than 50 characters'),
    dateOfBirth: Yup.date()
      .required('Date of birth is required')
      .max(new Date(), 'Date of birth cannot be in the future'),
    gender: Yup.string()
      .required('Gender is required')
      .oneOf(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'], 'Invalid gender selection'),
    contactNumber: Yup.string()
      .matches(/^\+?[0-9\s\-\(\)]{10,15}$/, 'Please enter a valid contact number')
      .nullable(),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      dateOfBirth: '',
      gender: '',
      contactNumber: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
      try {
        setSubmitting(true);
        setStatus(null);

        // Format the date for your API
        const formattedDate = values.dateOfBirth ? 
          new Date(values.dateOfBirth).toISOString() : null;

        const patientData = {
          ...values,
          dateOfBirth: formattedDate,
        };

        const response = await fetch('http://localhost:8080/medic/api/patients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(patientData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Show success notification
        setStatus({ type: 'success', message: 'Patient created successfully!' });
        
        // Reset form and close after success
        setTimeout(() => {
          resetForm();
          onClose();
        }, 2000);
        
      } catch (error) {
        console.error('Error creating patient:', error);
        setStatus({ 
          type: 'error', 
          message: `Failed to create patient: ${error.message}` 
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
  ];

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      modalHeading="Add New Patient"
      modalLabel="Patient Registration"
      primaryButtonText={formik.isSubmitting ? <Loading small withOverlay={false} /> : "Create Patient"}
      secondaryButtonText="Cancel"
      onRequestClose={onClose}
      onRequestSubmit={formik.handleSubmit}
      primaryButtonDisabled={formik.isSubmitting || !formik.isValid}
      size="md"
    >
      <Form onSubmit={formik.handleSubmit}>
        <Stack gap={6}>
          {/* Status Notifications */}
          {formik.status && (
            <InlineNotification
              kind={formik.status.type === 'success' ? 'success' : 'error'}
              title={formik.status.type === 'success' ? 'Success' : 'Error'}
              subtitle={formik.status.message}
              lowContrast
            />
          )}

          <FormGroup legendText="Patient Information">
            <Stack gap={5}>
              {/* First Name */}
              <TextInput
                id="firstName"
                name="firstName"
                labelText="First Name *"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.firstName && Boolean(formik.errors.firstName)}
                invalidText={formik.errors.firstName}
                required
              />

              {/* Last Name */}
              <TextInput
                id="lastName"
                name="lastName"
                labelText="Last Name *"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.lastName && Boolean(formik.errors.lastName)}
                invalidText={formik.errors.lastName}
                required
              />

              {/* Middle Name */}
              <TextInput
                id="middleName"
                name="middleName"
                labelText="Middle Name *"
                value={formik.values.middleName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.middleName && Boolean(formik.errors.middleName)}
                invalidText={formik.errors.middleName}
                required
              />

              {/* Date of Birth */}
              <DatePicker
                datePickerType="single"
                value={formik.values.dateOfBirth}
                onChange={([date]) => {
                  formik.setFieldValue('dateOfBirth', date);
                }}
              >
                <DatePickerInput
                  id="dateOfBirth"
                  name="dateOfBirth"
                  placeholder="mm/dd/yyyy"
                  labelText="Date of Birth *"
                  invalid={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                  invalidText={formik.errors.dateOfBirth}
                  required
                />
              </DatePicker>

              {/* Gender */}
              <Select
                id="gender"
                name="gender"
                labelText="Gender *"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.gender && Boolean(formik.errors.gender)}
                invalidText={formik.errors.gender}
                required
              >
                {genderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} text={option.label} />
                ))}
              </Select>

              {/* Contact Number */}
              <TextInput
                id="contactNumber"
                name="contactNumber"
                labelText="Contact Number"
                value={formik.values.contactNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                invalidText={formik.errors.contactNumber}
                placeholder="+1234567890"
              />
            </Stack>
          </FormGroup>
        </Stack>
      </Form>
    </Modal>
  );
};

export default PatientForm;