import React, { Component , Fragment } from 'react';
import axios from 'axios';

import AddEditModal from '../utils/AddEditModal';
import SearchField from '../utils/SearchField';

import { Button } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';

import InputField from '../utils/form/InputField';
import DataField from '../utils/form/DataField';
import DropDownSelect from '../utils/form/DropdownSelect';


const COLUMNS = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Nome', field: 'nome' },
    { title: 'Cognome', field: 'cognome' },
    { title: 'C.F.', field: 'cf' },
    { title: 'Data di Nascita', field:'data_nascita',
        render: cell  =>  new Date(cell).toLocaleDateString("it-IT")
    },
    { title: 'Recapiti', field: 'recapiti', padding:'none' },
    { title: 'Residenza', field: 'residenza' },
    { title: 'Email', field: 'email', },
    { title: 'Fidelizzazione', field:'fidelizzazione', render: cell => cell.titolo },
    { title: 'Privacy', field: 'privacy', },
  ];


export default class Clienti extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            show:false,
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
                <div className="row text-right mb-3 px-2">

                    <div className="col-md-6">
                        <SearchField showList={false} patternList={{id:'id',fields:['nome','cognome']}}
                        url={urlClienti} callback={this._handleSearchFieldCallback}
                        onClick={this._handleSearchFieldClick}
                        />
                    </div>

                    <div className="col-md-6 ">
                        <Button onClick={this._handleShowModal}>Nuovo Cliente</Button>
                        <AddEditModal size="md" show={this.state.show} onHide={this._handleCloseModal} title="Cliente" type="Nuovo" >
                            <ModalBody url={this.props.url} handleChange={this._handleCheckDataModal}/>
                        </AddEditModal>
                    </div>

                </div>
                <div className="row">
                    <div className="col-md-12">
                        <InfiniteTable
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

class ModalBody extends Component {

    constructor(props){
        super(props);

        this.state = {
            data: [],
            show:false,
        };

        this._handleCheck = this._handleCheck.bind(this);
    }

    _handleCheck(e){
        console.log(e.target.value);
    }

    render(){

        let objFid = {'1':'Start','2':'Plus','3':'Revolution'};
        let divClassName = 'mb-3';

        let urlComuni = this.props.url+'/comuni/search';

        return(
            <form>

                <div className="form-group">
                    <InputField name="nome" divClassName={divClassName} className="form-control" label="Nome"
                    handleChange={this._handleCheck} />
                    <InputField name="cognome" divClassName={divClassName} className="form-control" label="Cognome"
                    handleChange={this._handleCheck} />
                    <InputField name="cf" divClassName={divClassName} className="form-control" label="Codice Fiscale"
                    handleChange={this._handleCheck} />
                    <DataField name="data_nascita" className="form-control" label="Data di Nascita"
                    handleChange={this._handleCheck} />
                </div>

                <div className="form-group">
                    <InputField name="id_comune" type="hidden"  />
                    <SearchField
                        label="Comune"
                        placeholder='Cerca un Comune'
                        showList={true}
                        url={urlComuni}
                        patternList={{id:'id',fields:['nome','prov']}}
                        reloadOnClick={false}
                        onClick={(val) => {console.log(val); id_comune=val.id; }}
                    />
                </div>

                <div className="form-group">
                    <InputField name="email" divClassName={divClassName} className="form-control" label="E-mail"
                    handleChange={this._handleCheck} />
                    <InputField name="telefono" divClassName={divClassName}className="form-control" label="Telefono"
                    handleChange={this._handleCheck} />
                    <InputField name="cellulare" className="form-control" label="Cellulare"
                    handleChange={this._handleCheck} />
                </div>

                <div className="form-group">
                    <DropDownSelect name="id_fidelizzazione" className="form-control" label="Fidelizzazione"
                    values={objFid}
                    handleChange={this._handleCheck} />
                </div>

                <div className="form-group">
                    Privacy
                </div>

            </form>
        );
    }
}
