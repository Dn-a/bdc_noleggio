import React, { Component , Fragment } from 'react';
import axios from 'axios';

import SearchField from '../utils/SearchField';
import { Button } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import DipendentiModal from '../modals/DipendentiModal';


const COLUMNS = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Nome', field: 'nome', style: {textTransform:'capitalize'}  },
    { title: 'Cognome', field: 'cognome', style: {textTransform:'capitalize'} },
    { title: 'Matricola', field: 'matricola' },
    { title: 'Ruolo', field:'ruolo'},
    { title: 'Punto Vendita', field:'pt_vendita'},
    { title: 'Creato il', field:'created_at', render: cell => new Date(cell).toLocaleDateString("it-IT")},
  ];


export default class Dipendenti extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            show:false,
            reloadInfiniteTable:0
        };

        this.url = this.props.url+'/dipendenti';
        this._handleCloseModal = this._handleCloseModal.bind(this);
        this._handleShowModal = this._handleShowModal.bind(this);
        this._handleSearchFieldCallback = this._handleSearchFieldCallback.bind(this);
        this._handleCheckDataModal = this._handleCheckDataModal.bind(this);
        this._handleSearchFieldClick = this._handleSearchFieldClick.bind(this);
    }


    _handleCloseModal () {
        this.setState({show : false});
    }
    _handleShowModal (){
        this.setState({show : true});
    }

    _handleCheckDataModal(e){
        console.log(e.target.value);
    }

    _handleSearchFieldCallback(data,reset){

        //console.log(rows);

        let rows = this.state.rows;

        rows = data.data;
        this.setState({rows});

        if(reset){
            rows = '';
            this.setState({rows});
        }

    }

    _handleSearchFieldClick(data){
        console.log(data)
    }


    render() {

        return (
            <div className="container-fluid pl-3">
                <div className="row text-right mb-3 px-2">

                    <div className="col-md-6">
                        <SearchField showList={false} patternList={{id:'id',fields:['nome','cognome']}}
                        url={this.url+'/search'} callback={this._handleSearchFieldCallback}
                        onClick={this._handleSearchFieldClick}
                        />
                    </div>

                    <div className="col-md-6 ">
                        <Button onClick={this._handleShowModal}>
                        <i className="fa fa-plus-circle" aria-hidden="true"></i>
                        &nbsp;Nuovo Dipendente</Button>

                        <DipendentiModal url={this.props.url}
                        show={this.state.show} onHide={this._handleCloseModal}
                        callback={
                            (row) => {
                                this.setState({reloadInfiniteTable:++(this.state.reloadInfiniteTable)});
                            }
                        } />
                    </div>

                </div>
                <div className="row">
                    <div className="col-md-12">
                        <InfiniteTable
                            reload={this.state.reloadInfiniteTable}
                            url={this.url}
                            columns={COLUMNS}
                            externalRows={this.state.rows}
                            //multiSelect={true}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
