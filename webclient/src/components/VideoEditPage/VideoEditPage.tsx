import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { fetchVideoInfo, updateVideo } from "../../misc/api-calls";
import { GetVideoResult } from "../../models/GetVideoResult";
import './VideoEditPage.css';

type VideoParams = {
  id: string;
};

const VideoEditPage = () => {

  const { id } = useParams<VideoParams>();
  const history = useHistory();
  const [enteredTitle, setEnteredTitle] = useState<string>('');
  const [enteredDescription, setEnteredDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File>(null);

  const goBack = () => {
    history.push(history.location.pathname.substring(0, history.location.pathname.lastIndexOf('/')));
  };

  const submit = async (event: any) => {
    event.preventDefault();
    await updateVideo(id, {title: enteredTitle, description: enteredDescription}, file);
    //goBack();
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
        setEnteredTitle(result.name);
        setEnteredDescription(result.description || '');
        setImageUrl(result.imageFileName != null ? `/api/catalog/${result.fileId}/image` : null);
      })
      .catch(err => {
        console.log(err);
      });
    return;
  }, [id]);

  return (<div>
    <Form onSubmit={submit}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" onChange={(event) => setEnteredTitle(event.target.value)} value={enteredTitle} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={3} onChange={(event) => setEnteredDescription(event.target.value)} value={enteredDescription} />
      </Form.Group>
      {previewImage}
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Change image</Form.Label>
        <Form.Control type="file" accept="image/jpeg" onChange={(event) => setFile((event.target as HTMLInputElement).files[0])}/>
      </Form.Group>
      <Button type="button" variant="outline-primary" onClick={goBack} >Cancel</Button>{' '}
      <Button type="submit" variant="primary">Submit</Button>
    </Form>
    </div>);
}

export default VideoEditPage;