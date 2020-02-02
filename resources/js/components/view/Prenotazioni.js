import React, { Component , Fragment } from 'react';

import SearchField from '../utils/SearchField';
import { Button } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import NoleggoModal from '../modals/NoleggoModal';
import PrenotazioneModal from '../modals/PrenotazioneModal';


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
                        <span>{row['regista']}</span>
                    </div>
                </div>
            );
        }
    },
    { title: 'Prezzo', field: 'prezzo', render: cell => parseFloat(cell).toFixed(2) +' €' },
    { title: 'Prenotazioni', field: 'numero_prenotazioni'},
    { title: 'Data Uscita', field: 'data_uscita',render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"}) },
];

const MS_VIDEO = {
    disableSelect: (row) => {
        return row.qta_disponibili == 0;
    }
};

const COLUMNS_PRENOTAZIONI = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Video', field: 'video', style: {textTransform:'capitalize'}  },
    { title: 'Cliente', field: 'cliente', style: {textTransform:'capitalize'} },
    USER_CONFIG.ruolo!='Addetto'?
        { title: 'Dipendente', field: 'dipendente', style: {textTransform:'capitalize'} }
    :
        null,
    { title: 'Prezzo', field: 'prezzo', render: cell => parseFloat(cell).toFixed(2) +' €'},
    { title: 'Data Uscita', field: 'data_uscita',render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"}) },
    { title: 'Data Prenotazione', field: 'data_prenotazione',render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"}) },
].map((a) => { if(a!=null) return a; return false; } );

const COLUMNS_RITIRATI = [
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
    { title: 'Giorni ritardo', field: 'giorni_ritardo'},
    { title: 'Costo Complessivo (compresi Extra)', field: 'prezzo_tot', render:
    (cell,row) => parseFloat(cell+row.prezzo_extra).toFixed(2) +' €'},
].map((a) => { if(a!=null) return a; return false; } );


export default class Noleggi extends Component {

    constructor(props){
        super(props);

        this.state = {
            rowsVideo: '',
            rowsPrenotazioni: '',
            rowsStorico: '',
            rowsRicevute: '',
            showPrenotazione:false,
            selectedListVideo: [],// id dei video selezionati
            rowsSelectedListVideo: [],// row contenenti tutti i campi dei video selezionati - usato nel NOleggioMOdal
            selectedListPrenotazioni: [],// id dei video selezionati
            rowsSelectedListPrenotazioni: [],
            reloadInfiniteTable:0
        };

        this.url = this.props.url+'/prenotazioni';
        this._handleClosePrenotazioneModal = this._handleClosePrenotazioneModal.bind(this);
        this._handleShowPrenotazioneModal = this._handleShowPrenotazioneModal.bind(this);

        this._handleSearchFieldCallback = this._handleSearchFieldCallback.bind(this);
        this._handleSearchFieldPrenotazioneCallback = this._handleSearchFieldPrenotazioneCallback.bind(this);

    }


    _handleClosePrenotazioneModal () {
        this.setState({showPrenotazione : false});
    }
    _handleShowPrenotazioneModal (){
        this.setState({showPrenotazione : true});
    }


    _handleCaricoVideo(e){
        if(confirm("Confermi il carico dei video selezionati?"))
        return;
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

    _handleSearchFieldPrenotazioneCallback(data,reset){

        //console.log(rows);

        let rowsPrenotazioni = this.state.rowsPrenotazioni;

        if(reset){
            rowsPrenotazioni = '';
            this.setState({rowsPrenotazioni});
        }else{
            rowsPrenotazioni = data.data;
            this.setState({rowsPrenotazioni});
        }

    }


    render() {

        let urlVideo = this.props.url+'/video';

        return (
            <Fragment>
                <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">
                        Prenota un Video
                    </a>
                    <a className="nav-item nav-link" id="nav-prenotati-tab" data-toggle="tab" href="#nav-prenotati" role="tab" aria-controls="nav-prenotati" aria-selected="false">
                        Prenotazioni Attive
                    </a>
                    <a className="nav-item nav-link" id="nav-storico-tab" data-toggle="tab" href="#nav-storico" role="tab" aria-controls="nav-storico" aria-selected="false">
                        Ritirati
                    </a>

                </div>
                </nav>

                <div className="tab-content pt-4" id="nav-tabContent">

                    <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">

                        <div className="container-fluid pl-3">
                            <div className="row mb-3 px-2">

                                    <div className="col-md-6">
                                        <SearchField key="s-video" showList={false}
                                        query='only=in_uscita'
                                        url={urlVideo+'/search'}
                                        callback={this._handleSearchFieldCallback}
                                        />
                                    </div>

                                    <div className="col-md-6 text-right">
                                        <Button className="btn-success mr-3"
                                        disabled={this.state.selectedListVideo.length>0?false:true}
                                        onClick={this._handleShowPrenotazioneModal}>
                                        <i className="fa fa-upload" aria-hidden="true"></i>
                                        &nbsp;Prenota</Button>


                                        <PrenotazioneModal url={this.props.url}
                                            externalRows={this.state.rowsSelectedListVideo}
                                            show={this.state.showPrenotazione} onHide={this._handleClosePrenotazioneModal}
                                            callback={
                                                (row) => {
                                                    this.setState({reloadInfiniteTable:++(this.state.reloadInfiniteTable)});
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
                                            query='only=in_uscita'
                                            columns={COLUMNS_VIDEO}
                                            externalRows={this.state.rowsVideo}
                                            multiSelect={true}
                                            //multiSelectSetting={MS_VIDEO}
                                            selectedList={this.state.selectedListVideo}
                                            multiSelectCallback={ (list,row) =>{
                                                //console.log(list)
                                                this.setState({selectedListVideo:list, rowsSelectedListVideo:row})
                                            }}
                                        />
                                    </div>
                                </div>
                        </div>
                    </div>

                    <div className="tab-pane fade" id="nav-prenotati" role="tabpanel" aria-labelledby="nav-prenotati-tab">

                        <div className="container-fluid pl-3">
                            <div className="row mb-3 px-2">

                                    <div className="col-md-6">
                                        <SearchField key="s-prenotati" showList={false}
                                        url={this.url+'/search'}
                                        callback={this._handleSearchFieldPrenotazioneCallback}
                                        />
                                    </div>

                                    <div className="col-md-6 text-right">
                                        <Button className="btn-success mr-3"
                                        disabled={this.state.selectedListVideo.length>0?false:true}
                                        onClick={this._handleShowPrenotazioneModal}>
                                        <i className="fa fa-upload" aria-hidden="true"></i>
                                        &nbsp;Prenota</Button>

                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <InfiniteTable key="prenotati"
                                            id="prenotati"
                                            reload={this.state.reloadInfiniteTable}
                                            url={this.url}
                                            columns={COLUMNS_PRENOTAZIONI}
                                            externalRows={this.state.rowsPrenotazioni}
                                            multiSelect={true}
                                            //multiSelectSetting={MS_VIDEO}
                                            selectedList={this.state.selectedListPrenotazioni}
                                            multiSelectCallback={ (list,row) =>{
                                                //console.log(list)
                                                this.setState({selectedListPrenotazioni:list, rowsSelectedListPrenotazioni:row})
                                            }}
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
