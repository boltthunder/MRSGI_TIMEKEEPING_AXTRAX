import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const IpPortModal = ({ show, handleClose, handleSave }) => {
  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState("8181"); // Default port

  const handleSubmit = () => {
    handleSave(
      ipAddress,
      port,
    );

    handleClose(); // close modal after save
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
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
              onChange={(e) => setIpAddress(e.target.value)}
            />
          </Form.Group>

          {/* Port */}
          {/* <Form.Group>
            <Form.Label>Port Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g. 3000"
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
          </Form.Group> */}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default IpPortModal;