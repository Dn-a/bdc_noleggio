import React, { Component , Fragment } from 'react';

import SearchField from '../utils/SearchField';
import { Button } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import CatalogoModal from '../modals/CatalogoModal';


const COLUMNS_VIDEO = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Titolo', field: 'titolo', img:'',
        render: (cell,row) => {
            
            return(
                <div style={{display: 'inline-block'}}>
                    <span style={{textTransform:'capitalize',fontWeight:'600'}}>{row['titolo']}</span>
                    <div>                        
                        <span>{row['categoria']}</span> -&nbsp;
                        <span>{row['regista']}</span>&nbsp;
                        {row.attori!=undefined && row.trama!=undefined &&
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
                        }
                    </div>
                </div>
            );
        }
    },
    { title: 'Durata', field: 'durata'},
    { title: 'Data Uscita', field: 'data_uscita', render: 
        (cell,row) => {
            let uscita = row.in_uscita==0? 'uscito' : 'in uscita' ;
            return(
                <Fragment>
                    <div>
                        {new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"})}
                    </div>
                    <span className={row.in_uscita==1?'highlight-confirm':''}>{uscita}</span>
                </Fragment>
            );
        }
    },
    { title: 'Prezzo', field: 'prezzo', render: cell => parseFloat(cell).toFixed(2) +' €' }
];

export default class Noleggi extends Component {

    constructor(props){
        super(props);

        this.state = {
            rowsVideo: '',
            showVideo: false,
            recallSearch: false,
            reloadInfiniteTable: 0
        };

        this.url = this.props.url+'/video';

        this._handleCloseModal = this._handleCloseModal.bind(this);
        this._handleShowModal = this._handleShowModal.bind(this);
        
        this._handleSearchFieldCallback = this._handleSearchFieldCallback.bind(this);
    }


    _handleCloseModal () {
        this.setState({showVideo : false});
    }
    _handleShowModal (){
        this.setState({showVideo : true});
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



    render() {

        let user = USER_CONFIG;
        let ruolo = user.ruolo;

        return (
            <Fragment>

                {ruolo=='Admin' &&                

                <div className="container-fluid pl-3">

                    <div className="row mb-2 px-2">
                        <div className="col-md-12 description-txt">
                            <p>Cliccando su <strong>Aggiungi film</strong> si aprirà una finestra che ti consentirà di aggiungere un nuovo film (uscito o in uscita) nel catalogo.</p>                            
                            <p>È possibile cercare un <strong>Video</strong> in base a: TITOLO | GENERE </p>
                        </div>
                    </div>

                    <div className="row mb-3 px-2">

                        <div className="col-md-6">
                            <SearchField key="s-video" showList={false}
                            query='only=catalogo'
                            url={this.url+'/search'}
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
                            onClick={this._handleShowModal}>
                            <i className="fa fa-plus" aria-hidden="true"></i>
                            &nbsp;Aggiungi un Film</Button>


                            <CatalogoModal url={this.props.url}                            
                            show={this.state.showVideo} onHide={this._handleCloseModal}
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
                            url={this.url}
                            query='only=catalogo'
                            columns={COLUMNS_VIDEO}
                            externalRows={this.state.rowsVideo}                            
                            />

                        </div>
                    </div>

                </div>

                }
                    
            </Fragment>

        );
    }
}
