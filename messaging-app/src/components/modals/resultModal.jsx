import { useState, useEffect } from 'react';
import {
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

const ResultModal = ({ patient, open, onClose, existingResultProp }) => {
    const [formData, setFormData] = useState({
        resultCode: '',
        description: '',
        resultType: null,
        testMethod: null,
        notes: '',
        createdAt: ''
    });

    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const existingResult = existingResultProp || null;

    const resultTypes = [
        { id: 'lab', text: 'Laboratory' },
        { id: 'imaging', text: 'Imaging' },
        { id: 'pathology', text: 'Pathology' },
        { id: 'microbiology', text: 'Microbiology' },
        { id: 'radiology', text: 'Radiology' },
        { id: 'cardiology', text: 'Cardiology' },
        { id: 'pulmonary', text: 'Pulmonary' },
        { id: 'neurology', text: 'Neurology' }
    ];

    const testMethods = [
        { id: 'automated', text: 'Automated Analyzer' },
        { id: 'manual', text: 'Manual Testing' },
        { id: 'pcr', text: 'PCR' },
        { id: 'elisa', text: 'ELISA' },
        { id: 'culture', text: 'Culture' },
        { id: 'xray', text: 'X-Ray' },
        { id: 'mri', text: 'MRI' },
        { id: 'ct', text: 'CT Scan' },
        { id: 'ultrasound', text: 'Ultrasound' },
        { id: 'ekg', text: 'EKG/ECG' }
    ];

    useEffect(() => {
        if (open) {
            setFormData({
                resultCode: existingResult?.resultCode || '',
                description: existingResult?.description || '',
                resultType: existingResult
                    ? resultTypes.find(item => item.text === existingResult.resultType) || null
                    : null,
                testMethod: existingResult
                    ? testMethods.find(item => item.text === existingResult.testMethod) || null
                    : null,
                notes: existingResult?.notes || '',
                createdAt: existingResult?.createdAt || new Date().toISOString()
            });
        }
    }, [open, existingResult]);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setShowSuccess(false);

        const payload = {
            ...formData,
            resultType: formData.resultType?.text || '',
            testMethod: formData.testMethod?.text || '',
            patient: { id: patient.id },
            id: existingResult ? existingResult.id : undefined
        };

        try {
            const url = 'http://localhost:8080/medic/api/results';
            const method = existingResult ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setShowSuccess(true);
                setTimeout(() => handleClose(), 1500);
            } else {
                console.error('Failed to save result:', await response.text());
            }
        } catch (error) {
            console.error('Error saving result:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            resultCode: '',
            description: '',
            resultType: null,
            testMethod: null,
            notes: '',
            createdAt: ''
        });
        setShowSuccess(false);
        onClose();
    };

    if (!patient || !open) return null;

    return (
        <Modal
            open={open}
            modalHeading={existingResult ? "Update Test Result" : "Add New Test Result"}
            modalLabel="Medical Results"
            primaryButtonText={submitting ? <InlineLoading description="Saving..." /> : (existingResult ? "Update Result" : "Add Result")}
            secondaryButtonText="Cancel"
            onRequestSubmit={handleSubmit}
            onRequestClose={handleClose}
            primaryButtonDisabled={submitting}
            size="lg"
        >
            {showSuccess && (
                <InlineNotification
                    kind="success"
                    title="Success"
                    subtitle="Test result saved successfully!"
                    lowContrast
                    style={{ marginBottom: '1rem' }}
                />
            )}

            <Form>
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
                    </FormGroup>

                    {/* Result Details */}
                    <FormGroup legendText="Test Result Details">
                        <Grid narrow>
                            <Column sm={2} md={4} lg={8}>
                                <TextInput
                                    id="resultCode"
                                    labelText="Result Code"
                                    placeholder="e.g., CBC-001"
                                    value={formData.resultCode}
                                    onChange={(e) => handleChange('resultCode', e.target.value)}
                                    disabled={submitting}
                                />
                            </Column>
                            <Column sm={2} md={4} lg={8}>
                                <ComboBox
                                    id="resultType"
                                    titleText="Result Type"
                                    items={resultTypes}
                                    itemToString={(item) => (item ? item.text : '')}
                                    selectedItem={formData.resultType}
                                    onChange={({ selectedItem }) => handleChange('resultType', selectedItem)}
                                    placeholder="Select result type..."
                                    disabled={submitting}
                                />
                            </Column>
                        </Grid>

                        <Grid narrow>
                            <Column sm={4} md={8} lg={16}>
                                <TextInput
                                    id="description"
                                    labelText="Description"
                                    placeholder="e.g., Complete Blood Count"
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    disabled={submitting}
                                />
                            </Column>
                        </Grid>

                        <Grid narrow>
                            <Column sm={4} md={8} lg={16}>
                                <ComboBox
                                    id="testMethod"
                                    titleText="Test Method"
                                    items={testMethods}
                                    itemToString={(item) => (item ? item.text : '')}
                                    selectedItem={formData.testMethod}
                                    onChange={({ selectedItem }) => handleChange('testMethod', selectedItem)}
                                    placeholder="Select test method..."
                                    disabled={submitting}
                                />
                            </Column>
                        </Grid>

                        <Grid narrow>
                            <Column sm={4} md={8} lg={16}>
                                <TextArea
                                    id="notes"
                                    labelText="Clinical Notes"
                                    placeholder="Enter clinical notes..."
                                    value={formData.notes}
                                    onChange={(e) => handleChange('notes', e.target.value)}
                                    disabled={submitting}
                                    rows={3}
                                />
                            </Column>
                        </Grid>

                        {existingResult && (
                            <Grid narrow>
                                <Column sm={4} md={8} lg={16}>
                                    <div style={{ fontSize: '0.875rem', color: '#6f6f6f' }}>
                                        <strong>Created:</strong> {new Date(existingResult.createdAt).toLocaleString()}
                                    </div>
                                </Column>
                            </Grid>
                        )}
                    </FormGroup>
                </Stack>
            </Form>
        </Modal>
    );
};

export default ResultModal;
