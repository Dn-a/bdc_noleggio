import React, { Component , Fragment } from 'react';

import SearchField from '../utils/SearchField';
import { Button } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import ScaricoVideoModal from '../modals/ScaricoVideoModal';


const COLUMNS = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Video', field: 'video', style: {textTransform:'capitalize'}  },
    { title: 'P.to Vendita', field: 'pt_vendita', style: {textTransform:'capitalize'} },
    { title: 'Dipendente', field: 'dipendente', style: {textTransform:'capitalize'} },
    { title: 'Fornitore', field: 'fornitore',style: {textTransform:'capitalize'} },
    { title: 'Data Scarico', field: 'data_scarico',render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"2-digit",month:"2-digit", day:"2-digit"}) },
    { title: 'Giorni al Ritiro', field:'ritiro'},
    { title: 'Noleggiato', field:'noleggiato', render: cell => cell==0?'No':'SI'},
    { title: 'Danneggiato', field:'danneggiato', render: cell => cell==0?'No':'SI'},
  ];


export default class Magazzino extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            show:false,
            reloadInfiniteTable:0
        };

        this.url = this.props.url+'/magazzino';
        this._handleCloseModal = this._handleCloseModal.bind(this);
        this._handleShowModal = this._handleShowModal.bind(this);
        this._handleSearchFieldCallback = this._handleSearchFieldCallback.bind(this);
        this._handleCheckDataModal = this._handleCheckDataModal.bind(this);
        this._handleSearchFieldClick = this._handleSearchFieldClick.bind(this);
        this._handleCaricoVideo = this._handleCaricoVideo.bind(this);
    }


    _handleCloseModal () {
        this.setState({show : false});
    }
    _handleShowModal (){
        this.setState({show : true});
    }

    _handleCaricoVideo(e){
        console.log(e)
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
                <div className="row mb-3 px-2">

                    <div className="col-md-6">
                        <SearchField showList={false} patternList={{id:'id',fields:['nome','cognome']}}
                        url={this.url+'/search'} callback={this._handleSearchFieldCallback}
                        onClick={this._handleSearchFieldClick}
                        />
                    </div>

                    <div className="col-md-6 text-right">
                        <Button className="btn-danger mr-3" onClick={this._handleCaricoVideo}>
                        <i className="fa fa-upload" aria-hidden="true"></i>
                        &nbsp;Carico Video</Button>

                        <Button className="btn-success" onClick={this._handleShowModal}>
                        <i className="fa fa-download" aria-hidden="true"></i>
                        &nbsp;Scarico Video</Button>

                        <ScaricoVideoModal url={this.props.url}
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
                            multiSelect={true}
                            multiSelectCallback={ (list) =>{
                                if(list.length>0)
                                    console.log(list)
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
