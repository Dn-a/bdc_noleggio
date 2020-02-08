import React, { Component , Fragment } from 'react';

import SearchField from '../utils/SearchField';
import DropDownSelect from '../utils/form/DropdownSelect';
import { Button, AddButton } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import DipendentiModal from '../modals/DipendentiModal';


const COLUMNS = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Nome', field: 'nome', style: {textTransform:'capitalize'}  },
    { title: 'Cognome', field: 'cognome', style: {textTransform:'capitalize'} },
    { title: 'Email', field: 'email' },
    { title: 'Matricola', field: 'matricola' },
    { title: 'Ruolo', field:'ruolo'},
    { title: 'Punto Vendita', field:'pt_vendita'},
    { title: 'Creato il', field:'created_at', render: cell => new Date(cell).toLocaleDateString("it-IT")},
  ];


export default class Dipendenti extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            loader: false,
            show:false,
            lstPtVendita:{},
            idPtVenditaSelected:-1,
            reloadInfiniteTable:0
        };

        this.url = this.props.url+'/dipendenti';
        this._handleCloseModal = this._handleCloseModal.bind(this);
        this._handleShowModal = this._handleShowModal.bind(this);
        this._handleSearchFieldCallback = this._handleSearchFieldCallback.bind(this);
        this._handleCheckDataModal = this._handleCheckDataModal.bind(this);
        this._handleSearchFieldClick = this._handleSearchFieldClick.bind(this);
    }

    componentDidMount(){
        this.getRemoteData();
    }

    getRemoteData(){
        let url = this.props.url+'/punti-vendita';

        let headers = {headers: {'Accept': 'application/json'}
        };

        this.setState({loader:true});

        return axios.get(url, headers )
			.then(res => {
                let lstPtVendita = this.state.lstPtVendita;

                res.data.map((i,k) => {
                    lstPtVendita[i.id] = i.titolo;
                });

                //console.log(lstPtVendita)
                this.setState({lstPtVendita,  loader:false});

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

        let user = USER_CONFIG;
        let ruolo = user.ruolo;

        let idPtVendita = -1;

        if( this.state.idPtVenditaSelected != -1 )
            idPtVendita = this.state.idPtVenditaSelected;
        else if( user.id_pt_vendita !== undefined )
            idPtVendita = user.id_pt_vendita;

        return (
            <div className="container-fluid pl-3">

                {ruolo=='Admin' &&
                    <div className="row mb-3 mx-2 pt-vendita">
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
                        <img className={"loader-2"+(this.state.loader==true?' d-inline-block':'')} src="../img/loader_2.gif"></img>
                    </div>
                }

                <div className="row mb-3 px-2">

                    <div className="col-md-6">
                        <SearchField showList={false} patternList={{id:'id',fields:['nome','cognome']}}
                        url={this.url+'/search'}
                        query={idPtVendita!=-1 ? 'id_pt_vendita='+idPtVendita : ''}
                        callback={this._handleSearchFieldCallback}
                        onClick={this._handleSearchFieldClick}
                        />
                    </div>

                    <div className="col-md-6 text-right">

                        {USER_CONFIG.ruolo=='Admin' &&
                            <AddButton onClick={this._handleShowModal}>
                            <i className="fa fa-plus-circle" aria-hidden="true"></i>
                            &nbsp;Nuovo Dipendente</AddButton>
                        }

                        <DipendentiModal url={this.props.url}
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
                            id='tb-dipendenti'
                            reload={this.state.reloadInfiniteTable}
                            url={this.url}
                            query={idPtVendita!=-1 ? 'id_pt_vendita='+idPtVendita : ''}
                            columns={COLUMNS}
                            externalRows={this.state.rows}
                            //multiSelect={true}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
