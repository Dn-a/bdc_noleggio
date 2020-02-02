import React, { Component , Fragment } from 'react';
import cx from "classnames";

import AddEditModal from '../utils/AddEditModal';
import SearchField from '../utils/SearchField';
import INFO_ERROR from '../utils/form/InfoError';
import DataField from '../utils/form/DataField';

const FIELDS = [
    'id_cliente',
    'id_video',
    'prezzo_tot',
    'data_fine'
];

const HIDE_FIELD = [

]

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
            sconto:[],
            checked: false,
            openModal: false,
            loader: false,
            complited: false,
            pdf:''
        };

        this._handleChange = this._handleChange.bind(this);
        this._handleOnSave = this._handleOnSave.bind(this);
    }

    _resetAfterClose () {
        let data = {};
        let error = {};

        FIELDS.map((fd,id) => {
            data[fd] = [];
            error[fd]= [];
        });
        this.state.data=data;
        this.state.error =error;
        this.state.sconto = [];
        this.state.loader = false;
        this.state.checked = false;
        this.state.openModal = false;
        this.state.complited = false;
        this.state.pdf = '';
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
        let sconto = this.state.sconto;

        FIELDS.map((fd,id) => {
            switch(fd){
                case 'id_video':
                    externalRows.map((row,key) => {
                        data[fd][key] = row.id;
                        error[fd][key] = '';
                        sconto[key] = 0;
                    })
                    break;
                case 'prezzo_tot':
                    //let giorni = Math.round((Date.parse(tomorrow)-(new Date()).getTime())/8640000);
                    externalRows.map((row,key) => {
                        data[fd][key] = row.prezzo;
                        error[fd][key] = '';
                    })
                    break;
                case 'data_fine':
                    let tomorrow = new Date();
                    tomorrow.setDate((new Date()).getDate() + 1);
                    //tomorrow = tomorrow.toJSON().slice(0, 10);
                    tomorrow = tomorrow.getFullYear()+'-'+("0" + (tomorrow.getMonth() + 1)).slice(-2)+'-'+("0" + tomorrow.getDate()).slice(-2);
                    externalRows.map((row,key) => {
                        error[fd][key] = '';
                        data[fd][key] = tomorrow;
                    })
            }
        });

        this.setState({data,error,openModal:true});
    }

    setRemoteStore() {

        let url = this.props.url+'/noleggi';

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
            //console.log(result.data.pdf);return;
            this.setState({complited:true, pdf:result.data.pdf, loader:false},()=>{
                if(this.props.callback !== undefined)
                    this.props.callback(data);
            });
            return result;
        }).catch((error) => {
          console.error(error.response.data);
          this.setState({errorRemoteStore:error.response.status});
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
        let sconto = this.state.sconto;

        if(value=='')
            error[field][key] = INFO_ERROR['vuoto'];
        else
            error[field][key] = '';
        let sct = 0;
        switch(field){
            case 'data_fine':
                let today = new Date();
                let date = value==''?new Date():new Date(value);
                if(value=='')
                    error[field][key] = INFO_ERROR['vuoto'];
                else if(date.getTime() <= today.getTime() )
                    error[field][key] = INFO_ERROR['data'];
                else {
                    let giorni = this._calcDay(date);
                    if(giorni>1){
                        sct = row.prezzo * ( giorni/40);
                        sct =  sct > (row.prezzo/2) ? row.prezzo/2 : sct;
                    }
                    data.prezzo_tot[key] = (giorni * row.prezzo) - sct;
                }
                break;
        }

        data[field][key] = value;

        sconto[key] = sct;

        this.setState({data,error,sconto},()  => this.checked());
    }

    checked(){
        let data = this.state.data;
        let error = this.state.error;

        let checked = true;
        Object.keys(error).map((k,id) => {
            if(k=='id_cliente' && (error[k]!='' || data[k]==''))
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
                        }
                    })
        });


        this.setState({checked});
    }

    _calcDay(date){
        let now = new Date();
        now = new Date(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate());
        let day = ( Date.parse(date) - now.getTime() ) / (3600000*24);
        let giorni = date=='000-00-00' || Date.parse(date) <= now.getTime() ? 0 : Math.round(day);
        //console.log(day); console.log(giorni);
        return giorni;
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

    _complited(){
        return(
            <div>
                suca
            </div>
        )
    }

    render(){

        let divClassName = 'mb-3';
        let urlCliente = this.props.url+'/clienti/search';

        let externalRows = this.props.externalRows !== undefined ? this.props.externalRows : [];

        // dopo aver completato il noleggio, il server trasmetterà
        // un pdf in formato base64 come risposta
        let linkSource = this.state.pdf!=''? 'data:application/pdf;base64,'+this.state.pdf:'';
        let fileName = 'ricevuta_noleggio.pdf';

        //calcolo prezzo totale
        var totPagare = 0;

        return(
            <AddEditModal size="lg"
                show={this.props.show}
                onHide={(a) => {this.props.onHide(a);this._resetAfterClose();}}
                loader={this.state.loader}
                onConfirm={this._handleOnSave}
                txtConfirmButton='Noleggia'
                disabledConfirmButton={!this.state.checked || this.state.complited}
                title="Video" type="Noleggio"
            >
                <div className=
                    {cx("switch", {
                        "is-active": !this.state.complited,
                    })}
                >
                    <div className="form-group w-50 mb-4">
                        <SearchField
                            label="Cliente"
                            placeholder='Cerca un Cliente'
                            searchClassName='w-100'
                            showList={true}
                            url={urlCliente}
                            patternList={{id:'id', fields:{nome:[],cognome:[],cf:[]} } }//id di ritorno; i fields vengono usati come titolo
                            reloadOnClick={false}
                            onClick={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_cliente = val.id;
                                    error.id_cliente = '';
                                    this.setState({data,error},() => this.checked());
                                }
                            }
                            callback={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_cliente = '';
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
                                            <th>Data restituzione</th>
                                            <th>Giorni</th>
                                            <th>Sconto giorni</th>
                                            <th>Prezzo complessivo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            externalRows.map((row,key) => {
                                                let data = this.state.data;
                                                let date = data.data_fine[key]==null || data.data_fine[key]==''?'000-00-00':data.data_fine[key];
                                                let giorni = this._calcDay(date);
                                                let prezzoTot = data.prezzo_tot[key];
                                                let sconto = this.state.sconto[key];
                                                totPagare += prezzoTot;
                                                //console.log(date)
                                                return(
                                                    <tr key={key}>
                                                        <td>{(key+1)}</td>
                                                        <td>{row.titolo}</td>
                                                        <td>{parseFloat(row.prezzo).toFixed(2) +' €'}</td>
                                                        <td>
                                                            <DataField
                                                                name ="data_fine" className="form-control"
                                                                placeholder='data fine'
                                                                helperText={this.showError('data_fine',key)}
                                                                value={date}
                                                                handleChange={(e) => this._handleChange(e,key,row)}
                                                            />
                                                        </td>
                                                        <td>
                                                            {giorni}
                                                        </td>
                                                        <td>{parseFloat(sconto).toFixed(2) +' €'}</td>
                                                        <td>
                                                            {parseFloat(prezzoTot).toFixed(2) +' €'}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="text-right p-2 px-4">
                            <strong>Totale da pagare:</strong> {parseFloat(totPagare).toFixed(2) +' €'}
                        </div>
                    </div>

                </div>

                <div className=
                    {cx("switch complited-msg", {
                        "is-active": this.state.complited,
                    })}
                >
                    <div className="form-group">
                        <h2>Noleggio concluso!</h2>
                        <div className="mt-3">scarica la ricevuta</div>

                        <a className="pdf" href={linkSource} download={fileName}>
                            <i className="fa fa-file-pdf-o" aria-hidden="true"></i> Ricevuta Noleggio
                        </a>
                    </div>
                </div>



            </AddEditModal>
        );
    }
}
