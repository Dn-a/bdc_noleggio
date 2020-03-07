import React, { Component , Fragment } from 'react';
import {URL_HOME} from '../Env';

import AddEditModal from '../utils/AddEditModal';
import SearchField from '../utils/SearchField';
import InputField from '../utils/form/InputField';
import DataField from '../utils/form/DataField';
import INFO_ERROR from '../utils/form/InfoError';

const email_reg_exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const whitespace_reg_ex = /^[^\s].*/;

const FIELDS = [
    'titolo',
    'durata',
    'trama',
    'in_uscita',
    'data_uscita',
    'prezzo',
    'img',
    'id_attori',
    'id_categoria',
    'id_regista'
];
export default class CatalogoModal extends Component {

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
        this.state.data=data;
        this.state.error =error;
        this.state.loader = false;
        this.state.checked = false;
    }

    setRemoteStore() {

        let url = this.props.url+'/video';

        let headers = {headers: {'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        let data = this.state.data;

        let formData = new FormData();

        Object.keys(data).map((k,id) => {
            formData.append(k,data[k]);
        });

        formData.append('_token',CSRF_TOKEN);

        this.setState({loader:true});

        return axios.post(url,formData,headers)
        .then(result => {
            //console.log(result);
            
            if(this.props.callback !== undefined)
                this.props.callback(data);

            this.props.onHide();
            this.state.loader = false;
            
            return result;
        }).catch((error) => {
          if(error.response===undefined){ console.log(error); return }
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
            case 'titolo':
                if( value.length > 1 && !whitespace_reg_ex.test(value))
                    error.nome = INFO_ERROR['caratteri'];
                break;
            case 'durata':
                if(value.length > 1 && !whitespace_reg_ex.test(value))
                    error.cognome = INFO_ERROR['caratteri'];
                break;
            case 'trama':
                value = value.toUpperCase();
                if(value.length > 1 && !whitespace_reg_ex.test(value))
                    error.cf = INFO_ERROR['caratteri'];
                break;
            case 'in_uscita':
                if(value.length > 1 && !whitespace_reg_ex.test(value))
                    error.indirizzo = INFO_ERROR['caratteri'];
                break;
            case 'data_uscita':
                let today = new Date();
                today = new Date(today.toDateString()).getTime();
                let date = new Date(value);
                date = new Date(date.toDateString()).getTime();
                if(date > today)
                    error.data_nascita = INFO_ERROR['data_2'];
                break;
            case 'prezzo':
                if(isNaN(value))
                   error.cellulare = INFO_ERROR['numero'];
                break;
            case 'img':
                if(value.length < 8 )
                    error.email = INFO_ERROR['email_1'];
                else if(!email_reg_exp.test(value))
                    error.email = INFO_ERROR['email_2'];
                break;            
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

        let objFid = {'1':'Start - 0%'};

        if(USER_CONFIG.ruolo!='Addetto'){
            objFid['2'] = 'Plus - 10%';
            objFid['3'] = 'Revolution - 20%';
        }

        let divClassName = 'mb-3';

        let urlCategorie = this.props.url+'/categorie/search';
        let urlRegisti = this.props.url+'/registi/search';
        let urlAttori = this.props.url+'/attori/search';

        return(
            <AddEditModal size="md"
                show={this.props.show}
                onHide={(a) => {this.props.onHide(a);this._resetAfterClose();}}
                onConfirm={this._handleOnSave}
                loader={this.state.loader}
                disabledConfirmButton={!this.state.checked}
                error = {this.state.remoteError}
                title="Film" type="Nuovo"
            >

                <form>

                    <div className="form-group">
                        <InputField name="titolo" divClassName={divClassName} className="form-control" label="Titolo"
                        helperText={this.showError('titolo')} handleChange={this._handleChange} />
                        <InputField name="durata" divClassName={divClassName} className="form-control" label="Durata"
                        helperText={this.showError('durata')} handleChange={this._handleChange} />
                        <InputField name="trama" divClassName={divClassName} className="form-control" label="Trama"
                        helperText={this.showError('trama')} handleChange={this._handleChange} />
                        <DataField name="data_uscita" className="form-control" label="Data Uscita"
                        helperText={this.showError('data_uscita')} handleChange={this._handleChange} />
                    </div>

                    <div className="form-group">                        
                        <SearchField
                            label="Genere"
                            placeholder='Cerca un Genere'
                            searchClassName='w-100'
                            showList={true}
                            url={urlCategorie}
                            patternList={{id:'id', fields:{titolo:[]}} }//id di ritorno; i fields vengono usati come titolo
                            reloadOnClick={false}
                            onClick={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_categoria = val.id;
                                    error.id_categoria = '';
                                    this.setState({data,error},() => this.checked());
                                }
                            }
                            callback={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_categoria = '';
                                    if(val.length==0){
                                        error.id_categoria = INFO_ERROR['genere'];
                                    }
                                    this.setState({data,error},() => this.checked());
                                }
                            }
                        />
                        {this.showError('id_categoria')}
                    </div>

                    <div className="form-group">                        
                        <SearchField
                            label="Regista"
                            placeholder='Cerca un Regista'
                            searchClassName='w-100'
                            showList={true}
                            url={urlRegisti}
                            patternList={{id:'id', fields:{nome:[],cognome:[]}} }//id di ritorno; i fields vengono usati come titolo
                            reloadOnClick={false}
                            onClick={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_regista = val.id;
                                    error.id_regista = '';
                                    this.setState({data,error},() => this.checked());
                                }
                            }
                            callback={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_regista = '';
                                    if(val.length==0){
                                        error.id_regista = INFO_ERROR['regista'];
                                    }
                                    this.setState({data,error},() => this.checked());
                                }
                            }
                        />
                        {this.showError('id_regista')}
                    </div>

                    <div className="form-group">                        
                        <SearchField
                            label="Attore"
                            placeholder='Cerca un Attore'
                            searchClassName='w-100'
                            showList={true}
                            url={urlAttori}
                            patternList={{id:'id', fields:{nome:[],cognome:[]}} }//id di ritorno; i fields vengono usati come titolo
                            reloadOnClick={false}
                            onClick={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_attori = val.id;
                                    error.id_attori = '';
                                    this.setState({data,error},() => this.checked());
                                }
                            }
                            callback={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_attori = '';
                                    if(val.length==0){
                                        error.id_attori = INFO_ERROR['attore'];
                                    }
                                    this.setState({data,error},() => this.checked());
                                }
                            }
                        />
                        {this.showError('id_attori')}
                    </div>

                    <div className="form-group">
                        <InputField name="img" divClassName={divClassName} className="form-control" label="Link immagine"
                        helperText={this.showError('img')} handleChange={this._handleChange} />                        
                    </div>

                </form>
            </AddEditModal>
        );
    }
}
