import React, { Component , Fragment } from 'react';
import {URL_HOME} from '../Env';

import SearchField from '../utils/SearchField';
import { AddButton, Button } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import ClientiModal from '../modals/ClientiModal';
import RadioField from '../utils/form/RadioField';
import AddEditModal from '../utils/AddEditModal';


const COLUMNS = [
    { title: 'Storico', field: 'actions', render:(cell,row,handle) => {
            return(
                <Button className='btn-light' title="Modifica"
                    onClick={ () => handle(row,'storico')}
                >
                    <i className="fa fa-list" aria-hidden="true"></i>
                </Button>
            )
        }
    },
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
    { title: 'Privacy', field: 'privacy', render:
        (cell,row) => {

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
        }
    },
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
  ];

const COLUMNS_STORICO = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Video', field: 'video', style: {textTransform:'capitalize'}  },
    { title: 'Ricevute', field: 'ricevuta_noleggio', style:{fontSize:'0.9em'}, render:(cell,row) =>
        {
            if(row.ricevuta_noleggio==null && row.ricevuta_pagamento == null) return;

            let linkRicevutaNoleggio = 'data:application/pdf;base64,'+row.ricevuta_noleggio;
            let linkRicevutaPagamento = 'data:application/pdf;base64,'+row.ricevuta_pagamento;
                        
            return(
                <Fragment>
                    {row.ricevuta_noleggio !=null &&
                        <div>
                            <a className="privacy-file" href={linkRicevutaNoleggio} download='ricevuta_noleggio.pdf'>
                                <i className="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;
                                <span>ricevuta Noleggio</span>
                            </a>
                        </div>
                    }
                    {row.ricevuta_pagamento !=null && 
                        <div>
                            <a className="privacy-file" href={linkRicevutaPagamento} download='ricevuta_pagamento.pdf'>
                                <i className="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;
                                <span>ricevuta Pagamento</span>
                            </a>
                        </div>
                    }
                </Fragment>
            );

        }
    },     
    { title: 'Data Inizio', field: 'data_inizio',render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"}) },
    { title: 'Data Fine', field: 'data_fine',render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"}) },
    { title: 'Data Restituzione', field: 'data_restituzione',render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"}) },
    { title: 'Danneggiato', field:'danneggiato', render: cell => cell==0?'No':'SI'},
    { title: 'Giorni ritardo', field: 'giorni_ritardo'},
    { title: 'Costo Complessivo (compresi Extra)', field: 'prezzo_tot', render:
        (cell,row) => parseFloat(cell+row.prezzo_extra).toFixed(2) +' €'
    },
];


export default class Clienti extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            show: false,
            showStorico: false,
            clienteStorico: {id:'',nome:''},
            loader: false,
            recallSearch: false,
            reloadInfiniteTable: 0
        };

        this.home = URL_HOME;

        this._handleCloseModal = this._handleCloseModal.bind(this);
        this._handleShowModal = this._handleShowModal.bind(this);
        
        this._handleCloseStoricoModal = this._handleCloseStoricoModal.bind(this);
        this._handleShowStoricoModal = this._handleShowStoricoModal.bind(this);

        this._handleSearchFieldCallback = this._handleSearchFieldCallback.bind(this);
    }

    // New Clienti Modal
    _handleCloseModal () {
        this.setState({show : false});
    }
    _handleShowModal (){
        this.setState({show : true});
    }

    // Storico CLienti Modal
    _handleCloseStoricoModal () {
        this.setState({showStorico : false});
    }
    _handleShowStoricoModal (cliente){
        this.setState({showStorico : true, clienteStorico:cliente});
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
            if(error.response===undefined) return;
            console.error(error.response);
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

                <div className="row mb-2 px-2">
                    <div className="col-md-12 description-txt">                                   
                        <p>Solo i Responsabili o gli Amministratori del punto vendita possono assegnare il tipo di <strong>fidelizzazione</strong> che consente al cliente di ricevere uno sconto sul noleggio.</p>
                        <p>La colonna storico consente di poter visualizzare lo <strong>storico noleggi</strong> di ogni singolo cliente.</p>
                        <p>Puoi cercare un <strong>Cliente</strong> in base a : NOME | COGNOME | CF </p>
                    </div>
                </div>

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
                            onActions={(obj,type) =>{
                                //console.log(type)
                                if(type=='storico'){                                
                                    let cliente = {id: obj.id, nome: obj.nome+ ' '+ obj.cognome};
                                    this._handleShowStoricoModal(cliente);
                                }else
                                    if(confirm("Sicuro di volerlo cambiare?")){
                                        //console.log(obj)
                                        this.updateRemoteData(obj.idC,obj.idF)
                                    }
                            }}
                        />
                    </div>

                    <AddEditModal size="xl"
                            show={this.state.showStorico}
                            onHide={this._handleCloseStoricoModal}
                            confirmButton={false} 
                            title={this.state.clienteStorico.nome} type="Storico Noleggi"
                        >
                            
                            <InfiniteTable
                                id='tb-cliente-storico'
                                className='table-responsive'
                                url={this.props.url+'/noleggi'}
                                query={'only=storico&id_cliente=' + this.state.clienteStorico.id}
                                columns={COLUMNS_STORICO}
                            />

                    </AddEditModal>
                </div>
            </div>
        );
    }
}


