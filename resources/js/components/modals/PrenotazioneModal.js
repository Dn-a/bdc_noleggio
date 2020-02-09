import React, { Component , Fragment } from 'react';
import cx from "classnames";
import {URL_HOME} from '../Env';

import AddEditModal from '../utils/AddEditModal';
import SearchField from '../utils/SearchField';
import INFO_ERROR from '../utils/form/InfoError';
import DataField from '../utils/form/DataField';

const FIELDS = [
    'id_cliente',
    'id_video'
];


export default class NoleggoModal extends Component {

    constructor(props){
        super(props);

        let data = {};
        let error = {};

        FIELDS.map((fd,id) => {
            if(fd=='id_cliente')
                data[fd] = error[fd]= '';
            else{
                data[fd] = [];
                error[fd]= [];
            }
        });

        this.state = {
            data: data,
            error: error,
            idVideoCheck:[],
            checked: false,
            openModal: false,
            loader: false,
            complited: false
        };

        this.home = URL_HOME;

        this._handleChange = this._handleChange.bind(this);
        this._handleOnSave = this._handleOnSave.bind(this);
    }

    _resetAfterClose () {
        let data = {};
        let error = {};

        FIELDS.map((fd,id) => {
            if(fd=='id_cliente')
                data[fd] = error[fd]= '';
            else{
                data[fd] = [];
                error[fd]= [];
            }
        });

        this.state.data=data;
        this.state.error =error;
        this.state.idVideoCheck = [];
        this.state.loader = false;
        this.state.checked = false;
        this.state.openModal = false;
        this.state.complited = false;
    }

    componentDidUpdate (){
        if(this.props.show)
            this._onOpenModal();
    }

    _onOpenModal(){
        if(this.state.openModal) return
        let externalRows = this.props.externalRows !== undefined ? this.props.externalRows : [];
        let data = this.state.data;
        let error = this.state.error;

        FIELDS.map((fd,id) => {
            switch(fd){
                case 'id_video':
                    externalRows.map((row,key) => {
                        data[fd][key] = row.id;
                        error[fd][key] = '';
                    })
                    break;
            }
        });

        this.setState({data,error,openModal:true});
    }

    setRemoteStore() {

        let url = this.props.url+'/prenotazioni';

        let headers = {headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        };

        let data = this.state.data;

        data['_token'] = CSRF_TOKEN;

        //console.log(data);return;

        this.setState({loader:true});

        return axios.post(url,data,headers)
        .then(result => {
            //console.log(result.data);return;
            /*this.setState({complited:true, loader:false},()=>{
                if(this.props.callback !== undefined)
                    this.props.callback(data);
            });*/
            if(this.props.callback !== undefined)
                this.props.callback(data);
            this.props.onHide();
            this._resetAfterClose();
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

    _handleChange(e,key,row){
        let value = e.target.value.toLowerCase();
        let field = e.target.name;

        let error = this.state.error;
        let data = this.state.data;

        if(value=='')
            error[field][key] = INFO_ERROR['vuoto'];
        else
            error[field][key] = '';
        let sct = 0;
        switch(field){

        }

        data[field][key] = value;

        this.setState({data,error},()  => this.checked());
    }

    checked(){
        let data = this.state.data;
        let error = this.state.error;

        let checked = true;
        Object.keys(error).map((k,id) => {
            if(k=='id_cliente' && (error[k]!='' || data[k]=='' || data[k]==undefined))
                checked = false;
            else if(error[k] instanceof Array)
                // some ritorna true se all'interno del loop viene soddisfatta la condizione
                if(
                    !error[k].some((v) =>{
                        if(v!=''){
                            checked= false;
                            return true;
                        }
                    })
                )
                    data[k].some((v) =>{
                        if(v==''){
                            checked= false;
                            return true;
                        }else if(k=='id_video' && this.state.idVideoCheck.includes(v)){
                            checked= false;
                            return true;
                        }
                    })
        });


        this.setState({checked});
    }


    showError(field,key){
        let error = '';

        if(this.state.error[field][key]!== undefined)
         error = this.state.error[field][key];
        else if(this.state.error[field]!=undefined)
            error = this.state.error[field];

        if(error != '')
          return(
            <div className="error-div">{error}</div>
          );
    }

    render(){

        let divClassName = 'mb-3';
        let urlCliente = this.props.url+'/clienti/search';

        let externalRows = this.props.externalRows !== undefined ? this.props.externalRows : [];

        let idVideoSearch = JSON.stringify(this.state.data.id_video);

        let showError = false;

        return(
            <AddEditModal size="lg"
                show={this.props.show}
                onHide={(a) => {this.props.onHide(a);this._resetAfterClose();}}
                loader={this.state.loader}
                onConfirm={this._handleOnSave}
                txtConfirmButton={this.state.complited? 'Prenotato': 'Prenota'}
                disabledConfirmButton={!this.state.checked || this.state.complited}
                title="Video" type="Prenotazione"
            >

                <div className="form-group w-50 mb-4">
                    <SearchField
                        label="Cliente"
                        query={'id_video_prenotazioni='+idVideoSearch}
                        placeholder='Cerca un Cliente'
                        searchClassName='w-100'
                        showList={true}
                        url={urlCliente}
                        patternList={{id:'id', fields:{nome:[],cognome:[],cf:[]} } }//id di ritorno; i fields vengono usati come titolo
                        reloadOnClick={false}
                        onClick={(val) => {
                                //console.log(val.id_video);
                                let data = this.state.data;
                                let idVideoCheck = this.state.data;
                                let error = this.state.error;
                                data.id_cliente = val.id;
                                idVideoCheck = val.id_video;
                                error.id_cliente = '';

                                this.setState({data,idVideoCheck,error},() => this.checked());
                            }
                        }
                        callback={(val) => {
                                //console.log(val);
                                let data = this.state.data;
                                let error = this.state.error;

                                data.id_cliente = '';
                                data.idVideoCheck = [];

                                if(val.length==0){
                                    error.id_cliente = INFO_ERROR['cliente'];
                                }
                                this.setState({data,error},() => this.checked());
                            }
                        }
                    />
                    {this.showError('id_cliente')}
                </div>

                <div className="form-group">
                        <div className='table-responsive'>
                            <label>Film selezionati</label>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>N</th>
                                        <th>Titolo</th>
                                        <th>Prezzo</th>
                                        <th>Data Uscita</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        externalRows.map((row,key) => {
                                            let data = this.state.data;
                                            let check = this.state.idVideoCheck.includes(row.id);
                                            if(check) showError = true;
                                            //console.log(row.id);

                                            return(
                                                <tr key={key} style={{background:check?'#ffb8b8':'inherit'}}>
                                                    <td>{(key+1)}</td>
                                                    <td>{row.titolo}</td>
                                                    <td>{parseFloat(row.prezzo).toFixed(2) +' €'}</td>
                                                    <td>
                                                        {new Date(row.data_uscita).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"})}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            {showError &&
                               <div className="error-div">I video evidenziati in rosso risultano già prenotati</div>
                            }
                        </div>
                    </div>


            </AddEditModal>
        );
    }
}
