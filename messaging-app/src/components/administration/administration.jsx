import { Column, Grid } from '@carbon/react';
import React from 'react';
import VisitsManager from '../management/visitsManager';
import PatientManagement from '../management/patientManagement';
import WardManagement from '../management/wardMarnagement';
import BedManagement from '../management/bedManagement';

const Administration = () => {
    return (
        <Grid>

            <Column lg={16} sm={4} md={8}>
            <VisitsManager />
            </Column>
            <Column lg={16} sm={4} md={8}>
            <PatientManagement />
            </Column>
            <Column lg={16} sm={4} md={8}>
            <WardManagement />
            </Column>
            <Column lg={16} sm={4} md={8}>
            <BedManagement />
            </Column>
            
        </Grid>
    );
}

export default Administration;
