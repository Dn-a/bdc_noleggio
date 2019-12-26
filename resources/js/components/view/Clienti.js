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
            data: {
                rows: [],
                columns: COLUMNS,
                page : 1,
                total : 10,
                perPage : 10,
                loading: false,
                selected: []
            },
            aa:"aa",
            show:false,
        };

        this._handleCloseModal = this._handleCloseModal.bind(this);
        this._handleShowModal = this._handleShowModal.bind(this);
        this._searchFieldRemoteData = this._searchFieldRemoteData.bind(this);
    }

    componentDidMount(){
        this.getRemoteData();
    }

    getRemoteData(){

        let url = this.props.url+'/clienti';
        let headers = {headers: {
            'Accept': 'application/json',
            //'Content-Type': 'application/json'
            }
        };

        axios.get(url, headers )
			.then(res => {
                let data = this.state.data;

                let remoteData = res.data;
                let pagination = remoteData.pagination;

                data.rows = remoteData.data;
                data.page = pagination.current_page;
                data.total = pagination.total;
                data.perPage = pagination.per_page;

                this.cache = {};
                this.setState({data},() =>  this.cache.rows = this.state.data.rows);

			}).catch((error) => {
				console.log(error.response.data);
				if(error.response.status==401)
					if(window.confirm('Devi effettuare il Login, Clicca ok per essere reindirizzato.'))
						window.location.href=this.props.url + '/login';
			});
    }

    _handleCloseModal () {
        this.setState({show : false});
    }
    _handleShowModal (){
        this.setState({show : true});
    }

    _searchFieldRemoteData(rows,reset){

        //console.log(rows);

        let data = this.state.data;

        if(data.rows.length >= 0){
            data.rows = rows;
            this.setState({data});
        }

        if(reset){
            //console.log(this.cache);
            data.rows = this.cache.rows;
            this.setState({data});
        }

    }

    render() {
        let urlClienti = this.props.url+'/clienti/search';
        return (
            <div className="container-fluid pl-3">
                <div className="row text-right mb-3 px-2">

                    <div className="col-md-6">
                        <SearchField url={urlClienti} callback={this._searchFieldRemoteData}  />
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
                        <InfiniteTable data={this.state.data} />
                    </div>
                </div>
            </div>
        );
    }
}
