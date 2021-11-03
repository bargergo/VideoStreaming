import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import HttpServiceContext from '../../misc/HttpServiceContext';
import { HttpStatusError } from '../../models/HttpStatusError';
import './LoginPage.css';

const LoginPage = () => {

  const httpService = useContext(HttpServiceContext);
  const history = useHistory();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    setError(null);
    event.preventDefault();
    try {
      await httpService.login({username: username, password: password});
      history.push(history.location.pathname.substring(0, history.location.pathname.lastIndexOf('/')) + '/my-list');
    } catch (e: any) {
      if (e instanceof HttpStatusError) {
        if (e.statusCode === 401) {
          setError('The username or the password is not correct.');
        } else {
          setError(`Unexpected error: ${e.statusCode} ${e.message}`);
        }
      }
    }
  };

  const onUsernameChanged = (event: ChangeEvent) => {
    setUsername((event.target as HTMLInputElement).value)
  };

  const onPasswordChanged = (event: ChangeEvent) => {
    setPassword((event.target as HTMLInputElement).value)
  };

  const errorMessage = error != null ? (
    <Alert variant="danger">{error}</Alert>
  ) : null;

  return (
  <div className="container">
    <div className="col-6 mx-auto">
      {errorMessage}
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={onUsernameChanged} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={onPasswordChanged} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  </div>
  );
}

export default LoginPage;