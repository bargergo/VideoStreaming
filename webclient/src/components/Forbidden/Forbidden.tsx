import React from 'react';
import './Forbidden.css';
import { Container } from 'react-bootstrap';

const Forbidden = () => {
  return (
    <Container>
      <h1 className="mb-4">Forbidden</h1>
      <div>You don't have any permission to view this page.</div>
    </Container>
  );
};

export default Forbidden;