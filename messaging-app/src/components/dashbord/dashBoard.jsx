import React, { useEffect, useState } from 'react';
import { Column, Grid } from '@carbon/react';
import { DashBoardObject } from './dashObject';
import { User } from '@carbon/icons-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router';
import PatientTable from '../patient/patientTable';

const DashBoard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("admin"))

  return (
    <>
      <Grid condensed className="p-3 mt-5">
        {user ? (
          <Column lg={4} sm={4} md={4} className="p-4 text-start m-2 shadow-lg bg-primary rounded text-white">
            <User size={30} />
            <h5 className="mt-2">{user.name}</h5>
            <h5>{user.username}</h5>
            <h5>{user.email}</h5>
            <h5>{user.role}</h5>
          </Column>
        ) : (
          <Column lg={4} sm={4} md={4} className="p-4 text-start m-2 shadow-lg bg-secondary rounded text-white">
            <p>Loading user...</p>
          </Column>
        )}

        {DashBoardObject.map((item) => {
          const Icon = item.icon;
          return (
            <Column
              lg={4}
              md={4}
              sm={4}
              key={item.id}
              className="p-4 text-end shadow-lg m-2 bg-success rounded text-white"
            >
              <div>
                <Icon
                  size={20}
                  aria-label={item.title}
                  style={{
                    borderRadius: "4px",
                    border: "1px solid #f5f8faff",
                    padding: "1px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(item.actionUrl)}
                />
              </div>
              <h5 className="mt-2">{item.title}</h5>
              <p className="text-sm text-gray-600">{item.Description}</p>
            </Column>
          );
        })}
      </Grid>
      <PatientTable />
    </>
  );
};

export default DashBoard;
