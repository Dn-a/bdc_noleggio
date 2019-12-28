import React, { Component , Fragment } from 'react';

import AddEditModal from '../utils/AddEditModal';
import SearchField from '../utils/SearchField';
import InputField from '../utils/form/InputField';
import DataField from '../utils/form/DataField';
import DropDownSelect from '../utils/form/DropdownSelect';
import INFO_ERROR from '../utils/form/InfoError';

const email_reg_exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const whitespace_reg_ex = /^[^\s].*/;

const FIELDS = [
    'nome',
    'cognome',
    'cf',
    'email',
    'data_nascita',
    'telefono',
    'cellulare',
    'id_comune',
    'id_fidelizzazione',
];
export default class ClientiModal extends Component {

    constructor(props){
        super(props);

        let data = {};
        let error = {};

        FIELDS.map((fd,id) => {
            data[fd] = error[fd]= '';
        });

        this.state = {
            data: data,
            error: error,
        };

        this._handleChange = this._handleChange.bind(this);
    }

    _handleChange(e){
        let value = e.target.value;
        let field = e.target.name;

        let error = this.state.error;
        let data = this.state.data;

        if(value=='')
            error[field] = INFO_ERROR['vuoto'];
        else
            error[field] = '';

        switch(field){
            case 'nome':
                if(!whitespace_reg_ex.test(value))
                    error.nome = INFO_ERROR['caratteri'];
                break;
            case 'cognome':
                if(!whitespace_reg_ex.test(value))
                    error.cognome = INFO_ERROR['caratteri'];
                break;
            case 'telefono':
                if(isNaN(value))
                   error.telefono = INFO_ERROR['numero'];
                break;
            case 'cellulare':
                if(isNaN(value))
                   error.cellulare = INFO_ERROR['numero'];
                break;
            case 'email':
                if(!email_reg_exp.test(value))
                    error.email = INFO_ERROR['email_2'];
                break;
            case 'data_nascita':
                let today = new Date();
                today = new Date(today.toDateString()).getTime();
                let date = new Date(value);
                date = new Date(date.toDateString()).getTime();
                if(date > today)
                    error.data_nascita = INFO_ERROR['data'];
                break;
        }

        data[field] = value;

        this.setState({data,error});
    }

    showError(field){
        let error = this.state.error[field]!== undefined ? this.state.error[field] : '';

        if(error != '')
          return(
            <div className="error-div">{error}</div>
          );
      }

    render(){

        let objFid = {'1':'Start','2':'Plus','3':'Revolution'};
        let divClassName = 'mb-3';

        let urlComuni = this.props.url+'/comuni/search';

        return(
            <AddEditModal size="md"
                show={this.props.show} onHide={this.props.onHide}
                title="Cliente" type="Nuovo"
            >

                <form>

                    <div className="form-group">
                        <InputField name="nome" divClassName={divClassName} className="form-control" label="Nome"
                        helperText={this.showError('nome')} handleChange={this._handleChange} />
                        <InputField name="cognome" divClassName={divClassName} className="form-control" label="Cognome"
                        helperText={this.showError('cognome')} handleChange={this._handleChange} />
                        <InputField name="cf" divClassName={divClassName} className="form-control" label="Codice Fiscale"
                        helperText={this.showError('cf')} handleChange={this._handleChange} />
                        <DataField name="data_nascita" className="form-control" label="Data di Nascita"
                        helperText={this.showError('data_nascita')} handleChange={this._handleChange} />
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
                        helperText={this.showError('email')} handleChange={this._handleChange} />
                        <InputField name="telefono" divClassName={divClassName}className="form-control" label="Telefono"
                        helperText={this.showError('telefono')} handleChange={this._handleChange} />
                        <InputField name="cellulare" className="form-control" label="Cellulare"
                        helperText={this.showError('cellulare')} handleChange={this._handleChange} />
                    </div>

                    <div className="form-group">
                        <DropDownSelect name="id_fidelizzazione" className="form-control" label="Fidelizzazione"
                        values={objFid}
                        handleChange={this._handleChange} />
                    </div>

                    <div className="form-group">
                        Privacy
                    </div>

                </form>
            </AddEditModal>
        );
    }
}
