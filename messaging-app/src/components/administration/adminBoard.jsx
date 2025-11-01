import React, { useState } from 'react';
import { Grid, Column } from '@carbon/react';
import { 
  UserAdmin, Hospital, AddAlt, Money, Location, Dashboard 
} from '@carbon/icons-react';
import WardBedManagement from './wardBedManagement';
import MedicationManagement from './medicationManagement';
import CustomerTable from './userManagement';
import Administration from './administration';
import AssessmentRecords from './assessmentRecords';
import ResultManagement from './resultManagement';
import DrugsManagement from './drugsManagement';

const AdminBoard = () => {
  // Default view: Administration + AssessmentRecords
  const [activeFeature, setActiveFeature] = useState('Administration');

  const renderContent = () => {
    switch (activeFeature) {
      case 'Administration':
        return (
          <>
            <Administration />
            <AssessmentRecords />
          </>
        );
      case 'Users':
        return <CustomerTable />;
      case 'Ward':
        return <WardBedManagement />;
      case 'Drugs':
        return <DrugsManagement />;
      case 'Pricing':
        return <MedicationManagement />;
      case 'Results':
        return <ResultManagement />;
      default:
        return <p>Welcome to the admin dashboard.</p>;
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Main content in Carbon Grid */}
      <Grid style={{ paddingBottom: '3rem' /* leave space for footer */ }}>
        <Column lg={16} md={8} sm={4}>
          {renderContent()}
        </Column>
      </Grid>

      {/* Footer with clickable icons */}
      <Grid style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#f4f4f4',
        borderTop: '1px solid #ccc',
        zIndex: 1000,
        padding: '0.5rem 0'
      }}>
        <Column lg={16} sm={4} md={8} style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Dashboard size={24} onClick={() => setActiveFeature('Administration')} style={{ cursor: 'pointer' }} />
          <UserAdmin size={24} onClick={() => setActiveFeature('Users')} style={{ cursor: 'pointer' }} />
          <Hospital size={24} onClick={() => setActiveFeature('Ward')} style={{ cursor: 'pointer' }} />
          <AddAlt size={24} onClick={() => setActiveFeature('Drugs')} style={{ cursor: 'pointer' }} />
          <Money size={24} onClick={() => setActiveFeature('Pricing')} style={{ cursor: 'pointer' }} />
          <Location size={24} onClick={() => setActiveFeature('Results')} style={{ cursor: 'pointer' }} />
        </Column>
      </Grid>
    </div>
  );
};

export default AdminBoard;
