import { Column, Grid } from '@carbon/react';
import React from 'react';
import DispenserManagement from '../management/dispenseManagement';
import MedicinePriceManagement from '../management/medicinePriceManagement';
import DosageManagement from '../management/dosageManager';

const DrugsManagement = () => {
    return (
        < >
            <Column lg={16} sm={4} md={8}>
            <DispenserManagement />
            </Column>
            <Column lg={16} sm={4} md={8}>
            <MedicinePriceManagement />
            </Column>
                        <Column lg={16} sm={4} md={8}>
            <DosageManagement />
            </Column>
            
        </>
    );
}

export default DrugsManagement;
