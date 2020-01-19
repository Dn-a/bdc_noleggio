import React, { Component , Fragment } from 'react';

import SearchField from '../utils/SearchField';
import { Button } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import NoleggiModal from '../modals/NoleggiModal';


const COLUMNS = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Titolo', field: 'titolo', img:'', style: {textTransform:'capitalize',fontWeight:'600'}  },
    { title: 'Durata', field: 'durata', style: {textTransform:'capitalize'} },
    { title: 'Categoria', field: 'categoria', style: {textTransform:'capitalize'} },
    { title: 'Dettagli', field: 'dettagli'},
    { title: 'Data Uscita', field: 'data_uscita',render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"}) },
    { title: 'Prezzo', field: 'prezzo', render: cell => parseFloat(cell).toFixed(2) +' €' },
    { title: 'In Uscita', field: 'in_uscita',render: cell => {(cell==0)? 'No':'Si'} },
  ];

const COLUMNS_2 = [
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
            rows: '',
            rowsNoleggi: '',
            show:false,
            selectedList: [],
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

        //console.log(rows);

        let rows = this.state.rows;

        rows = data.data;
        this.setState({rows});

        if(reset){
            rows = '';
            this.setState({rows});
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
                                        url={urlVideo+'/search'} callback={this._handleSearchFieldCallback}
                                        />
                                    </div>

                                    <div className="col-md-6 text-right">
                                        <Button className="btn-success mr-3" disabled={this.state.selectedList.length>0?false:true} onClick={this._handleCaricoVideo}>
                                        <i className="fa fa-upload" aria-hidden="true"></i>
                                        &nbsp;Noleggia</Button>


                                        <NoleggiModal url={this.props.url}
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
                                        <InfiniteTable key="video"
                                            id="video"
                                            reload={this.state.rel1oadInfiniteTable}
                                            url={urlVideo}
                                            columns={COLUMNS}
                                            externalRows={this.state.rows}
                                            multiSelect={true}
                                            selectedList={this.state.selectedList}
                                            multiSelectCallback={ (list) =>{
                                                this.setState({selectedList:list})
                                                //console.log(list)
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
                                        <Button className="btn-success mr-3" disabled={this.state.selectedList.length>0?false:true} onClick={this._handleCaricoVideo}>
                                        <i className="fa fa-download" aria-hidden="true"></i>
                                        &nbsp;Restituzione</Button>


                                        <NoleggiModal url={this.props.url}
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
                                        <InfiniteTable key="noleggi"
                                            id="noleggi"
                                            reload={this.state.reloadInfiniteTable}
                                            url={this.url}
                                            columns={COLUMNS_2}
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
