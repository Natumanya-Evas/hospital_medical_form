import { 
    Tabs, 
    Tab, 
    TabList, 
    TabPanels, 
    TabPanel, 
    Grid, 
    Column, 
    Stack 
} from '@carbon/react';
import MedicinePriceForm from './medicinePriceForm';
import DispenserForm from './dispenserForm';
import DispensersTable from './medicationTable';

const MedicationManagement = () => {
    return (
        <>
        <Grid condensed style={{ marginTop: '3rem', border:"solid 1px #ddd" }}>
            <Column sm={4} md={8} lg={16}>
               
                                <MedicinePriceForm />
                            
                                
                            
            </Column>
                        <Column sm={4} md={8} lg={16}>
               
                               
                                <DispenserForm />
                            
            </Column>
                                  <Column sm={4} md={8} lg={16}>
               
                               
                                 <DispensersTable />
                            
            </Column>
            
        </Grid>
       
        </>
    );
};
export default MedicationManagement;