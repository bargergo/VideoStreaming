import React, { FormEvent, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useHistory } from "react-router";
import { register } from "../../misc/api";
import { HttpStatusError } from "../../models/HttpStatusError";
import { ValidationErrorResponse } from "../../models/ValidationErrorResponse";
import "./RegisterPage.css";

const RegisterPage = () => {

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const history = useHistory();

  const onSubmit = async (event: FormEvent) => {
    setErrors([]);
    event.preventDefault();
    try {
      const response = await register({ username: username, password: password });
      if (response['errors'] == null) {
        history.push('./login', { fromRegistration: true });
      } else {
        const validationErrorResponse = response as ValidationErrorResponse;
        const validationErrors: string[] = [];
        for (const key in validationErrorResponse.errors) {
          validationErrors.push(...validationErrorResponse.errors[key]);
        }
        setErrors(validationErrors);
      }
    } catch (e: any) {
      if (e instanceof HttpStatusError) {
        if (e.statusCode === 401) {
          setErrors(["The username is already taken."]);
        } else if (e.statusCode === 400) {

        } else {
          setErrors([`Unexpected error: ${e.statusCode} ${e.message}`]);
        }
      }
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4">Register</h1>
      <div className="col-6 pl-0">
        {errors.map((errorMessage, idx) => <Alert variant="danger" key={idx}>{errorMessage}</Alert>)}
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              onChange={(event) => setUsername(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
