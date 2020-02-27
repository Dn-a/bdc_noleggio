import React, { Component , Fragment } from 'react';

import SearchField from '../utils/SearchField';
import { Button } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import NoleggoModal from '../modals/NoleggoModal';
import RestNoleggioModal from '../modals/RestNoleggioModal';


const COLUMNS_VIDEO = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Titolo', field: 'titolo', img:'',
        render: (cell,row) => {
            
            return(
                <div style={{display: 'inline-block'}}>
                    <span style={{textTransform:'capitalize',fontWeight:'600'}}>{row['titolo']}</span>
                    <div>
                        <span>{row['durata']}</span> -&nbsp;
                        <span>{row['categoria']}</span> -&nbsp;
                        <span>{row['regista']}</span> -&nbsp;
                        <span>{new Date(row['data_uscita']).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"})}</span>
                        <div id={"accordion-"+row.id}>
                            <button className="btn btn-link pl-0" data-toggle="collapse" data-target={"#collapse-"+row.id} aria-expanded="false" aria-controls={"collapse-"+row.id}>
                                Maggiori Info
                            </button>
                            <div id={"collapse-"+row.id} className="collapse" aria-labelledby={"heading-"+row.id} data-parent={"#accordion-"+row.id}>
                                <div className="">
                                    <strong>Attori:</strong> {
                                        row.attori.map((a,k) => {
                                            return(a+' | ')
                                        })
                                    }
                                    <div className="mb-3"></div>
                                    <strong>Trama:</strong> {row.trama}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    },
    { title: 'Prezzo', field: 'prezzo', render: cell => parseFloat(cell).toFixed(2) +' €' },
    { title: 'Disponibilità', field: 'qta_disponibili',style: {textAlign:'center'},
        render: (cell,row) => {
            let dsp = row['qta_disponibili'];
            let mgz = row['qta_magazzino'];
            let css = dsp > mgz/2 ? 'more': (dsp > mgz/4 ? 'half':'less');
            return(
                <div className={'bar '+css}>
                    {dsp + ' / ' + mgz}
                </div>
            );
        }
    },
];

const MS_VIDEO = {
    disableSelect: (row) => {
        return row.qta_disponibili == 0;
    }
};

const COLUMNS_NOLEGGI = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Video', field: 'video', style: {textTransform:'capitalize'}  },
    { title: 'Cliente', field: 'cliente', style: {textTransform:'capitalize'} },
    USER_CONFIG.ruolo!='Addetto'?
        { title: 'Dipendente', field: 'dipendente', style: {textTransform:'capitalize'} }
    :
        null,
    { title: 'Data Inizio', field: 'data_inizio',render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"}) },
    { title: 'Data Fine', field: 'data_fine',render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"}) },
    { title: 'Giorni Ritardo', field: 'giorni_ritardo', render: (cell) => <span style={{color:cell==0?'':'red'}}>{cell}</span>},
    { title: 'Importo Complessivo', field: 'prezzo_tot', render: cell => parseFloat(cell).toFixed(2) +' €'},
].map((a) => { if(a!=null) return a; return false; } );

const COLUMNS_STORICO = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Video', field: 'video', style: {textTransform:'capitalize'}  },
    { title: 'Cliente', field: 'cliente', style: {textTransform:'capitalize'} },
    USER_CONFIG.ruolo!='Addetto'?
        { title: 'Dipendente', field: 'dipendente', style: {textTransform:'capitalize'} }
    :
        null,
    { title: 'Data Inizio', field: 'data_inizio',render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"}) },
    { title: 'Data Fine', field: 'data_fine',render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"}) },
    { title: 'Data Restituzione', field: 'data_restituzione',render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"}) },
    { title: 'Danneggiato', field:'danneggiato', render: cell => cell==0?'No':'SI'},
    { title: 'Giorni ritardo', field: 'giorni_ritardo'},
    { title: 'Costo Complessivo (compresi Extra)', field: 'prezzo_tot', render:
    (cell,row) => parseFloat(cell+row.prezzo_extra).toFixed(2) +' €'},
].map((a) => { if(a!=null) return a; return false; } );

const COLUMNS_RICEVUTE = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Tipo', field: 'tipo', style: {textTransform:'capitalize'}  },
    { title: 'Cliente', field: 'cliente', style: {textTransform:'capitalize'}  },
    USER_CONFIG.ruolo!='Addetto'?
        { title: 'Dipendente', field: 'dipendente', style: {textTransform:'capitalize'} }
    :
        null,
    //{ title: 'Prezzo Extra', field: 'prezzo_extra', render: cell => parseFloat(cell).toFixed(2) +' €'},
    { title: 'Documento', field: 'pdf', render:(cell,row) =>
        {
            if(cell==null ) return;

            let linkSource = 'data:application/pdf;base64,'+cell;
            //let downloadLink = document.createElement("a");
            let fileName = 'ricevuta_'+row.tipo+'.pdf';

            return(
                <a className="privacy-file" href={linkSource} download={fileName}>
                    <i className="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;
                    <span>ricevuta {row.tipo}</span>
                </a>
            );
            //downloadLink.href = linkSource;
            //downloadLink.download = fileName;
            //downloadLink.click();
        }
    },
    { title: 'Data Creazione', field: 'data_creazione', render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"}) }
].map((a) => { if(a!=null) return a; return false; } );


export default class Noleggi extends Component {

    constructor(props){
        super(props);

        this.state = {
            rowsVideo: '',
            rowsNoleggi: '',
            rowsStorico: '',
            rowsRicevute: '',
            showNoleggio:false,
            showRestituzione:false,
            selectedListVideo: [],// id dei video selezionati
            rowsSelectedListVideo: [],// row contenenti tutti i campi dei video selezionati - usato nel NOleggioMOdal
            selectedListNoleggi: [],
            rowsSelectedListNoleggi: [],// RestituzioneNoleggioModal
            recallSearch:false,
            recallSearchNoleggi:false,
            reloadInfiniteTable:0
        };

        this.url = this.props.url+'/noleggi';
        this._handleCloseNoleggioModal = this._handleCloseNoleggioModal.bind(this);
        this._handleShowNoleggioModal = this._handleShowNoleggioModal.bind(this);
        this._handleCloseRestituzioneModal = this._handleCloseRestituzioneModal.bind(this);
        this._handleShowRestituzioneModal = this._handleShowRestituzioneModal.bind(this);
        this._handleSearchFieldCallback = this._handleSearchFieldCallback.bind(this);
        this._handleSearchFieldNoleggiCallback = this._handleSearchFieldNoleggiCallback.bind(this);
        this._handleSearchFieldStoricoCallback = this._handleSearchFieldStoricoCallback.bind(this);
        this._handleSearchFieldRicevuteCallback = this._handleSearchFieldRicevuteCallback.bind(this);
    }


    _handleCloseNoleggioModal () {
        this.setState({showNoleggio : false});
    }
    _handleShowNoleggioModal (){
        this.setState({showNoleggio : true});
    }

    _handleCloseRestituzioneModal () {
        this.setState({showRestituzione : false});
    }
    _handleShowRestituzioneModal (){
        this.setState({showRestituzione : true});
    }

    _handleSearchFieldCallback(data,reset){

        //console.log(data);

        let rowsVideo = this.state.rowsVideo;

        if(reset){
            // al momento unica soluzione per notificare a InfinityTable che externalRow è vuoto
            rowsVideo = '';
            this.setState({rowsVideo});
        }else{
            rowsVideo = data.data;
            this.setState({rowsVideo});
        }

    }

    _handleSearchFieldNoleggiCallback(data,reset){

        //console.log(rows);

        let rowsNoleggi = this.state.rowsNoleggi;

        if(reset){
            rowsNoleggi = '';
            this.setState({rowsNoleggi});
        }else{
            rowsNoleggi = data.data;
            this.setState({rowsNoleggi});
        }

    }

    _handleSearchFieldStoricoCallback(data,reset){

        //console.log(rows);

        let rowsStorico = this.state.rowsStorico;

        if(reset){
            rowsStorico = '';
            this.setState({rowsStorico});
        }else{
            rowsStorico = data.data;
            this.setState({rowsStorico});
        }

    }

    _handleSearchFieldRicevuteCallback(data,reset){

        //console.log(data);

        let rowsRicevute = this.state.rowsRicevute;

        if(reset){
            rowsRicevute = '';
            this.setState({rowsRicevute});
        }else{
            rowsRicevute = data.data;
            this.setState({rowsRicevute});
        }

    }


    render() {

        let urlVideo = this.props.url+'/video';
        let urlRicevute = this.props.url+'/ricevute';

        return (
            <Fragment>
                <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">
                        Noleggia un Video
                    </a>
                    <a className="nav-item nav-link" id="nav-caricati-tab" data-toggle="tab" href="#nav-caricati" role="tab" aria-controls="nav-caricati" aria-selected="false">
                        Noleggi Attivi
                    </a>
                    <a className="nav-item nav-link" id="nav-storico-tab" data-toggle="tab" href="#nav-storico" role="tab" aria-controls="nav-storico" aria-selected="false">
                        Storico Noleggi
                    </a>
                    <a className="nav-item nav-link" id="nav-ricevute-tab" data-toggle="tab" href="#nav-ricevute" role="tab" aria-controls="nav-ricevute" aria-selected="false">
                        Ricevute
                    </a>
                </div>
                </nav>

                <div className="tab-content pt-4" id="nav-tabContent">

                    <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">

                        <div className="container-fluid pl-3">
                            <div className="row mb-3 px-2">

                                    <div className="col-md-6">
                                        <SearchField key="s-video" showList={false}
                                        query='only=noleggi'
                                        url={urlVideo+'/search'}
                                        callback={this._handleSearchFieldCallback}
                                        handles={(reset,recall) =>{
                                            let check = this.state.recallSearch;
                                            recall(check);
                                            if(check) this.state.recallSearch=false;
                                        }}
                                        />
                                    </div>

                                    <div className="col-md-6 text-right">
                                        <Button className="btn-success mr-3"
                                        disabled={this.state.selectedListVideo.length>0?false:true}
                                        onClick={this._handleShowNoleggioModal}>
                                        <i className="fa fa-upload" aria-hidden="true"></i>
                                        &nbsp;Noleggia</Button>


                                        <NoleggoModal url={this.props.url}
                                            externalRows={this.state.rowsSelectedListVideo}
                                            show={this.state.showNoleggio} onHide={this._handleCloseNoleggioModal}
                                            callback={
                                                (row) => {
                                                    this.setState({recallSearch:true,reloadInfiniteTable:++(this.state.reloadInfiniteTable)});
                                                }
                                            }
                                        />
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <InfiniteTable key="video"
                                            id="video"
                                            reload={this.state.reloadInfiniteTable}
                                            url={urlVideo}
                                            query='only=noleggi'
                                            columns={COLUMNS_VIDEO}
                                            externalRows={this.state.rowsVideo}
                                            multiSelect={true}
                                            multiSelectSetting={MS_VIDEO}
                                            selectedList={this.state.selectedListVideo}
                                            multiSelectCallback={ (list,row) =>{
                                                this.setState({selectedListVideo:list, rowsSelectedListVideo:row})
                                                //console.log(row)
                                            }}
                                        />
                                    </div>
                                </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="nav-caricati" role="tabpanel" aria-labelledby="nav-caricati-tab">
                        <div className="container-fluid pl-3">
                            <div className="row mb-3 px-2">

                                    <div className="col-md-6">
                                        <SearchField key="s-noleggi" showList={false}
                                        url={this.url+'/search'} callback={this._handleSearchFieldNoleggiCallback}
                                        handles={(reset,recall) =>{
                                            let check = this.state.recallSearchNoleggi;
                                            recall(check);
                                            if(check) this.state.recallSearchNoleggi=false;
                                        }}
                                        />
                                    </div>

                                    <div className="col-md-6 text-right">

                                        <Button className="btn-warning mr-3"
                                        disabled={this.state.selectedListNoleggi.length>0?false:true}
                                        onClick={this._handleShowRestituzioneModal}
                                        >
                                        <i className="fa fa-download" aria-hidden="true"></i>
                                        &nbsp;Restituzione</Button>

                                        <RestNoleggioModal
                                            url={this.props.url}
                                            externalRows={this.state.rowsSelectedListNoleggi}
                                            show={this.state.showRestituzione} onHide={this._handleCloseRestituzioneModal}
                                            callback={
                                                (row) => {
                                                    this.setState({
                                                        selectedListNoleggi: [],
                                                        rowsSelectedListNoleggi: [],
                                                        recallSearchNoleggi:true,
                                                        reloadInfiniteTable:++(this.state.reloadInfiniteTable)
                                                    });
                                                }
                                            }
                                        />

                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <InfiniteTable key="noleggi"
                                            id="tb-noleggi"
                                            reload={this.state.reloadInfiniteTable}
                                            url={this.url}
                                            columns={COLUMNS_NOLEGGI}
                                            externalRows={this.state.rowsNoleggi}
                                            multiSelect={true}
                                            selectedList={this.state.selectedListNoleggi}
                                            multiSelectCallback={ (list,rows) =>{
                                                let idCliente = rows[0]!==undefined ? rows[0].id_cliente:null;
                                                let lst = [];
                                                let rw = [];
                                                rows.map((row,k) =>{
                                                    if(row.id_cliente!=idCliente)
                                                        return false;
                                                    lst[k] = row.id;
                                                    rw[k] = row;
                                                })
                                                //console.log(lst);
                                                this.setState({selectedListNoleggi:lst, rowsSelectedListNoleggi:rw})
                                                //console.log(list)
                                            }}
                                        />
                                    </div>
                                </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="nav-storico" role="tabpanel" aria-labelledby="nav-storico-tab">
                        <div className="container-fluid pl-3">
                            <div className="row mb-3 px-2">

                                    <div className="col-md-6">
                                        <SearchField key="s-storico" showList={false}
                                        query='only=storico'
                                        url={this.url+'/search'}
                                        callback={this._handleSearchFieldStoricoCallback}
                                        />
                                    </div>



                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <InfiniteTable key="storico"
                                            id="tb-storico"
                                            reload={this.state.reloadInfiniteTable}
                                            query='only=storico'
                                            url={this.url}
                                            columns={COLUMNS_STORICO}
                                            externalRows={this.state.rowsStorico}
                                            multiSelect={false}
                                        />
                                    </div>
                                </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="nav-ricevute" role="tabpanel" aria-labelledby="nav-ricevute-tab">
                        <div className="container-fluid pl-3">
                            <div className="row mb-3 px-2">

                                    <div className="col-md-6">
                                        <SearchField key="s-ricevute" showList={false}
                                        url={urlRicevute+'/search'}
                                        callback={this._handleSearchFieldRicevuteCallback}
                                        />
                                    </div>



                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <InfiniteTable key="ricevute"
                                            id="tb-ricevute"
                                            reload={this.state.reloadInfiniteTable}
                                            url={urlRicevute}
                                            columns={COLUMNS_RICEVUTE}
                                            externalRows={this.state.rowsRicevute}
                                            multiSelect={false}
                                        />
                                    </div>
                                </div>
                        </div>
                    </div>

                </div>

            </Fragment>

        );
    }
}
