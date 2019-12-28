import React, { Component , Fragment } from 'react';
import axios from 'axios';

import SearchField from '../utils/SearchField';
import { Button } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import ClientiModal from '../modals/ClientiModal';


const COLUMNS = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Nome', field: 'nome', style: {textTransform:'capitalize'}  },
    { title: 'Cognome', field: 'cognome', style: {textTransform:'capitalize'} },
    { title: 'C.F.', field: 'cf' },
    { title: 'Data di Nascita', field:'data_nascita',
        render: cell  =>  new Date(cell).toLocaleDateString("it-IT")
    },
    { title: 'Recapiti', field: 'recapiti', padding:'none' },
    { title: 'Residenza', field: 'residenza', style: {textTransform:'capitalize'} },
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
        let urlClienti = this.props.url+'/clienti/search';
        return (
            <div className="container-fluid pl-3">
                <div className="row text-right mb-3 px-2">

                    <div className="col-md-6">
                        <SearchField showList={false} patternList={{id:'id',fields:['nome','cognome']}}
                        url={urlClienti} callback={this._handleSearchFieldCallback}
                        onClick={this._handleSearchFieldClick}
                        />
                    </div>

                    <div className="col-md-6 ">
                        <Button onClick={this._handleShowModal}>Nuovo Cliente</Button>

                        <ClientiModal url={this.props.url}
                        show={this.state.show} onHide={this._handleCloseModal} />
                    </div>

                </div>
                <div className="row">
                    <div className="col-md-12">
                        <InfiniteTable
                            url={this.props.url+'/clienti'}
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
