import React, { Component , Fragment } from 'react';
import Modal from 'react-bootstrap/Modal';
import { BackButton } from './Button';

export default function AddEditModal(props) {
    //console.log(props);
    return(
        <Modal show={props.show} onHide={props.onHide} aria-labelledby="contained-modal-title-vcenter" size='lg'>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                <strong>{props.type}:</strong> {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    props.children!== null && props.children
                }
            </Modal.Body>
            <Modal.Footer>
                <BackButton onClick={props.onHide} >Chiudi</BackButton>
            </Modal.Footer>
        </Modal>
    );
}
