import React from 'react';
import { Button, Form } from 'react-bootstrap';
import './RegisterPage.css';

const RegisterPage = () => {
  return (<div className="container">
  <Form>
    <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>Email address</Form.Label>
      <Form.Control type="email" placeholder="Enter email" />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" placeholder="Password" />
    </Form.Group>
    <Button variant="primary" type="submit">
      Register
    </Button>
  </Form>
</div>);
}

export default RegisterPage;