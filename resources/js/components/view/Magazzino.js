import React, { Component , Fragment } from 'react';
import {URL_HOME} from '../Env';

import SearchField from '../utils/SearchField';
import DropDownSelect from '../utils/form/DropdownSelect';
import { Button } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import ScaricoVideoModal from '../modals/ScaricoVideoModal';


const COLUMNS = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Video', field: 'video', style: {textTransform:'capitalize'}  },
    USER_CONFIG.ruolo=='Admin'?
        { title: 'P.to Vendita', field:'pt_vendita', style: {textTransform:'capitalize'} }
    :
        null,
    USER_CONFIG.ruolo!='Addetto'?
        { title: 'Dipendente', field: 'dipendente', style: {textTransform:'capitalize'} }
    :
        null,
    { title: 'Fornitore', field: 'fornitore',style: {textTransform:'capitalize'} },
    { title: 'Data Scarico', field: 'data_scarico',render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"}) },
    { title: 'Giorni al Ritiro', field:'ritiro'},
    { title: 'Noleggiato', field:'noleggiato', render: cell => cell==0 ? 'No' : <span className="highlight">Si</span>},
    { title: 'Danneggiato', field:'danneggiato', render: cell => cell==0?'No':<span className="highlight-error">SI</span>},
].map((a) => { if(a!=null) return a; return false; } );
const MULTISEL_SETTING = {
    disableSelect: (row) => {
        return row.noleggiato == 1;
    }
};

export default class Magazzino extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            rowsCaricati: '',
            show:false,
            selectedList: [],
            selectedListCaricati: [],
            lstPtVendita:{},
            idPtVenditaSelected:-1,
            reloadInfiniteTable:0
        };

        this.url = this.props.url+'/magazzino';
        this.home = URL_HOME;

        this._handleCloseModal = this._handleCloseModal.bind(this);
        this._handleShowModal = this._handleShowModal.bind(this);
        this._handleSearchFieldCallback = this._handleSearchFieldCallback.bind(this);
        this._handleSearchFieldCaricatiCallback = this._handleSearchFieldCaricatiCallback.bind(this);
        this._handleCaricoVideo = this._handleCaricoVideo.bind(this);
        this._handleRipristinoCaricati = this._handleRipristinoCaricati.bind(this);
    }

    componentDidMount(){
        this.getRemoteData();
    }

    getRemoteData(){
        let url = this.props.url+'/punti-vendita';

        let headers = {headers: {'Accept': 'application/json'}
        };

        return axios.get(url, headers )
			.then(res => {
                let lstPtVendita = this.state.lstPtVendita;

                res.data.map((i,k) => {
                    lstPtVendita[i.id] = i.titolo;
                });

                //console.log(lstPtVendita);

                this.setState({lstPtVendita});
			}).catch((error) => {
                if(error.response.data!==undefined)
                    console.log(error.response.data);
                else
                    console.log(error.response);
                throw error;
			});
    }

    _handleCloseModal () {
        this.setState({show : false});
    }
    _handleShowModal (){
        this.setState({show : true});
    }

    _handleCaricoVideo(e){
        if(confirm("Confermi il carico dei video selezionati?"))
            this.setRemoteUpdate('carico');
    }

    _handleRipristinoCaricati(e){
        //console.log("suca")
        if(confirm("Confermi il ripristino dei video selezionati?"))
            this.setRemoteUpdate('ripristina');
    }

    setRemoteUpdate(type) {

        let url = this.props.url+'/magazzino/carico';

        let headers = {headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        };

        let list = type!='ripristina'? this.state.selectedList : this.state.selectedListCaricati;

        let formData = new FormData();

        let data = {
            array_id_magazzino : list,
            restituito_al_fornitore : type=='ripristina'?0:1,
            _token : CSRF_TOKEN
        };

        //console.log(FormData);return;

        //formData.append('_token',CSRF_TOKEN);

        this.setState({loader:true});

        return axios.post(url,data,headers)
        .then(result => {

            //console.log(result.data);

            this.setState({rows:'',rowsCaricati:'', selectedList:[],selectedListCaricati:[], reloadInfiniteTable: ++this.state.reloadInfiniteTable})
            /*
            list.map((id,k) => {
                list.splice( list.indexOf('foo'), 1 );
            });*/

            return result;
        }).catch((error) => {
          console.error(error.response);
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

    _handleSearchFieldCaricatiCallback(data,reset){

        //console.log(rows);

        let rowsCaricati = this.state.rowsCaricati;

        rowsCaricati = data.data;
        this.setState({rowsCaricati});

        if(reset){
            rowsCaricati = '';
            this.setState({rowsCaricati});
        }

    }

    render() {
        let user = USER_CONFIG;
        let ruolo = user.ruolo;

        let idPtVendita = -1;

        if( this.state.idPtVenditaSelected != -1 )
            idPtVendita = this.state.idPtVenditaSelected;
        else if( user.id_pt_vendita !== undefined )
            idPtVendita = user.id_pt_vendita;

        return (
            <Fragment>

                {ruolo=='Admin' &&
                    <div className="row mb-3 mx-2">
                        <div className="col-md-4">
                            <DropDownSelect placeholder="Scegli un Punto Vendita"
                            name="lst_pt_vendita" className="form-control"
                            //label="Punto Vendita"
                            values={this.state.lstPtVendita}
                            selected={idPtVendita}
                            handleChange={(e) =>
                                this.setState({
                                    selectedList:[],
                                    selectedListCaricati:[],
                                    idPtVenditaSelected : e.target.value,
                                    reloadInfiniteTable : ++this.state.reloadInfiniteTable
                                })
                            }
                            />
                        </div>
                    </div>
                }

                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Carico/Scarico</a>
                        <a className="nav-item nav-link" id="nav-caricati-tab" data-toggle="tab" href="#nav-caricati" role="tab" aria-controls="nav-caricati" aria-selected="false">Video Caricati</a>
                    </div>
                </nav>

                <div className="tab-content pt-4" id="nav-tabContent">

                    <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">

                        <div className="container-fluid pl-3">

                            <div className="row mb-3 px-2">

                                <div className="col-md-6">
                                    <SearchField key="s-carico-scarico" id="s-carico-scarico" showList={false} patternList={{id:'id',fields:['nome','cognome']}}
                                    url={this.url+'/search'}
                                    query={idPtVendita!=-1 ? 'id_pt_vendita='+idPtVendita : ''}
                                    callback={this._handleSearchFieldCallback}
                                    />
                                </div>

                                <div className="col-md-6 text-right">
                                    <Button className="btn-danger mr-3" disabled={this.state.selectedList.length>0?false:true} onClick={this._handleCaricoVideo}>
                                    <i className="fa fa-upload" aria-hidden="true"></i>
                                    &nbsp;Carico Video</Button>

                                    <Button className="btn-success" onClick={this._handleShowModal}>
                                    <i className="fa fa-download" aria-hidden="true"></i>
                                    &nbsp;Scarico Video</Button>

                                    <ScaricoVideoModal
                                    url={this.props.url}
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
                                    <InfiniteTable key="carico-scarico"
                                        id="carico-scarico"
                                        reload={this.state.reloadInfiniteTable}
                                        url={this.url}
                                        query={idPtVendita!=-1 ? 'id_pt_vendita='+idPtVendita : ''}
                                        columns={COLUMNS}
                                        externalRows={this.state.rows}
                                        multiSelect={true}
                                        multiSelectSetting={MULTISEL_SETTING}
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
                                    <SearchField key="s-caricati" id="s-caricati"
                                    showList={false} patternList={{id:'id',fields:['nome','cognome']}}
                                    url={this.url+'/search'}
                                    query={'only=caricati' + (idPtVendita!=-1 ? '&id_pt_vendita='+idPtVendita : '')}
                                    callback={this._handleSearchFieldCaricatiCallback}
                                    //onClick={this._handleSearchFieldClick}
                                    />
                                </div>

                                <div className="col-md-6 text-right">
                                    <Button className="btn-warning mr-3" disabled={this.state.selectedListCaricati.length>0?false:true}
                                    onClick={this._handleRipristinoCaricati}>
                                    <i className="fa fa-upload" aria-hidden="true"></i>
                                    &nbsp;Ripristina Selezionati</Button>
                                </div>

                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <InfiniteTable key="caricati"
                                        id='caricati'
                                        reload={this.state.reloadInfiniteTable}
                                        url={this.url}
                                        query={'only=caricati'+(idPtVendita!=-1 ? '&id_pt_vendita='+idPtVendita : '')}
                                        columns={COLUMNS}
                                        externalRows={this.state.rowsCaricati}
                                        multiSelect={true}
                                        selectedList={this.state.selectedListCaricati}
                                        multiSelectCallback={ (list) =>{
                                            this.setState({selectedListCaricati:list})
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
