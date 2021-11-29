import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Field, Form, Formik } from 'formik';
import React, { useRef, useState } from 'react';
import { Alert, Button, FormControl, FormGroup, FormLabel, InputGroup } from 'react-bootstrap';
import Feedback from 'react-bootstrap/esm/Feedback';
import { useHistory } from 'react-router';
import * as Yup from "yup";
import { login } from '../../misc/api';
import { HttpStatusError } from '../../models/HttpStatusError';
import './LoginPage.css';

const LoginPage = () => {
  const history = useHistory();

  const [errors, setErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const passwordInputRef = useRef<HTMLInputElement>();

  const showHide = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword((prev) => !prev);
    passwordInputRef.current?.focus();
  };

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Required"),
    password: Yup.string()
      .required("Required")
  });

  const onSubmit = async (
    values: { username: string, password: string },
    { setSubmitting }
  ) => {
    setErrors([]);
    setSubmitting(true);
    try {
      await login({username: values.username, password: values.password});
      history.push(history.location.pathname.substring(0, history.location.pathname.lastIndexOf('/')) + '/my-list');
    } catch (e: any) {
      if (e instanceof HttpStatusError) {
        if (e.statusCode === 401) {
          setErrors(['The username or the password is not correct.']);
        } else {
          setErrors([`Unexpected error: ${e.statusCode} ${e.message}`]);
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <h1 className="mb-4">Login</h1>
      <div className="row">
        <div className="col-md-6">
          {errors.map((errorMessage, idx) => (
            <Alert variant="danger" key={idx}>
              {errorMessage}
            </Alert>
          ))}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting, touched, errors, isValid }) => (
              <Form noValidate>
                <FormGroup className="mb-3" controlId="formUsername">
                  <FormLabel>Username</FormLabel>
                  <Field
                    as={FormControl}
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    isInvalid={touched.username && errors.username}
                  />
                  <Feedback type="invalid">{errors.username}</Feedback>
                </FormGroup>

                <FormGroup className="mb-3">
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Field
                      as={FormControl}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      isInvalid={touched.password && errors.password}
                    />
                    <InputGroup.Text id="show-password-icon-ig" onClick={showHide}>
                      <FontAwesomeIcon 
                        icon={showPassword ?  faEyeSlash : faEye}
                      ></FontAwesomeIcon>
                    </InputGroup.Text>
                    <Feedback type="invalid">{errors.password}</Feedback>
                  </InputGroup>
                  
                </FormGroup>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;