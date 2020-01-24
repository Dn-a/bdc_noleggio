import React, { Component , Fragment } from 'react';

import SearchField from '../utils/SearchField';
import { Button } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import NoleggiModal from '../modals/NoleggiModal';


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
            let css = dsp > 20 ? 'more': (dsp > 5 ? 'half':'less');
            return(
                <div className={'bar '+css}>
                    {dsp + ' / ' + mgz}
                </div>
            );
        }
    },
  ];

const COLUMNS_NOLEGGI = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Video', field: 'video', style: {textTransform:'capitalize'}  },
    { title: 'Cliente', field: 'cliente', style: {textTransform:'capitalize'} },
    { title: 'Dipendente', field: 'dipendente', style: {textTransform:'capitalize'} },
    { title: 'Tariffa', field: 'tariffa',style: {textTransform:'capitalize'} },
    { title: 'Data Inizio', field: 'data_inizio',render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"2-digit",month:"2-digit", day:"2-digit"}) },
    { title: 'Data Fine', field: 'data_fine',render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"2-digit",month:"2-digit", day:"2-digit"}) },
];


export default class Noleggi extends Component {

    constructor(props){
        super(props);

        this.state = {
            rowsVideo: '',
            rowsNoleggi: '',
            show:false,
            selectedListVideo: [],
            rowsSelectedListVideo: [],
            selectedListNoleggi: [],
            reloadInfiniteTable:0
        };

        this.url = this.props.url+'/noleggi';
        this._handleCloseModal = this._handleCloseModal.bind(this);
        this._handleShowModal = this._handleShowModal.bind(this);
        this._handleSearchFieldCallback = this._handleSearchFieldCallback.bind(this);
        this._handleSearchFieldNoleggiCallback = this._handleSearchFieldNoleggiCallback.bind(this);
        this._handleCaricoVideo = this._handleCaricoVideo.bind(this);
    }


    _handleCloseModal () {
        this.setState({show : false});
    }
    _handleShowModal (){
        this.setState({show : true});
    }

    _handleCaricoVideo(e){
        if(confirm("Confermi il carico dei video selezionati?"))
        return;
    }


    _handleSearchFieldCallback(data,reset){

        //console.log(data);

        let rowsVideo = this.state.rowsVideo;

        rowsVideo = data.data;
        this.setState({rowsVideo});

        if(reset){
            rowsVideo = '';
            this.setState({rowsVideo});
        }

    }

    _handleSearchFieldNoleggiCallback(data,reset){

        //console.log(rows);

        let rowsNoleggi = this.state.rowsNoleggi;

        rowsNoleggi = data.data;
        this.setState({rowsNoleggi});

        if(reset){
            rowsNoleggi = '';
            this.setState({rowsNoleggi});
        }

    }


    render() {

        let urlVideo = this.props.url+'/video';

        return (
            <Fragment>
                <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">
                        Noleggia un Video
                    </a>
                    <a className="nav-item nav-link" id="nav-caricati-tab" data-toggle="tab" href="#nav-caricati" role="tab" aria-controls="nav-caricati" aria-selected="false">
                        Video Noleggiati
                    </a>
                </div>
                </nav>

                <div className="tab-content pt-4" id="nav-tabContent">

                    <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">

                        <div className="container-fluid pl-3">
                            <div className="row mb-3 px-2">

                                    <div className="col-md-6">
                                        <SearchField key="s-video" showList={false} patternList={{id:'id',fields:['nome','cognome']}}
                                        url={urlVideo+'/search-noleggi'} callback={this._handleSearchFieldCallback}
                                        />
                                    </div>

                                    <div className="col-md-6 text-right">
                                        <Button className="btn-success mr-3" disabled={this.state.selectedListVideo.length>0?false:true} onClick={this._handleShowModal}>
                                        <i className="fa fa-upload" aria-hidden="true"></i>
                                        &nbsp;Noleggia</Button>


                                        <NoleggiModal url={this.props.url}
                                            custom={this.state.rowsSelectedListVideo}
                                            show={this.state.show} onHide={this._handleCloseModal}
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
                                            columns={COLUMNS_VIDEO}
                                            externalRows={this.state.rowsVideo}
                                            multiSelect={true}
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
                                        <SearchField key="s-noleggi" showList={false} patternList={{id:'id',fields:['nome','cognome']}}
                                        url={this.url+'/search'} callback={this._handleSearchFieldCallback}
                                        />
                                    </div>

                                    <div className="col-md-6 text-right">
                                        <Button className="btn-warning mr-3" disabled={this.state.selectedListNoleggi.length>0?false:true} onClick={this._handleCaricoVideo}>
                                        <i className="fa fa-download" aria-hidden="true"></i>
                                        &nbsp;Restituzione</Button>


                                        <NoleggiModal url={this.props.url}
                                        //show={this.state.show} onHide={this._handleCloseModal}
                                        callback={
                                            (row) => {
                                                this.setState({reloadInfiniteTable:++(this.state.reloadInfiniteTable)});
                                            }
                                        } />
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <InfiniteTable key="noleggi"
                                            id="noleggi"
                                            reload={this.state.reloadInfiniteTable}
                                            url={this.url}
                                            columns={COLUMNS_NOLEGGI}
                                            externalRows={this.state.rowsNoleggi}
                                            multiSelect={true}
                                            selectedList={this.state.selectedListNoleggi}
                                            multiSelectCallback={ (list) =>{
                                                this.setState({selectedListNoleggi:list})
                                                //console.log(list)
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
