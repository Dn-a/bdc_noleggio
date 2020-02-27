import React, { Component , Fragment } from 'react';
import Modal from 'react-bootstrap/Modal';
import { BackButton, ConfirmButton } from './Button';

export default function AddEditModal(props) {
    //console.log(props);
    
    let confirmButton = props.confirmButton!== undefined ? props.confirmButton : true; 

    return(
        <Modal show={props.show} onHide={props.onHide} aria-labelledby="contained-modal-title-vcenter"
            size={props.size!==undefined? props.size : 'lg'}
        >
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
                
                {props.error!= null && props.error!= '' &&
                    <div className="alert alert-danger text-left" role="alert">
                        <strong>Attenzione!</strong> {props.error}
                    </div>
                }
                
                <BackButton className="btn-light" onClick={props.onHide} >Chiudi</BackButton>
                
                {confirmButton &&
                    <ConfirmButton
                        disabled={props.disabledConfirmButton!==undefined ? props.disabledConfirmButton:false}
                        className="btn-success" onClick={props.onConfirm}
                    >
                        {props.txtConfirmButton!== undefined ? props.txtConfirmButton:'Aggiungi'} <img className={"loader-2"+(props.loader==true?' d-inline-block':'')} src="../img/loader_2.gif"></img>
                    </ConfirmButton>
                }

            </Modal.Footer>
        </Modal>
    );
}
