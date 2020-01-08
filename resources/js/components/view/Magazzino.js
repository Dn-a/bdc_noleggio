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
            selectedList: [],
            reloadInfiniteTable:0
        };

        this.url = this.props.url+'/magazzino';
        this._handleCloseModal = this._handleCloseModal.bind(this);
        this._handleShowModal = this._handleShowModal.bind(this);
        this._handleSearchFieldCallback = this._handleSearchFieldCallback.bind(this);
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
        if(confirm("Confermi il carico dei video selezionati?"))
            this.setRemoteUpdate();
    }

    setRemoteUpdate() {

        let url = this.props.url+'/magazzino/carico';

        let headers = {headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        };

        let list = this.state.selectedList;

        let formData = new FormData();

        let data = {
            array_id_magazzino : list,
            restituito_al_fornitore : 1,
            _token : CSRF_TOKEN
        };

        //console.log(FormData);return;

        //formData.append('_token',CSRF_TOKEN);

        this.setState({loader:true});

        return axios.post(url,data,headers)
        .then(result => {

            //console.log(result.data);

            this.setState({rows:'', selectedList:[], reload: ++this.state.reloadInfiniteTable})
            /*
            list.map((id,k) => {
                list.splice( list.indexOf('foo'), 1 );
            });*/

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
                        <Button className="btn-danger mr-3" disabled={this.state.selectedList.length>0?false:true} onClick={this._handleCaricoVideo}>
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
                            selectedList={this.state.selectedList}
                            multiSelectCallback={ (list) =>{
                                this.setState({selectedList:list})
                                //console.log(list)
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
