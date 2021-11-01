import React, { FormEvent, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { register } from '../../misc/api-calls';
import './RegisterPage.css';

const RegisterPage = () => {

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    register({username: username, password: password});
  };

  return (<div className="container">
  <Form onSubmit={onSubmit}>
    <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>Email address</Form.Label>
      <Form.Control type="email" placeholder="Enter email" onChange={(event) => setUsername(event.target.value)} />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
    </Form.Group>
    <Button variant="primary" type="submit">
      Register
    </Button>
  </Form>
</div>);
}

export default RegisterPage;