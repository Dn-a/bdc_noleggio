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
    'cf',
    'email',
    'data_nascita',
    'telefono',
    'cellulare',
    'indirizzo',
    'id_comune',
    'id_fidelizzazione',
    'privacy'
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
            checked: false,
            loader:false
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
        this.state.data=data;
        this.state.error =error;
        this.state.loader = false;
        this.state.checked = false;
    }

    setRemoteStore() {

        let url = this.props.url+'/clienti';

        let headers = {headers: {'Accept': 'application/json',
            //'Content-Type': 'application/json'
            //'Content-Type': 'multipart/form-data'
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        let data = this.state.data;

        let formData = new FormData();

        Object.keys(data).map((k,id) => {
            formData.append(k,data[k]);
        });

        formData.append('_token',CSRF_TOKEN);

        //let formData = {...data};
        //formData['_token'] = CSRF_TOKEN;
        //console.log(formData);

        this.setState({loader:true});

        return axios.post(url,formData,headers)
        .then(result => {
            //console.log(result);
            if(this.props.callback !== undefined)
                this.props.callback(data);
            this.props.onHide();
            this.state.loader = false;
            /*var reader = new FileReader();
            reader.readAsDataURL(data.privacy);
            reader.onload= () =>  {
                data.privacy = reader.result;
                data.id='1';
                if(this.props.callback !== undefined)
                    this.props.callback(data);
                this.props.onHide();
            }*/
            return result;
        }).catch((error) => {
          console.error(error.response);
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
            case 'cf':
                value = value.toUpperCase();
                if(value.length > 1 && !whitespace_reg_ex.test(value))
                    error.cf = INFO_ERROR['caratteri'];
                break;
            case 'indirizzo':
                if(value.length > 1 && !whitespace_reg_ex.test(value))
                    error.indirizzo = INFO_ERROR['caratteri'];
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
                if(value.length < 8 )
                    error.email = INFO_ERROR['email_1'];
                else if(!email_reg_exp.test(value))
                    error.email = INFO_ERROR['email_2'];
                break;
            case 'data_nascita':
                let today = new Date();
                today = new Date(today.toDateString()).getTime();
                let date = new Date(value);
                date = new Date(date.toDateString()).getTime();
                if(date > today)
                    error.data_nascita = INFO_ERROR['data_2'];
                break;
            case 'privacy':
                value = e.target.files[0];
                if(e.target.files.length== 0)
                   error.privacy = INFO_ERROR['file'];
        }

        data[field] = field!='privacy'? value.trim() : value;

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

        //let objFid = {'1':'Start - 0%','2':'Plus - 10%','3':'Revolution - 20%'};
        let objFid = {'1':'Start - 0%'};

        if(USER_CONFIG.ruolo!='Addetto'){
            objFid['2'] = 'Plus - 10%';
            objFid['3'] = 'Revolution - 20%';
        }

        let divClassName = 'mb-3';

        let urlComuni = this.props.url+'/comuni/search';

        return(
            <AddEditModal size="md"
                show={this.props.show}
                onHide={(a) => {this.props.onHide(a);this._resetAfterClose();}}
                onConfirm={this._handleOnSave}
                loader={this.state.loader}
                disabledConfirmButton={!this.state.checked}
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
                        <InputField name="indirizzo" divClassName={divClassName} className="form-control"
                        label="Indirizzo"
                        helperText={this.showError('indirizzo')} handleChange={this._handleChange} />
                        <SearchField
                            label="Comune"
                            placeholder='Cerca un Comune'
                            searchClassName='w-100'
                            showList={true}
                            url={urlComuni}
                            patternList={{id:'id', fields:{nome:[],prov:[]}} }//id di ritorno; i fields vengono usati come titolo
                            reloadOnClick={false}
                            onClick={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_comune = val.id;
                                    error.id_comune = '';
                                    this.setState({data,error},() => this.checked());
                                }
                            }
                            callback={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_comune = '';
                                    if(val.length==0){
                                        error.id_comune = INFO_ERROR['comune'];
                                    }
                                    this.setState({data,error},() => this.checked());
                                }
                            }
                        />
                        {this.showError('id_comune')}
                    </div>

                    <div className="form-group">
                        <InputField name="email" autocomplete='on' divClassName={divClassName} className="form-control" label="E-mail"
                        helperText={this.showError('email')} handleChange={this._handleChange} />
                        <InputField name="telefono" divClassName={divClassName}className="form-control" label="Telefono"
                        helperText={this.showError('telefono')} handleChange={this._handleChange} />
                        <InputField name="cellulare" className="form-control" label="Cellulare"
                        helperText={this.showError('cellulare')} handleChange={this._handleChange} />
                    </div>

                    <div className="form-group">
                        <DropDownSelect placeholder="Scegli un valore"
                        name="id_fidelizzazione" className="form-control" label="Fidelizzazione"
                        values={objFid}
                        defaultSelected='default'
                        handleChange={this._handleChange} />
                    </div>

                    <div className="form-group">
                        <FileField name='privacy' divClassName={divClassName} className="form-control"
                        helperText={this.showError('privacy')} handleChange={this._handleChange} label="Privacy" />
                    </div>

                </form>
            </AddEditModal>
        );
    }
}
