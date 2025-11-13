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
        <Grid condensed style={{ marginTop: '3rem', border:"solid 1px #1cf34bff",  padding:"5px" }}>
            <Column sm={4} md={8} lg={16}>
               
                                <MedicinePriceForm />     
            </Column>
            <hr />  
                        <Column sm={4} md={8} lg={16}>
               
                               
                                <DispenserForm />
                            
            </Column>
            <hr />  
                                  <Column sm={4} md={8} lg={16}>
               
                               
                                 <DispensersTable />
                            
            </Column>
            
        </Grid>
       
        </>
    );
};
export default MedicationManagement;