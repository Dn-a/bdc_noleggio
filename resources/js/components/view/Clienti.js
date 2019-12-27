import React, { Component , Fragment } from 'react';
import axios from 'axios';

import AddEditModal from '../utils/AddEditModal';
import SearchField from '../utils/SearchField';

import { Button } from '../utils/Button';
import { Table } from '@material-ui/core';
import InfiniteTable from '../utils/InfiniteTable';


const COLUMNS = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Nome', field: 'nome' },
    { title: 'Cognome', field: 'cognome' },
    { title: 'C.F.', field: 'cf' },
    { title: 'Data di Nascita', field:'data_nascita',
        render: cell  =>  new Date(cell).toLocaleDateString("it-IT")
    },
    { title: 'Recapiti', field: 'recapiti', padding:'none' },
    { title: 'Residenza', field: 'residenza' },
    { title: 'Email', field: 'email', },
    { title: 'Fidelizzazione', field:'fidelizzazione', render: cell => cell.titolo },
    { title: 'Privacy', field: 'privacy', },
  ];


export default class Clienti extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            show:false,
        };

        this._handleCloseModal = this._handleCloseModal.bind(this);
        this._handleShowModal = this._handleShowModal.bind(this);
        this._handleSearchFieldCallback = this._handleSearchFieldCallback.bind(this);
    }


    _handleCloseModal () {
        this.setState({show : false});
    }
    _handleShowModal (){
        this.setState({show : true});
    }

    _handleSearchFieldCallback(newRows,reset){

        //console.log(rows);

        let rows = this.state.rows;

        rows = newRows;
        this.setState({rows});

        if(reset){
            rows = '';
            this.setState({rows});
        }

    }


    render() {
        let urlClienti = this.props.url+'/clienti/search';
        return (
            <div className="container-fluid pl-3">
                <div className="row text-right mb-3 px-2">

                    <div className="col-md-6">
                        <SearchField url={urlClienti} callback={this._handleSearchFieldCallback}  />
                    </div>

                    <div className="col-md-6 ">
                        <Button onClick={this._handleShowModal}>Nuovo Cliente</Button>
                        <AddEditModal show={this.state.show} onHide={this._handleCloseModal} title="Cliente" type="Nuovo" >
                            campi obbligatori
                        </AddEditModal>
                    </div>

                </div>
                <div className="row">
                    <div className="col-md-12">
                        <InfiniteTable
                            url={this.props.url+'/clienti'}
                            columns={COLUMNS}
                            externalRows={this.state.rows}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
