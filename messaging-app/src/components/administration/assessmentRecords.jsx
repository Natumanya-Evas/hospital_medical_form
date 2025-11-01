import { Column, Grid } from '@carbon/react';
import React from 'react';
import VitalsManager from '../management/vitalsManager';
import BiometricsManager from '../management/biometricsManger';

const AssessmentRecords = () => {
    return (
        <Grid>
            <Column lg={16} sm={4} md={8}>
            <VitalsManager />
            </Column>
             <Column lg={16} sm={4} md={8}>
            <BiometricsManager/>
            </Column>

            
        </Grid>
    );
}

export default AssessmentRecords;
