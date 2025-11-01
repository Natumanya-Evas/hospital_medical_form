import { Tabs, Tab, TabList, TabPanels, TabPanel, Grid, Column, Stack } from '@carbon/react';
import WardCreationForm from './wardCreation';
import BedCreationForm from './bedCreation';
import WardsTable from './wardsTable';

const WardBedManagement = () => {
    return (
    
        <Grid  style={{ marginTop: '3rem' }}>
            <Column sm={4} md={8} lg={8}>
                
                    <h2>Ward and Bed Management</h2>
                    
                   
                                                           
                                <BedCreationForm />
                 
            </Column>
                        <Column sm={4} md={8} lg={8}>
                
                    <h2>Ward and Bed Management</h2>
                    
                   
                                <WardCreationForm />
                           
                    
                 
            </Column>
            <WardsTable />
        
        </Grid>
        
        
    );
};

export default WardBedManagement;