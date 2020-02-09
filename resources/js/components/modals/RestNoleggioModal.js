import React, { Component , Fragment } from 'react';
import cx from "classnames";
import {URL_HOME} from '../Env';

import AddEditModal from '../utils/AddEditModal';
import CheckField from '../utils/form/CheckField';


const FIELDS = [
    'id_cliente',
    'id_noleggio',
    'danneggiato',
    'prezzo_extra'
];

const HIDE_FIELD = [

]

export default class RestNoleggioModal extends Component {

    constructor(props){
        super(props);

        let data = {};

        FIELDS.map((fd,id) => {
            if(fd=='id_cliente')
                data[fd] = '';
            else{
                data[fd] = [];
            }
        });

        this.state = {
            data: data,
            checked: true,
            openModal: false,
            loader: false,
            complited: false,
            totPagare: 0,
            pdf:''
        };

        this.home = URL_HOME;

        this._handleChange = this._handleChange.bind(this);
        this._handleOnSave = this._handleOnSave.bind(this);
    }

    _resetAfterClose () {
        let data = {};

        FIELDS.map((fd,id) => {
            data[fd] = [];
        });
        this.state.data=data;
        this.state.loader = false;
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

        //console.log(externalRows[0])
        data['id_cliente'] = externalRows[0].id_cliente;

        FIELDS.map((fd,id) => {
            switch(fd){
                case 'id_noleggio':
                    externalRows.map((row,key) => {
                        data[fd][key] = row.id;
                        data['danneggiato'][key] = 0;
                    })
                    break;
                case 'prezzo_extra':
                    externalRows.map((row,key) => {
                        data[fd][key] = row.prezzo*row.giorni_ritardo;
                    })
                    break;
            }
        });

        this.setState({data,openModal:true});
    }

    setRemoteStore() {

        let data = this.state.data;

        let url = this.props.url+'/noleggi/'+data.id_cliente;

        let headers = {headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        };

        data['_token'] = CSRF_TOKEN;
        data['_method'] = 'put';

        //console.log(data);return;

        this.setState({loader:true});

        return axios.post(url,data,headers)
        .then(result => {
            //console.log(result.data);return;
            this.setState({complited:true, pdf:result.data.pdf, loader:false},()=>{
                if(this.props.callback !== undefined)
                    this.props.callback(data);
            });
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
        let value = e.target.value;
        let field = e.target.name;
        field = field.split('_')[0].toString();

        let data = this.state.data;
        let extra = 0;

        switch(field){
            case 'danneggiato':
                value =  Math.abs(value -1);
                extra = row.prezzo*2;
                if(value==1){
                    data['prezzo_extra'][key] += extra;
                }else
                    data['prezzo_extra'][key] -= extra;
                break;
        }

        //console.log(fld)
        data[field][key] = value;

        this.setState({data});
    }


    render(){

        let divClassName = 'mb-3';

        let externalRows = this.props.externalRows !== undefined ? this.props.externalRows : [];
        //console.log(externalRows)
        // dopo aver completato la fase di restituzione, il server trasmetterà
        // un pdf in formato base64 come risposta
        let linkSource = this.state.pdf!=''? 'data:application/pdf;base64,'+this.state.pdf:'';
        let fileName = 'ricevuta_pagamento.pdf';

        //calcolo prezzo totale
        var totPagare = 0;

        return(
            <AddEditModal size="lg"
                show={this.props.show}
                onHide={(a) => {this.props.onHide(a);this._resetAfterClose();}}
                loader={this.state.loader}
                onConfirm={this._handleOnSave}
                txtConfirmButton={this.state.complited ? 'Confermato':'Conferma'}
                disabledConfirmButton={!this.state.checked || this.state.complited}
                title="Video" type="Restituzione"
            >
                <div className=
                    {cx("switch", {
                        "is-active": !this.state.complited,
                    })}
                >
                    <div className="form-group w-50 mb-4">
                        {externalRows.length>0 &&
                            <h4><strong>Cliente:</strong> {externalRows[0].cliente}</h4>
                        }
                    </div>

                    <div className="form-group">
                            <div className='table-responsive'>
                                <label>Noleggi selezionati</label>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Titolo</th>
                                            <th>Importo</th>
                                            <th>Danneggiato</th>
                                            <th>Giorni Ritardo</th>
                                            <th>Importo complessivo<br/>
                                                <span style={{fontSize:'0.8em',color:'#aaa'}}>compresi (ritardi + danni)</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            externalRows.map((row,key) => {
                                                let prezzoTot = row.prezzo_tot;
                                                let prezzoExta = this.state.data.prezzo_extra[key];
                                                let complessivo = prezzoTot + prezzoExta;
                                                let danneggiato = this.state.data.danneggiato[key];

                                                totPagare += complessivo;
                                                //console.log(row)
                                                return(
                                                    <tr key={key}>
                                                        <td>{row.id}</td>
                                                        <td>{row.video}</td>
                                                        <td>
                                                            {parseFloat(prezzoTot).toFixed(2) +' €'}
                                                        </td>
                                                        <td>
                                                            <CheckField  label="Danneggiato"
                                                                value={danneggiato}
                                                                checked={danneggiato==1}
                                                                name={'danneggiato_'+key}
                                                                handleChange={(e) => this._handleChange(e,key,row)}
                                                            />
                                                            <span style={{fontSize:'0.5',color:'#ccc'}}>
                                                                {parseFloat(row.prezzo*2).toFixed(2)} ({row.prezzo} * 2)  €
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {row.giorni_ritardo}
                                                        </td>
                                                        <td>
                                                            {parseFloat(complessivo).toFixed(2) +' €'}
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
                        <h2>Restituzione conclusa!</h2>
                        <div className="mt-3">Scarica la ricevuta</div>

                        <a className="pdf" href={linkSource} download={fileName}>
                            <i className="fa fa-file-pdf-o" aria-hidden="true"></i> Ricevuta di Pagamento
                        </a>
                    </div>
                </div>



            </AddEditModal>
        );
    }
}
