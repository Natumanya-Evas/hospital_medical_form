import { Add, HealthCross } from '@carbon/icons-react';
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderName } from '@carbon/react';
import React, { useState } from 'react';
import PatientForm from '../patient/createPatientForm';

const Heading = () => {
    const [isPatientFormOpen, setIsPatientFormOpen] = useState(false);

    const handlePatientFormOpen = () => setIsPatientFormOpen(true);
    const handlePatientFormClose = () => setIsPatientFormOpen(false);

    return (
        <>
            <Header>
                 <HealthCross size={30} className="m-3" style={{border:"red solid 1px", borderRadius:"100%"}} />
                <HeaderName href="/dashboard" prefix="">
                    Medical Record System
                </HeaderName>
                
                <HeaderGlobalBar>
                    <HeaderGlobalAction
                        onClick={handlePatientFormOpen}
                        aria-label="Add New Patient"
                        style={{
                            border: "1px solid #0072c3",
                            borderRadius: "50%",
                            padding: "8px",
                            transition: "0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e6f2ff'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <Add size={24} />
                    </HeaderGlobalAction>
                </HeaderGlobalBar>
            </Header>

            {/* Modal Form */}
            <PatientForm
                isOpen={isPatientFormOpen}
                onClose={handlePatientFormClose}
            />
        </>
    );
};

export default Heading;
