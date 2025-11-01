import { Column, Grid } from '@carbon/react';
import React from 'react';
import ResultManager from '../management/resultManager';
import DiagnosisManager from '../management/diadnosisManager';

const ResultManagement = () => {
    return (
        <Grid style={{marginTop: '4rem'}} >
            <Column lg={16} sm={4} md={8}>
            <ResultManager />
            </Column>
            <Column lg={16} sm={4} md={8}>
            <DiagnosisManager />
            </Column>
            
        </Grid>
    );
}

export default ResultManagement;
