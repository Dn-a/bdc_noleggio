import React, { Component , Fragment } from 'react';
import {URL_HOME} from '../Env';

import SearchField from '../utils/SearchField';
import { AddButton, Button } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import ClientiModal from '../modals/ClientiModal';
import RadioField from '../utils/form/RadioField';


const COLUMNS = [
    /*{ title: '', field: 'actions', render:(cell,row,handle) => {
            return(
                <Button className='btn-light' title="Modifica"
                    onClick={ () => handle({row:row})}
                >
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                </Button>
            )
        }
    },*/
    { title: 'id', field: 'id'},
    { title: 'Nome', field: 'nome', style: {textTransform:'capitalize'}  },
    { title: 'Cognome', field: 'cognome', style: {textTransform:'capitalize'} },
    { title: 'C.F.', field: 'cf' },
    { title: 'Data di Nascita', field:'data_nascita',
        render: cell  =>  new Date(cell).toLocaleDateString("it-IT")
    },
    { title: 'Recapiti', field: 'recapiti', padding:'none' },
    { title: 'Residenza', field: 'residenza', style: {textTransform:'capitalize'} },
    { title: 'Email', field: 'email', },
    { title: 'Fidelizzazione', field:'fidelizzazione', render:
        (cell,row,handle) => {
            if(USER_CONFIG.ruolo!='Addetto'){
                let idCliente = row.id;
                //console.log(row)
                return(
                    <Fragment>
                        <RadioField name={'fidel_'+idCliente} label="Start 0%"
                            checked={row.fidelizzazione.titolo=='Start'}
                            handleChange={(e) => handle({idC:idCliente,idF:1})}
                        />
                        <RadioField name={'fidel_'+idCliente} label="Plus 10%"
                            checked={row.fidelizzazione.titolo=='Plus'}
                            handleChange={(e) => handle({idC:idCliente,idF:2})}
                        />
                        <RadioField name={'fidel_'+idCliente} label="Revolution 15%"
                            checked={row.fidelizzazione.titolo=='Revolution'}
                            handleChange={(e) => handle({idC:idCliente,idF:3})}
                        />
                    </Fragment>
                );
            }
            else
                return(cell.titolo)
        }
    },
    { title: 'Privacy', field: 'privacy', render:(cell,row) => {

        if(cell==null ) return;

        let linkSource = 'data:application/pdf;base64,'+cell;
        //let downloadLink = document.createElement("a");
        let fileName = 'privacy_'+row.nome+'_'+row.cognome+'.pdf';

        return(
            <a className="privacy-file" href={linkSource} download={fileName}>
                <i className="fa fa-file-pdf-o" aria-hidden="true"></i>
            </a>
        );
        //downloadLink.href = linkSource;
        //downloadLink.download = fileName;
        //downloadLink.click();
    } },
  ];


export default class Clienti extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            show:false,
            showEdit:false,
            loader:false,
            recallSearch:false,
            reloadInfiniteTable:0
        };

        this.home = URL_HOME;

        this._handleCloseModal = this._handleCloseModal.bind(this);
        this._handleShowModal = this._handleShowModal.bind(this);
        this._handleCloseEditModal = this._handleCloseEditModal.bind(this);
        this._handleShowEditModal = this._handleShowEditModal.bind(this);
        this._handleSearchFieldCallback = this._handleSearchFieldCallback.bind(this);
    }

    // New Clienti Modal
    _handleCloseModal () {
        this.setState({show : false});
    }
    _handleShowModal (){
        this.setState({show : true});
    }

    // Edit CLienti Modal
    _handleCloseEditModal () {
        this.setState({showEdit : false,rowEdit:{}});
    }
    _handleShowEditModal (){
        this.setState({showEdit : true});
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

    updateRemoteData(idC,idF){

        let url = this.props.url+'/clienti/'+idC;

        let headers = {headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        };

        let data = {
            id_cliente: idC,
            id_fidelizzazione : idF,
            _method:'put',
            _token : CSRF_TOKEN
        };

        //console.log(this.props.url); console.log(data);return;

        return axios.post(url,data,headers)
        .then(result => {
            //console.log(result.data);
            this.setState({recallSearch:true, reloadInfiniteTable: ++this.state.reloadInfiniteTable})
            return result;
        }).catch((error) => {
          console.error(error.response.data);
          this.setState({errorRemoteStore:error.response.status});
          if(error.response.status==401)
            if(window.confirm('Devi effettuare il Login, Clicca ok per essere reindirizzato.'))
              window.location.href=this.home + '/login';
          throw error;
        });
    }


    render() {
        let urlClienti = this.props.url+'/clienti/search';
        return (
            <div className="container-fluid pl-3">
                <div className="row mb-3 px-2">

                    <div className="col-md-6">
                        <SearchField showList={false} patternList={{id:'id',fields:{nome:[],cognome:[]}} }
                        url={urlClienti} callback={this._handleSearchFieldCallback}
                        handles={(reset,recall) =>{
                            let check = this.state.recallSearch;
                            recall(check);
                            if(check) this.state.recallSearch=false;
                        }}
                            //onClick={this._handleSearchFieldClick}
                        />
                    </div>

                    <div className="col-md-6 text-right">
                        <AddButton onClick={this._handleShowModal}>
                        <i className="fa fa-plus-circle" aria-hidden="true"></i>
                        &nbsp;Nuovo Cliente</AddButton>

                        <ClientiModal url={this.props.url}
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
                            id='tb-clienti'
                            reload={this.state.reloadInfiniteTable}
                            url={this.props.url+'/clienti'}
                            columns={COLUMNS}
                            externalRows={this.state.rows}
                            onActions={(obj) =>{
                                if(confirm("Sicuro di volerlo cambiare?")){
                                    //console.log(obj)
                                    this.updateRemoteData(obj.idC,obj.idF)
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

