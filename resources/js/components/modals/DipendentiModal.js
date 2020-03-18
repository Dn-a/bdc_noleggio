import React, { Component , Fragment } from 'react';
import {URL_HOME} from '../Env';

import AddEditModal from '../utils/AddEditModal';
import SearchField from '../utils/SearchField';
import InputField from '../utils/form/InputField';
import DataField from '../utils/form/DataField';
import DropDownSelect from '../utils/form/DropdownSelect';
import INFO_ERROR from '../utils/form/InfoError';
import FileField from '../utils/form/FileField';

const email_reg_exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const whitespace_reg_ex = /^[^\s].*/;

const FIELDS = [
    'nome',
    'cognome',
    'matricola',
    'email',
    'id_ruolo',
    'id_pt_vendita',
    'password',
    'confirm_password'
];

const HIDE_FIELD = [
    'confirm_password'
]

export default class DipendentiModal extends Component {

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
            checked: false,
            loader:false,
            remoteError:''
        };

        this.home = URL_HOME;

        this._handleChange = this._handleChange.bind(this);
        this._handleOnSave = this._handleOnSave.bind(this);
    }

    _resetAfterClose () {
        let data = {};
        let error = {};

        FIELDS.map((fd,id) => {
            data[fd] = error[fd]= '';
        });

        this.state.data= data;
        this.state.error = error;
        this.state.loader = false;
        this.state.checked = false;
    }

    setRemoteStore() {

        let url = this.props.url+'/dipendenti';

        let headers = {headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'
            //'Content-Type': 'multipart/form-data'
            //'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        let data = this.state.data;


        let formData = new FormData();

        Object.keys(data).map((k,id) => {
            if(!HIDE_FIELD.includes(k)){
                formData.append(k,data[k]);
            }
        });

        //console.log(FormData);return;

        formData.append('_token',CSRF_TOKEN);

        this.setState({loader:true});

        return axios.post(url,formData,headers)
        .then(result => {
            //console.log(result);
            if(this.props.callback !== undefined)
                this.props.callback(data);
            this.props.onHide();
            this._resetAfterClose();
            return result;
        }).catch((error) => {
          console.error(error.response);
          let msgError = 'Qualcosa è andato storto. Errore: '+ error.response.data + '. Aggiornare la pagine per vedere se il problema persiste';
          this.setState({remoteError: msgError});
          if(error.response.status==401)
            if(window.confirm('Devi effettuare il Login, Clicca ok per essere reindirizzato.'))
              window.location.href=this.home + '/login';
          throw error;
        });
    }

    _handleOnSave(){
        console.log("save");
        this.setRemoteStore();
    }

    _handleChange(e){
        let value = e.target.value.toLowerCase();
        let field = e.target.name;


        let error = this.state.error;
        let data = this.state.data;

        if(value=='')
            error[field] = INFO_ERROR['vuoto'];
        else
            error[field] = '';

        switch(field){
            case 'nome':
                if( value.length > 1 && !whitespace_reg_ex.test(value))
                    error.nome = INFO_ERROR['caratteri'];
                break;
            case 'cognome':
                if(value.length > 1 && !whitespace_reg_ex.test(value))
                    error.cognome = INFO_ERROR['caratteri'];
                break;
            case 'matricola':
                value = value.toUpperCase();
                if(value.length > 1 && !whitespace_reg_ex.test(value))
                    error.matricola = INFO_ERROR['caratteri'];
                break;
            case 'email':
                if(value.length < 8 )
                    error.email = INFO_ERROR['email_1'];
                else if(!email_reg_exp.test(value))
                    error.email = INFO_ERROR['email_2'];
                break;
            case 'password':
                if(value.length > 1 && !whitespace_reg_ex.test(value))
                    error.password = INFO_ERROR['caratteri'];
                else if(value.length > 0 && value.length < 8)
                    error.password = INFO_ERROR['password'];
                else if(this.state.data.confirm_password!='' && value != this.state.data.confirm_password)
                    error.confirm_password = INFO_ERROR['confirm_password'];
                else
                    error.confirm_password = '';
                break;
            case 'confirm_password':
                if(value.length > 1 && !whitespace_reg_ex.test(value))
                    error.confirm_password = INFO_ERROR['caratteri'];
                else if( value.length > 0 && value.length < 8 || value != this.state.data.password)
                    error.confirm_password = INFO_ERROR['confirm_password'];
                break;
        }

        data[field] = value.trim();

        this.setState({data,error},()  => this.checked());
    }

    checked(){
        let data = this.state.data;
        let error = this.state.error;

        let checked = true;
        Object.keys(error).map((k,id) => {
            if(error[k]!='' || data[k]=='')
                checked = false;
        });

        this.setState({checked});
    }

    showError(field){
        let error = this.state.error[field]!== undefined ? this.state.error[field] : '';

        if(error != '')
          return(
            <div className="error-div">{error}</div>
          );
    }

    render(){

        let objFid = {
            '3':'Addetto',
            '2':'Responsabile',
            '1':'Admin'
        };
        let divClassName = 'mb-3';

        let urlPtVendita = this.props.url+'/punti-vendita/search';

        return(
            <AddEditModal size="md"
                show={this.props.show}
                onHide={(a) => {this.props.onHide(a);this._resetAfterClose();}}
                url={this.props.url}
                loader={this.state.loader}
                onConfirm={this._handleOnSave}
                disabledConfirmButton={!this.state.checked}
                error = {this.state.remoteError}
                title="Dipendente" type="Nuovo"
            >

                <form>

                    <div className="form-group">
                        <InputField name="nome" divClassName={divClassName} className="form-control" label="Nome"
                        helperText={this.showError('nome')} handleChange={this._handleChange} />
                        <InputField name="cognome" divClassName={divClassName} className="form-control" label="Cognome"
                        helperText={this.showError('cognome')} handleChange={this._handleChange} />
                    </div>

                    <div className="form-group">
                        <SearchField
                            label="Punto Vendita"
                            placeholder='Cerca un Punto Vendita'
                            searchClassName='w-100'
                            showList={true}
                            url={urlPtVendita}
                            patternList={{id:'id', fields:{titolo:[],indirizzo:[],comune:['nome','prov']} } }//id di ritorno; i fields vengono usati come titolo
                            reloadOnClick={false}
                            onClick={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_pt_vendita = val.id;
                                    error.id_pt_vendita = '';
                                    this.setState({data,error},() => this.checked());
                                }
                            }
                            callback={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_pt_vendita = '';
                                    if(val.length==0){
                                        error.id_pt_vendita = INFO_ERROR['pt_vendita'];
                                    }
                                    this.setState({data,error},() => this.checked());
                                }
                            }
                        />
                        {this.showError('id_pt_vendita')}
                    </div>

                    <div className="form-group">
                        <InputField name="matricola" divClassName={divClassName} className="form-control" label="Matricola"
                        helperText={this.showError('matricola')} handleChange={this._handleChange} />
                        <InputField name="email" autocomplete='on' className="form-control" label="E-mail"
                        helperText={this.showError('email')} handleChange={this._handleChange} />
                    </div>

                    <div className="form-group">
                        <DropDownSelect placeholder="Scegli un valore"
                        name="id_ruolo" className="form-control" label="Ruolo"
                        values={objFid}
                        defaultSelected='Scegli un valore'
                        handleChange={this._handleChange} />
                    </div>

                    <div className="form-group">
                        <InputField type="password" name='password' divClassName={divClassName} className="form-control"
                        helperText={this.showError('password')} handleChange={this._handleChange} label="Password" />
                        <InputField type="password" name='confirm_password' divClassName={divClassName} className="form-control"
                        helperText={this.showError('confirm_password')} handleChange={this._handleChange} label="Conferma Password" />
                    </div>

                </form>
            </AddEditModal>
        );
    }
}
