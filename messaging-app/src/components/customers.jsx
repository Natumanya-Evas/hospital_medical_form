import { Column, Grid } from '@carbon/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const Customers = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:4000/");
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handlePerson = (id) => {
        navigate(`/message/${id}`);
    };

    return (
        <Grid style={{ marginTop: '4rem', gap: '1rem' }}>
            {users.map((user) => (
                <Column
                    key={user.id}
                    lg={4}
                    md={6}
                    sm={4}
                    style={{
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        backgroundColor: '#fff',
                        padding: '1rem',
                    }}
                    onClick={() => handlePerson(user.id)}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    }}
                >
                    {/* Header: Avatar + Name */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <div
                            style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                backgroundColor: 'slateblue',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                marginRight: '1rem',
                                textTransform: 'uppercase',
                            }}
                        >
                            {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#333' }}>
                            {user.first_name} {user.middle_name} {user.last_name}
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div style={{ fontSize: '0.875rem', color: '#555', lineHeight: '1.4' }}>
                        <p><strong>Account:</strong> {user.account_number}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone_number}</p>
                        <p><strong>DOB:</strong> {user.date_of_birth}</p>
                    </div>
                </Column>
            ))}
        </Grid>
    );
};

export default Customers;
