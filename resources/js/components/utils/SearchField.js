import React, { Component , Fragment } from 'react';
import {URL_HOME} from '../Env';

import InputField from './form/InputField';

// Proprietà
//
// - reloadOnClick: esegue una nuova ricerca
// - handles: consente di richiamare alcune funzioni dall'esterno {reset,recall}

export default class SearchField extends Component {

    constructor(props){
        super(props);

        this.timeOut = 500;// timeout before remote call

        this.state = {
            value : '',
            data: [],
            loader:false,
            infoSearch:''
        };

        this.home = URL_HOME;

        this._getRemoteData = this._getRemoteData.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleClick = this._handleClick.bind(this);
        this._timeOut = this._timeOut.bind(this);

        this._handleReset = this._handleReset.bind(this);
        this._handleRecall = this._handleRecall.bind(this);
    }

    _getRemoteData(val){

        let query = this.props.query !== undefined ? this.props.query :'';
        let qStrings = '';

        if(query!='')
            qStrings = '?&'+query;

        let url = this.props.url + '/' + val + qStrings;
        let headers = {headers: {
            'Accept': 'application/json',
            //'Content-Type': 'application/json'
            }
        };

        this.setState({loader:true});
        //console.log(url);
        return axios.get(url, headers )
			.then(res => {
                let data = res.data;

                //console.log(data);

                if(this.props.callback !== undefined)
                    this.props.callback(data);

                return data;
                //this.setState({ data:data, loader:false });

                //this.setState({data});

			}).catch((error) => {
				console.log(error.response.data);
				if(error.response.status==401)
					if(window.confirm('Devi effettuare il Login, Clicca ok per essere reindirizzato.'))
						window.location.href=this.home + '/login';
            });
    }

    // dopo aver inserito un carattere nel campo
    _handleChange(e){
        //console.log(e.target.value);
        let value = e.target.value;

        this.setState({value:value});

        this._timeOut(value).then((data) =>
            {
                //console.log(data==null)
                let size = data!=null && data.data !== undefined ? data.data: data;

                this.setState({ data: size==null? []: data, infoSearch: size==0? 'nessun risultato':'', loader:false })}
        );
    }

    // Click sugli elementi della lista risultati
    _handleClick(val){
        let patternList = this.props.patternList!== undefined ? this.props.patternList : {id:'',fields:[]};
        let txt ='';

        let fieldsKey = Object.keys(patternList.fields);
        fieldsKey.map((field,key) => {

            if(patternList.fields[field].length==0){
                txt += val[field];
                txt += fieldsKey.length > (key+1) ? ' ':'';
            }else
                patternList.fields[field].map((f,k) => {
                    txt += val[field][f];
                    txt += patternList.fields[field].length > (k+1) ? ' ':'';
                })

        });

        /*
        patternList.fields.map((field,key) => {
            txt += val[field];
            txt += patternList.fields.length > (key+1) ? ' ':'';
        })*/

        //console.log(txt)
        this.setState({value:txt});

        // Effettua una nuova ricerca con l'elemento della lista selezionato
        let reload = this.props.reloadOnClick!== undefined ? this.props.reloadOnClick : true;

        if(!reload)
            this.setState({ data:[], infoSearch:''});
        else
            this._timeOut(txt,0).then((data) => { if(data!=null) this.setState({ data:[], loader:false })} );

        if(this.props.onClick!== undefined)
            this.props.onClick(val);
    }

    // Richiama getRemoteData dopo un certo tempo T
    _timeOut(value,time){
        let setTime = time!== undefined ? time : this.timeOut;

        clearTimeout(this.timer);

        return new Promise((resolve, reject) => {

            if(value==''){
                if(this.props.callback!== undefined)
                    this.props.callback([], true);// comunica al componente padre che non ci sono dati da visulalizzare, il secondo argomento indica che il campo ricerca è vuoto
                return resolve(null);
            }

            this.timer = setTimeout( () => {
                //console.log("tt");
                resolve(this._getRemoteData(value));
            },setTime);
        });
    }

    _handleReset(r){
        //console.log("reset");

        this.setState({value:'',data:[],infoSearch:''});

        if(this.props.callback!==undefined)
            this.props.callback([], true);
    }

    _handleRecall(check){
        let value =this.state.value;

        if(!check || (!value)) return;

        console.log("search recall");

        this._timeOut(value,0).then(
            (data) =>
            {
                if(data!=null) this.setState({ data:[], loader:false })
            }
        );
    }

    render(){

        if(this.props.handles!==undefined)
            this.props.handles(this._handleReset,this._handleRecall);

        let data = this.state.data.data!==undefined ? this.state.data.data : this.state.data;
        let patternList = this.props.patternList!== undefined ? this.props.patternList : {id:'',fields:[]};
        let showList = this.props.showList!== undefined ? this.props.showList : false;

        let searchClassName = this.props.searchClassName!== undefined ? this.props.searchClassName:'';

        return(
            <div className={"search-field "+searchClassName}>
                <InputField value={this.state.value} autocomplete='on'  divClassName="d-inline" className="form-control d-inline-block" name="search_field"
                placeholder={this.props.placeholder!== undefined? this.props.placeholder:"Cerca"}
                label={this.props.label!== undefined? this.props.label:''}
                handleChange={this._handleChange} />
                <div className={"img-loader " + (this.state.loader ? "active":'' )}>
                    <img src="../img/loader.gif" />
                </div>
                {
                    <span className="info-search">
                        {this.state.infoSearch}
                    </span>
                }
                <div onClick={() => {this._handleReset();} } className={"btn-clear " + (this.state.value !='' ? "active":'' )}>
                    <i className="fa fa-times" aria-hidden="true"></i>
                </div>
                {showList &&
                    <div className="search-list text-left">
                        <ul className="list-group">
                            {data.map((val,id) => {
                                    return(
                                        <li key={id} id={val[patternList.id]}
                                        onClick={() => this._handleClick(val)}
                                        className="list-group-item">
                                            {
                                                Object.keys(patternList.fields).map((field,key) => {

                                                    if(patternList.fields[field].length==0)
                                                        return(
                                                            <Fragment key={key}>
                                                                {val[field]} &nbsp;
                                                            </Fragment>
                                                        )
                                                    if(val[field] instanceof Object)
                                                        return(
                                                            patternList.fields[field].map((f,k) => {
                                                                return(
                                                                    <Fragment key={key+k}>
                                                                        {val[field][f]} &nbsp;
                                                                    </Fragment>
                                                                )
                                                            })
                                                        )
                                                })
                                            }
                                            {/*patternList.fields.map((field,id) => {
                                                console.log(val['comune']);
                                                if(field instanceof Object)
                                                    Object.keys(field).map((f,k) => {
                                                        if(val[f] instanceof Object)
                                                            <Fragment key={id}>
                                                                {val[field[f]]} &nbsp;
                                                            </Fragment>
                                                    });
                                                if(val[field] instanceof Object) return 'aa';
                                                return(
                                                    <Fragment key={id}>
                                                        {val[field]} &nbsp;
                                                    </Fragment>
                                                )
                                            })*/}
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                }
            </div>
        );
    }

}
