import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Field, Form, Formik } from 'formik';
import React, { useRef, useState } from 'react';
import { Alert, Button, FormControl, FormGroup, FormLabel, InputGroup } from 'react-bootstrap';
import Feedback from 'react-bootstrap/esm/Feedback';
import { Link } from 'react-router-dom';
import * as Yup from "yup";
import { changePassword } from '../../misc/api';
import { HttpStatusError } from '../../models/HttpStatusError';
import { ValidationErrorResponse } from '../../models/ValidationErrorResponse';
import './ChangePassword.css';

const ChangePassword = () => {

  const [errors, setErrors] = useState<(string | JSX.Element)[]>([]);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showNewPasswordAgain, setShowNewPasswordAgain] = useState<boolean>(false);
  const currentPasswordInputRef = useRef<HTMLInputElement>();
  const newPasswordInputRef = useRef<HTMLInputElement>();
  const newPasswordAgainInputRef = useRef<HTMLInputElement>();
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const showHideCurrent = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCurrentPassword((prev) => !prev);
    currentPasswordInputRef.current?.focus();
  };

  const showHideNew = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setShowNewPassword((prev) => !prev);
    newPasswordInputRef.current?.focus();
  };

  const showHideNewAgain = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setShowNewPasswordAgain((prev) => !prev);
    newPasswordAgainInputRef.current?.focus();
  };

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    newPasswordAgain: ""
  };

  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .required("Required"),
    newPassword: Yup.string()
      .required("Required")
      .min(8, "Must be at least 8 characters long.")
      .test("hasDigit", "Must contain a digit", (value) => /[0-9]/.test(value))
      .test("hasLowercase", "Must contain a lowercase letter", (value) => /[a-z]/.test(value))
      .test("hasUppercase", "Must contain a uppercase letter", (value) => /[A-Z]/.test(value))
      .notOneOf([Yup.ref('currentPassword')], "Current Password and New Password must be different!"),
    newPasswordAgain: Yup.string()
      .required("Required")
      .oneOf([Yup.ref('newPassword')], "New Password and New Password Again don't match!")
  });

  const onSubmit = async (
    values: { currentPassword: string, newPassword: string, newPasswordAgain: string },
    { setSubmitting, resetForm }
  ) => {
    setErrors([]);
    setSubmitting(true);
    setShowSuccess(false);
    try {
      const response = await changePassword(values);
      if (response["errors"] == null) {
        setShowSuccess(true);
        resetForm();
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
          setErrors([(<>Token expired, <Link to='login'>please login</Link></>)]);
        } else if (e.statusCode !== 400) {
          setErrors([`Unexpected error: ${e.statusCode} ${e.message}`]);
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  const successMessage = showSuccess ?  (
    <Alert variant="success">You have successfully changed your password.</Alert>
  ) : null;

  return (
    <div className="container">
      <h1 className="mb-4">Change Password</h1>
      <div className="row">
        <div className="col-md-6">
          {successMessage}
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

                <FormGroup className="mb-3">
                  <FormLabel>Current Password</FormLabel>
                  <InputGroup>
                    <Field
                      as={FormControl}
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      placeholder="Current Password"
                      isInvalid={touched.currentPassword && errors.currentPassword}
                    />
                    <InputGroup.Text id="show-password-icon-ig" onClick={showHideCurrent}>
                      <FontAwesomeIcon 
                        icon={showCurrentPassword ?  faEyeSlash : faEye}
                      ></FontAwesomeIcon>
                    </InputGroup.Text>
                    <Feedback type="invalid">{errors.currentPassword}</Feedback>
                  </InputGroup>
                </FormGroup>

                <FormGroup className="mb-3">
                  <FormLabel>New Password</FormLabel>
                  <InputGroup>
                    <Field
                      as={FormControl}
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="New Password"
                      isInvalid={touched.newPassword && errors.newPassword}
                    />
                    <InputGroup.Text id="show-password-icon-ig" onClick={showHideNew}>
                      <FontAwesomeIcon 
                        icon={showNewPassword ?  faEyeSlash : faEye}
                      ></FontAwesomeIcon>
                    </InputGroup.Text>
                    <Feedback type="invalid">{errors.newPassword}</Feedback>
                  </InputGroup>
                </FormGroup>

                <FormGroup className="mb-3">
                  <FormLabel>New Password Again</FormLabel>
                  <InputGroup>
                    <Field
                      as={FormControl}
                      type={showNewPasswordAgain ? "text" : "password"}
                      name="newPasswordAgain"
                      placeholder="New Password Again"
                      isInvalid={touched.newPasswordAgain && errors.newPasswordAgain}
                    />
                    <InputGroup.Text id="show-password-icon-ig" onClick={showHideNewAgain}>
                      <FontAwesomeIcon 
                        icon={showNewPasswordAgain ?  faEyeSlash : faEye}
                      ></FontAwesomeIcon>
                    </InputGroup.Text>
                    <Feedback type="invalid">{errors.newPasswordAgain}</Feedback>
                  </InputGroup>
                  
                </FormGroup>

                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  Save
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;