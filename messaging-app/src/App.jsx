import React, { useState } from 'react';
import Customers from './components/customers';
import "./App.css"
import { Route, Routes, useLocation } from 'react-router';
import Messager from './components/messager';
import Admin from './components/admin';
import DashBoard from './components/dashbord/dashBoard';
import Heading from './components/headercomponent/heading';
import PatientDetails from './components/patient/patientDetails';
import AdminBoard from './components/administration/adminBoard';
import PatientList from './components/patient/patientList';
import MedicalReport from './components/patient/patientReport';

const App = () => {
  const location = useLocation();

  // Hide heading on these routes
  const hideHeadingRoutes = ['/']; // add routes where heading should be hidden

  const showHeading = !hideHeadingRoutes.includes(location.pathname);

  return (
    <>
      {showHeading && <Heading />}
      
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path='/customers' element={<Customers />} />
        <Route path='/message/:id' element={<Messager />} />
        <Route path='/patientDetails/:id' element={<PatientDetails />} />
        <Route path='/admin' element={<AdminBoard />} />
        <Route path='/report/:id' element={<MedicalReport />} />
        <Route path='/patientList' element={<PatientList />} />
      </Routes>
    </>
  );
};
export default App