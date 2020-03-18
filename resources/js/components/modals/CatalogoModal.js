import React, { Component , Fragment } from 'react';
import {URL_HOME} from '../Env';

import AddEditModal from '../utils/AddEditModal';
import SearchField from '../utils/SearchField';
import InputField from '../utils/form/InputField';
import DataField from '../utils/form/DataField';
import DropdownSelect from '../utils/form/DropdownSelect';
import TextAreaField from '../utils/form/TextAreaField';
import INFO_ERROR from '../utils/form/InfoError';

const email_reg_exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const whitespace_reg_ex = /^[^\s].*/;
const url_reg_ex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

const FIELDS = [
    'titolo',
    'durata',
    'trama',
    'disponibile',
    'data_uscita',
    'prezzo',
    'img',
    'attori',
    'id_categoria',
    'id_regista'
];

const LOWER_CASE = [    
];

export default class CatalogoModal extends Component {

    constructor(props){
        super(props);

        let data = {};
        let error = {};

        FIELDS.map((fd,id) => {
            if(fd=='attori'){
                data[fd] = {
                    id:[],
                    nome:[]
                };
                error[fd]= '';
            }else{
                data[fd] = '';
                error[fd]= '';
            }
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
            if(fd=='attori'){
                data[fd] = {
                    id:[],
                    nome:[]
                };
                error[fd]= '';
            }else{
                data[fd] = '';
                error[fd]= '';
            }
        });
        this.state.data= data;
        this.state.error =error;
        this.state.loader = false;
        this.state.checked = false;
    }

    setRemoteData() {

        let url = this.props.url+'/video';

        let headers = {headers: {'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        let data = this.state.data;
        let sendData = {};

        FIELDS.map((f,k) => {
            if(f!='attori')
                if(typeof data[f] === 'string')
                    sendData[f] = LOWER_CASE.includes(f) ?  data[f].trim().toLowerCase() : data[f].trim();
                else
                    sendData[f] = data[f]
        });

        sendData._token = CSRF_TOKEN;        
        sendData.id_attori = data.attori.id;
        
        //console.log(sendData);return;

        this.setState({loader:true});

        return axios.post(url,sendData,headers)
        .then(result => {
            console.log(result);
            
            if(this.props.callback !== undefined)
                this.props.callback(data);

            this.props.onHide();
            this.state.loader = false;
            
            return result;
        }).catch((error) => {
            console.error(error)
            let msg ='';
            if(error.response!==undefined){
                if(error.response.data.errors!==undefined)
                    msg = error.response.data.errors;
                // else if(error.response.data.message!==undefined)
                //     msg = error.response.data.message;
            }                
            this.setState({remoteError: msg, loader:false}); 
          //throw error;
        });
    }

    _handleOnSave(){
        console.log("save");
        this.setRemoteData();
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
            case 'titolo':
                if( value.length > 0 && !whitespace_reg_ex.test(value))
                    error.titolo = INFO_ERROR['caratteri'];
                break;
            case 'durata':
                if(isNaN(value) ||  !whitespace_reg_ex.test(value))
                   error.durata = INFO_ERROR['numero'];
                break;
            case 'trama':
                value = value.toUpperCase();
                if(value.length > 0 && !whitespace_reg_ex.test(value))
                    error.trama = INFO_ERROR['caratteri'];
                break;
            case 'disponibile':
                if(value.length > 0 && !whitespace_reg_ex.test(value))
                    error.disponibile = INFO_ERROR['caratteri'];
                break;
            case 'data_uscita':                
                break;
            case 'prezzo':
                if(isNaN(value))
                   error.prezzo = INFO_ERROR['numero'];
                break;
            case 'img':
                if(value.length > 0 && !whitespace_reg_ex.test(value))
                    error.img = INFO_ERROR['caratteri'];
                else if(value.length > 2048)
                    error.img = INFO_ERROR['limite_caratteri'];
                else if(!url_reg_ex.test(value))
                    error.img = INFO_ERROR['img'];                
                break;            
        }

        data[field] = value;

        this.setState({data,error},()  => this.checked());
    }

    checked(){
        let data = this.state.data;
        let error = this.state.error;

        let checked = true;
        Object.keys(error).map((key,id) => {
            if(key=='attori'){
                if(error[key]!='' || data[key].id.length == 0)
                checked = false;
            }else if(error[key]!='' || data[key]=='')
                checked = false;
            else if(key=='prezzo' && data[key]==0)
                checked = false;
        });
        // console.log(checked)
        // console.log(data)
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

        let data = this.state.data;

        let objDisp = {'0':'Non disponibile','1':'Disponibile'};

        let remoteError = this.state.remoteError;

        
        let divClassName = 'mb-3';

        let urlGeneri = this.props.url+'/generi/search';
        let urlRegisti = this.props.url+'/registi/search';
        let urlAttori = this.props.url+'/attori/search';

        return(
            <AddEditModal size="md"
                show={this.props.show}
                onHide={(a) => {this.props.onHide(a);this._resetAfterClose();}}
                url={this.props.url}
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
                        <TextAreaField name="trama" divClassName={divClassName} className="form-control" label="Trama"
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
                            url={urlGeneri}
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
                            resetAfterClick={true}
                            onClick={(val) => {
                                    //console.log(val);
                                    
                                    let data = this.state.data;
                                    let error = this.state.error;

                                    if(!data.attori.id.includes(val.id)){
                                        data.attori.id.push(val.id)
                                        data.attori.nome.push(val.nome + ' ' + val.cognome)
                                        
                                        //let id = Object.keys(error.attori).length;                                        
                                        if(data.attori.id.length>0)
                                            error.attori = '';

                                        this.state.data = data;
                                        this.state.error = error;
                                        
                                        this.checked();
                                    }
                                    //this.setState({data,error},() => this.checked());
                                }
                            }                            
                        />
                        {this.showError('attori')}

                        <div className="ml-2 my-3">
                            <ul>
                                {
                                    data.attori.id.map((id,key) => {
                                        //console.log(key); return;
                                        let nome = data.attori.nome[key];
                                        let cnt = key+1;
                                        //console.log(cnt); return;
                                        return(
                                            <li key={key} className="mb-3">
                                                <span>{cnt}. </span>&nbsp;                                                                                                
                                                <span>{nome}</span>
                                                <div 
                                                className="btn-clear d-inline-block ml-3 p-1"
                                                onClick={(a) => {

                                                    let data = this.state.data;
                                                    let error = this.state.error;
                                                    
                                                    data.attori.id.splice(key,1);
                                                    data.attori.nome.splice(key,1);
                                                    
                                                    if(data.attori.id.length==0)
                                                        error.attori = INFO_ERROR['attore_2'];

                                                    //console.log(error.ingredienti)
                                                    this.state.data = data;
                                                    this.state.error = error;
                                                    
                                                    this.checked();

                                                }}   
                                                ><i className="fa fa-times" aria-hidden="true"></i></div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>

                    <div className="form-group">
                        <InputField name="img" divClassName={divClassName} className="form-control" label="Link immagine"
                        helperText={this.showError('img')} handleChange={this._handleChange} />                        
                    </div>

                    <div className="form-group">
                        <InputField name="prezzo" divClassName={divClassName} className="form-control" label="Prezzo €"
                        helperText={this.showError('prezzo')} handleChange={this._handleChange} />                        
                    </div>

                    <div className="form-group">
                        <DropdownSelect placeholder="Scegli un valore"
                        name="disponibile" className="form-control" label="Disponibilità"
                        values={objDisp}
                        defaultSelected='Scegli un valore'
                        handleChange={this._handleChange} />
                    </div>

                    { typeof remoteError ==='object' && 
                        <div className="alert alert-danger" role="alert">
                            <strong>Attenzione!</strong>
                            {
                                Object.keys(remoteError).map((a,k1) => <div key={k1}>{remoteError[a].map((s,k2) => <span key={k2}>{s} </span>)}</div>)
                            }
                        </div>
                    }

                </form>
            </AddEditModal>
        );
    }
}
