import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const IpPortModal = ({ show, handleClose, handleSave }) => {
  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState("8181"); // Default port
  const [storeName, setStoreName] = useState("");
  const [validated, setValidated] = useState(false);
  const ipRegex =
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
  const [isValid, setIsValid] = useState(true);
  const handleSubmit = () => {
    if (storeName.trim() === "") {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Store name is required",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }
    handleSave(ipAddress, port, storeName);

    handleClose(); // close modal after save
  };

  const handleChange = (e) => {
    const value = e.target.value;

    setIpAddress(value);

    // validate IP
    setIsValid(ipRegex.test(value));
  };
  const handleStoreName = (e) => {
    const value = e.target.value;
    return setStoreName(value);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Server Configuration</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* IP Address */}
          <Form.Group className="mb-3">
            <Form.Label> Server IP Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. 192.168.1.1"
              value={ipAddress}
              onChange={handleChange}
              isInvalid={!isValid}
            />
          </Form.Group>

          {/* Port */}
          <Form.Group>
            <Form.Label>STORE NAME</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Store 1"
              value={storeName}
              required
              onChange={(e) => handleStoreName(e)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        {/* <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button> */}
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default IpPortModal;
