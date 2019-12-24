import React, { Component , Fragment } from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import blue from '@material-ui/core/colors/blue';

import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';

import Modal from 'react-bootstrap/Modal';

const color = blue[500];
const blueTheme = createMuiTheme({ palette: { primary: blue } });


const useStyles = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1),
    },
  }));

export default function AddEditModal(props) {
    const classes = useStyles();
    return(
        <Modal show={props.show} onHide={props.onHide} aria-labelledby="contained-modal-title-vcenter" size='lg'>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                <strong>{props.type}:</strong> {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.body}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    startIcon={<CloseIcon />}
                    onClick={props.onHide}
                >Chiudi</Button>
            </Modal.Footer>
        </Modal>
    );
}
