import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Alert, Button, Container, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import Feedback from "react-bootstrap/esm/Feedback";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";
import { fetchVideoInfo, updateVideo } from "../../misc/api";
import { GetVideoResult } from "../../models/GetVideoResult";
import { HttpStatusError } from "../../models/HttpStatusError";
import FileUploadButton from "../Shared/FileUploadButton/FileUploadButton";
import './VideoEditPage.css';

type VideoParams = {
  id: string;
};

const VideoEditPage = () => {

  const [errors, setErrors] = useState<string[]>([]);
  const { id } = useParams<VideoParams>();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File>(null);
  const [initialValue, setInitialValue] = useState<{title: string, description: string} | null>({title: '', description: ''});

  const validationSchema = Yup.object({
    title: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
  });

  const goBack = () => {
    history.push(history.location.pathname.substring(0, history.location.pathname.lastIndexOf('/')));
  };

  const onSubmit = async (
    values: { title: string; description: string },
    { setSubmitting }
  ) => {
    setErrors([]);
    setSubmitting(true);
    try {
      await updateVideo(id, {title: values.title, description: values.description}, file);
      goBack();
    } catch(e: any) {
      if (e instanceof HttpStatusError) {
        setErrors([`Unexpected error: ${e.statusCode} ${e.message}`]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const previewImageSrc = file != null
    ? URL.createObjectURL(file)
    : imageUrl != null
      ? imageUrl
      : null;
  const previewImage = previewImageSrc != null
    ? (<img src={previewImageSrc} alt="preview" className="col-6 p-0"/>)
    : null;

  useEffect(() => {
    fetchVideoInfo(id)
      .then((result: GetVideoResult) => {
        setInitialValue({title: result.name, description: result.description || ''});
        setImageUrl(result.imageFileName != null ? `/api/catalog/public/${result.fileId}/image` : null);
      })
      .catch(err => {
        console.log(err);
      });
    return () => {};
  }, [id]);

  return (
    <Container>
      <h1 className="mb-4">Edit Video</h1>
      {errors.map((errorMessage, idx) => (
        <Alert variant="danger" key={idx}>
          {errorMessage}
        </Alert>
      ))}
      <Formik
        enableReinitialize
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form noValidate>
            <FormGroup className="mb-3" controlId="title">
              <FormLabel>Title</FormLabel>
              <Field
                as={FormControl}
                type="text"
                name="title"
                isInvalid={touched.title && errors.title}
              />
              <Feedback type="invalid">{errors.title}</Feedback>
            </FormGroup>
            <FormGroup className="mb-3" controlId="description">
              <FormLabel>Description</FormLabel>
              <Field
                as="textarea"
                className={touched.description && errors.description ? "form-control is-invalid" : "form-control"}
                type="text"
                rows={3}
                name="description"
              />
              <Feedback type="invalid">{errors.description}</Feedback>
            </FormGroup>
            <FormGroup controlId="formFile" className="mb-3 mt-3">
              <FormLabel>Change image</FormLabel>
              <div>
                <FileUploadButton
                  text={file != null ? file.name : "Browse"}
                  accept="image/jpeg"
                  fileSelected={file != null}
                  onFileInputChanged={(event) =>
                    setFile((event.target as HTMLInputElement).files[0])
                  }
                />
                <div className="mt-3">{previewImage}</div>
              </div>
            </FormGroup>
            <Button type="button" variant="outline-primary" onClick={goBack}>
              Cancel
            </Button>{" "}
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default VideoEditPage;