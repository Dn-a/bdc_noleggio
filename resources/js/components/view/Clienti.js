import React, { Component , Fragment } from 'react';

import SearchField from '../utils/SearchField';
import { AddButton } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import ClientiModal from '../modals/ClientiModal';


const COLUMNS = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Nome', field: 'nome', style: {textTransform:'capitalize'}  },
    { title: 'Cognome', field: 'cognome', style: {textTransform:'capitalize'} },
    { title: 'C.F.', field: 'cf' },
    { title: 'Data di Nascita', field:'data_nascita',
        render: cell  =>  new Date(cell).toLocaleDateString("it-IT")
    },
    { title: 'Recapiti', field: 'recapiti', padding:'none' },
    { title: 'Residenza', field: 'residenza', style: {textTransform:'capitalize'} },
    { title: 'Email', field: 'email', },
    { title: 'Fidelizzazione', field:'fidelizzazione', render: cell => cell.titolo },
    { title: 'Privacy', field: 'privacy', render:(cell,row) => {

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
    } },
  ];


export default class Clienti extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            show:false,
            reloadInfiniteTable:0
        };

        this._handleCloseModal = this._handleCloseModal.bind(this);
        this._handleShowModal = this._handleShowModal.bind(this);
        this._handleSearchFieldCallback = this._handleSearchFieldCallback.bind(this);
        this._handleCheckDataModal = this._handleCheckDataModal.bind(this);
        this._handleSearchFieldClick = this._handleSearchFieldClick.bind(this);
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
        let urlClienti = this.props.url+'/clienti/search';
        return (
            <div className="container-fluid pl-3">
                <div className="row mb-3 px-2">

                    <div className="col-md-6">
                        <SearchField showList={false} patternList={{id:'id',fields:{nome:[],cognome:[]}} }
                        url={urlClienti} callback={this._handleSearchFieldCallback}
                        onClick={this._handleSearchFieldClick}
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
                            reload={this.state.reloadInfiniteTable}
                            url={this.props.url+'/clienti'}
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
