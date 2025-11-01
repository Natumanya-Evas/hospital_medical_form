import React from 'react';
import {
  Modal,
  Button,
  Form,
  FormGroup,
  TextInput,
  Dropdown,
  DatePicker,
  DatePickerInput,
  Toggle,
  Grid,
  Column,
  Stack
} from '@carbon/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const VisitModal = ({ 
  patient,
  open,
  onClose
}) => {
  // Validation schema
  const validationSchema = Yup.object({
    reason: Yup.string()
      .required('Reason is required')
      .max(500, 'Reason must be less than 500 characters'),
    visitType: Yup.string()
      .required('Visit type is required'),
    visitDate: Yup.date()
      .required('Visit date is required')
      .max(new Date(), 'Visit date cannot be in the future'),
    endDate: Yup.date()
      .min(Yup.ref('visitDate'), 'End date must be after visit date')
      .nullable(),
    isActive: Yup.boolean()
  });

  const formik = useFormik({
    initialValues: {
      reason: '',
      visitType: '',
      visitDate: new Date(),
      endDate: null,
      isActive: true
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Format the data for the backend
        const visitData = {
          reason: values.reason,
          visitType: values.visitType,
          visitDate: new Date(values.visitDate).toISOString(),
          endDate: values.endDate ? new Date(values.endDate).toISOString() : null,
          isActive: values.isActive,
          patient: {
            id: patient.id
          }
        };

        // Make API call
        const response = await fetch('http://localhost:8080/medic/visits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitData),
        });

        if (response.ok) {
          console.log('Visit created successfully');
          onClose();
          formik.resetForm();
        } else {
          console.error('Failed to create visit');
        }
      } catch (error) {
        console.error('Error creating visit:', error);
      }
    }
  });

  const visitTypeOptions = [
    { id: 'consultation', label: 'Consultation', value: 'CONSULTATION' },
    { id: 'follow-up', label: 'Follow-up', value: 'FOLLOW_UP' },
    { id: 'emergency', label: 'Emergency', value: 'EMERGENCY' },
    { id: 'routine-checkup', label: 'Routine Checkup', value: 'ROUTINE_CHECKUP' },
    { id: 'specialist-visit', label: 'Specialist Visit', value: 'SPECIALIST_VISIT' },
    { id: 'vaccination', label: 'Vaccination', value: 'VACCINATION' },
    { id: 'lab-test', label: 'Lab Test', value: 'LAB_TEST' }
  ];

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onRequestClose={handleClose}
      modalHeading={`Create Visit for ${patient?.firstName} ${patient?.lastName}`}
      primaryButtonText="Create Visit"
      secondaryButtonText="Cancel"
      onRequestSubmit={formik.handleSubmit}
      onSecondarySubmit={handleClose}
      size="md"
    >
      <Form onSubmit={formik.handleSubmit}>
        <Stack gap={6}>
          <FormGroup legendText="Patient Information">
            <TextInput
              id="patientInfo"
              labelText="Patient"
              value={`${patient?.firstName} ${patient?.lastName} (ID: ${patient?.id})`}
              disabled
              readOnly
            />
          </FormGroup>

          <FormGroup legendText="Visit Details">
            <Stack gap={4}>
              <Dropdown
                id="visitType"
                label="Visit Type *"
                titleText="Visit Type *"
                items={visitTypeOptions}
                itemToString={(item) => item?.label || ''}
                selectedItem={visitTypeOptions.find(item => item.value === formik.values.visitType)}
                onChange={({ selectedItem }) => 
                  formik.setFieldValue('visitType', selectedItem?.value || '')
                }
                onBlur={formik.handleBlur}
                invalid={formik.touched.visitType && Boolean(formik.errors.visitType)}
                invalidText={formik.errors.visitType}
              />

              <TextInput
                id="reason"
                name="reason"
                labelText="Reason for Visit *"
                value={formik.values.reason}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={formik.touched.reason && Boolean(formik.errors.reason)}
                invalidText={formik.errors.reason}
                placeholder="Enter the reason for the visit"
              />
            </Stack>
          </FormGroup>

          <Grid condensed>
            <Column sm={4} md={8} lg={8}>
              <FormGroup legendText="Visit Date">
                <DatePicker
                  datePickerType="single"
                  value={formik.values.visitDate}
                  onChange={([date]) => formik.setFieldValue('visitDate', date)}
                >
                  <DatePickerInput
                    id="visitDate"
                    name="visitDate"
                    labelText="Visit Date *"
                    placeholder="mm/dd/yyyy"
                    invalid={formik.touched.visitDate && Boolean(formik.errors.visitDate)}
                    invalidText={formik.errors.visitDate}
                  />
                </DatePicker>
              </FormGroup>
            </Column>

            <Column sm={4} md={8} lg={8}>
              <FormGroup legendText="End Date (Optional)">
                <DatePicker
                  datePickerType="single"
                  value={formik.values.endDate}
                  onChange={([date]) => formik.setFieldValue('endDate', date)}
                >
                  <DatePickerInput
                    id="endDate"
                    name="endDate"
                    labelText="End Date"
                    placeholder="mm/dd/yyyy"
                    invalid={formik.touched.endDate && Boolean(formik.errors.endDate)}
                    invalidText={formik.errors.endDate}
                  />
                </DatePicker>
              </FormGroup>
            </Column>
          </Grid>

          <FormGroup legendText="Visit Status">
            <Toggle
              id="isActive"
              labelA="Inactive"
              labelB="Active"
              toggled={formik.values.isActive}
              onToggle={(checked) => formik.setFieldValue('isActive', checked)}
            />
            <div className="cds--form__helper-text">
              Set whether this visit is currently active
            </div>
          </FormGroup>
        </Stack>
      </Form>
    </Modal>
  );
};

export default VisitModal;