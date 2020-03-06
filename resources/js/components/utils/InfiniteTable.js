import React, { Component , Fragment } from 'react';
import SearchField from './SearchField';
import {URL_HOME} from '../Env';

// Proprietà
//
// - id: required
// - url: endpoint remoto
// - columns: accetta una lista di oggetti {id:'',title:'',render:'',style:'',img:''}
// - query: eventuali query string da accodare all'url
// - reload: valore di tipo integer, se è diverso da quello precedente, viene eseguito un refresh della tabella
// - externalRows: uso temporaneo; adotterò soluzioni migiori in futuro
// - multiSelect: tipo boolean, attiva/disattiva la selezione multipla delle righe
// - selectedList: riceve in ingresso una lista di ID dei dati visulalizzati in tabella
// - multiSelectCallback: ritorna un set di dati inerenti le righe selezionate
// - onClick: intercetta il click sulla singola riga
// - onActions: metodo invocato da eventuali azioni implementate nel render del campo columns - argomenti(object)

export default class InfiniteTable extends Component {

    constructor(props){
        super(props);

        this.state = {
            data: {
                rows: [],
                columns: this.props.columns,
                page : 0,
                total : 0,
                perPage : 0,
            },
            selectedList:[],
            moreData:true,
            loader:false,
            reload:0,

            searchValue : '',
            searchLoader:false,
            searchInfo:''
        };

        this.home = URL_HOME;

        this._handleScroll = this._handleScroll.bind(this);
        this._moreData = this._moreData.bind(this);
        this._handleMultiSelection = this._handleMultiSelection.bind(this);

        // Search field
        this.timeOut = 500;// timeout before remote call
        this._handleChangeSearch = this._handleChangeSearch.bind(this);
        this._onClickItemSearch = this._onClickItemSearch.bind(this);
        this._timeOutSearch = this._timeOutSearch.bind(this);

        this._handleActions = this._handleActions.bind(this);
    }

    componentDidMount () {
        //console.log("load table");
        let content = document.getElementById('content');
        content.addEventListener('scroll', this._handleScroll);
        this.getRemoteData().then((a) => this._moreData());
    }

    componentWillUnmount () {
        this.state.data={};
        document.getElementById('content').removeEventListener('scroll', this._handleScroll);
    }

    componentDidUpdate(){
        /*
        if(this.props.selectedList !== undefined && this.props.selectedList instanceof Array){
            this.state.selectedList = this.props.selectedList;
        }*/

        if(this.props.reload!==undefined && this.props.reload > this.state.reload){
            this.state.reload = this.props.reload;
            this.state.data.rows = [];
            console.log("table reload");
            this.getRemoteData().then((a) => this._moreData());
        }
    }

    getRemoteData(page){

        let query = this.props.query !== undefined ? this.props.query :'';
        let qStrings = '';

        if(query!='' || page!=null){
            qStrings = '?';
            if(page!=null)
                qStrings += 'page='+page;
            if(query!='')
                qStrings += '&'+query;
        }

        let url = this.props.url+qStrings;
        let headers = {headers: {
            'Accept': 'application/json',
            //'Content-Type': 'application/json'
            }
        };
        //console.log(url);
        
        this.setState({loader:true});

        return axios.get(url, headers )
			.then(res => {
                let data = this.state.data;
                let moreData = this.state.moreData;

                let remoteData = res.data;
                let pagination = remoteData.pagination;

                if(remoteData.data.length > 0)
                    moreData = true;

                data.rows.push(...remoteData.data);
                data.page = pagination.current_page;
                data.total = pagination.total;
                data.perPage = pagination.per_page;

                this.setState({data,moreData,loader:false});

                //console.log(res.data);

			}).catch((error) => {
                //if(error.response===undefined) return;
                if(error.response.data!==undefined)
                    console.log(error.response.data);
                else
                    console.log(error.response);
				if(error.response.status==401)
					if(window.confirm('Devi effettuare il Login, Clicca ok per essere reindirizzato.'))
						window.location.href=this.home + '/login';
			});
    }

    _onClick(row){
        if(this.props.onClick!==undefined)
            this.props.onClick(row);
    } 

    // Multiselezione righe
    _handleMultiSelection(id,row){
        let selectedList = this.props.selectedList!==undefined?
                            this.props.selectedList: this.state.selectedList;

        if(this.props.multiSelect===undefined || !this.props.multiSelect) return;

        if(
            this.props.multiSelectSetting!=undefined &&
            this.props.multiSelectSetting.disableSelect!=undefined &&
            this.props.multiSelectSetting.disableSelect(row)
        ) return;

        let index = selectedList.indexOf(id);
        if(index>=0)
            selectedList.splice(index,1);
        else
            selectedList.push(id);

        let rows = this.state.data.rows;
        let selectedListRows = [];

        rows.map((row,k) => {
            if(selectedList.indexOf(row.id)>-1)
                selectedListRows.push(row);
        });

        if(this.props.multiSelectCallback !==undefined)
                this.props.multiSelectCallback(selectedList,selectedListRows);

                /*this.setState({selectedList},() => {

        });*/

        //console.log(id)
    }

    // quando la barra di scorrimento verticale supera una certa percentuale,
    // vengono recuperati i dati dal server remoto, incrementando la pagina di uno step.
    _handleScroll (e) {
        let sh = e.srcElement.scrollHeight;
        let oh = e.srcElement.offsetHeight;
        let scroll = e.srcElement.scrollTop;
        let percent = scroll/(sh-oh);

        //console.log(this._isDescendant())
        // in caso di una view con più tabelle, il check evita il loading dei dati remoti
        // della tabella momentaneamente invisibile
        if(!this._isDescendant()) return;

        if(percent > 0.65 && this.state.moreData){
            let page = this.state.data.page;
            this.state.moreData = false;
            console.log("Scroll loading");
            this.getRemoteData(++page);
        }
    }

    _isDescendant() {
        if(this.props.id === undefined){
            console.error("InfiniteTable: id mancante");
            return false;
        }

        let node = document.getElementById(this.props.id).parentNode;
        let parent = document.getElementsByClassName('show active')[0];

        if(parent==null || parent===undefined)
            return true;

        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    //Di default nella fase iniziale vengono recuperati un numero fisso di righe.
    // A seconda delle dimensioni dello schermo che si sta utilizzando,
    // il numero di righe iniziali potrebbero non essere sufficienti a riempire l'area dello schermo.
    // MoreData provvede a recuperare un numero di righe sufficienti ad attivare la barra di scorrimento verticale
    _moreData(){
        let content = document.getElementById('content');

        if(content.offsetHeight >= content.scrollHeight &&  this.state.moreData ){
            let page = this.state.data.page;
            this.state.moreData = false;
            console.log("More data loading");
            this.getRemoteData(++page).then((a) => this._moreData());
        }

    }

    _moreInfoTable(){
        let multiSelect = this.props.multiSelect!==undefined ? this.props.multiSelect : false;
        //let elSize = this.state.selectedList.length;
        let elSize = this.props.selectedList!==undefined?
                    this.props.selectedList.length : this.state.selectedList.length;

        if(multiSelect)
            return(
                <div className="more-info-table text-left py-2">
                    { elSize > -1 &&
                            <Fragment>
                                <div title="seleziona tutto" className="d-inline-block mr-3"
                                onClick={() =>
                                    {
                                        let rows = this.props.externalRows!=null &&  this.props.externalRows instanceof Array ? this.props.externalRows : this.state.data.rows;
                                        let selectedRow = [];
                                        let selectedList = [];

                                        rows.map((row,key) => {
                                            if(this.props.multiSelectSetting!=undefined &&
                                                this.props.multiSelectSetting.disableSelect!=undefined &&
                                                this.props.multiSelectSetting.disableSelect(row)
                                            ) return false;

                                            selectedRow.push(row);
                                            selectedList.push(row.id);
                                        });

                                        this.setState({selectedList});

                                        if(this.props.multiSelectCallback !==undefined)
                                            this.props.multiSelectCallback(selectedList,selectedRow);
                                    }
                                }>
                                    Seleziona tutto
                                </div>
                                <div title="deseleziona tutto" className={"d-inline-block mr-3 "+(elSize>0 ?'':'disable')}
                                onClick={() => {
                                    if(elSize>0) {
                                        this.setState({selectedList:[]})
                                        if(this.props.multiSelectCallback !==undefined)
                                                this.props.multiSelectCallback([],[]);
                                    }
                                }
                                }>
                                    Deseleziona tutto
                                </div>
                                <span>
                                    {elSize} elementi selezionati
                                </span>
                            </Fragment>
                    }
                </div>
            );
    }

    // Metodo richiamabile dall'actions
    _handleActions(obj,type){

        if(this.props.onActions !== undefined)
            this.props.onActions(obj,type);

        //console.log(array)
    }

    // SEARCH FIELD
    // dopo aver inserito un carattere nel campo
    _handleChangeSearch(e){
        //console.log(e.target.value);
        let value = e.target.value;

        this.setState({value:value});

        this._timeOut(value).then((data) =>
            {
                //console.log(data==null)
                let size = data!=null && data.data !== undefined ? data.data: data;

                this.setState({ data: size==null? []: data, infoSearch: size==0? 'nessun risultato':'', searchLoader:false })}
        );
    }

    // Click sugli elementi della lista risultati
    _onClickItemSearch(val){
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
            this._timeOut(txt,0).then((data) => { if(data!=null) this.setState({ data:[], searchLoader:false })} );

        if(this.props.onClick!== undefined)
            this.props.onClick(val);
    }

    // Richiama grtRemoteData dopo un certo tempo T
    _timeOutSearch(value,time){
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
                resolve(this.getRemoteData(value));
            },setTime);
        });
    }


    render(){

        let data = this.state.data;
        let columns = data.columns!= null ?  data.columns : [];
        // externalRows quando non ha dati da visualizzare,
        // deve assumere un valore stringa vuoto e non un array vuoto
        let rows = this.props.externalRows!=null &&  this.props.externalRows instanceof Array ? this.props.externalRows : data.rows;
        let idTable = this.props.id !== undefined? this.props.id:'';

        return(
            <Fragment>

                { this._moreInfoTable() }

                <table className={"table "+ (this.props.className!=undefined?this.props.className:'')} id={idTable}>
                    <thead>
                        <tr>
                            {

                            columns.map((column,id) => {
                                if(column.field=='actions')
                                    return(
                                        <th key={id} className="text-center" >{column.title}</th>
                                    );
                                else if(rows[0]!== undefined && rows[0][column.field]=== undefined)
                                    return;
                                else
                                return(
                                    <th key={id} className="text-center" >{column.title}</th>
                                );
                            })

                            }
                        </tr>
                    </thead>
                    <tbody>
                        <Fragment>
                            {
                                rows.map((row,id) => {
                                    let idField = row.id;
                                    let sl = this.props.selectedList!==undefined?
                                            this.props.selectedList: this.state.selectedList;

                                    return(
                                        <tr className={
                                                (
                                                    this.props.multiSelectSetting!=undefined &&
                                                    this.props.multiSelectSetting.disableSelect!=undefined &&
                                                    this.props.multiSelectSetting.disableSelect(row)
                                                )
                                                ?
                                                '':
                                                (
                                                    sl.indexOf(idField)>-1?'active':''
                                                )
                                            }
                                            key={id}
                                            onClick={() => {this._handleMultiSelection(idField,row),this._onClick(row);}}
                                        >
                                            {
                                                columns.map((column,id) => {
                                                    //console.log(row['img']);
                                                    let value = '';

                                                    if(column.render != undefined)
                                                        value = column.render('',row,this._handleActions);

                                                    if(column.field=='actions')
                                                        return(
                                                            <td style={column.style!==undefined?column.style:{}} key={id}>
                                                                {value}
                                                            </td>
                                                        );

                                                    // IMAGE
                                                    let img = '';
                                                    if(column.img !== undefined &&  row['img']!== undefined)
                                                        img=  row['img'];
                                                    else if(column.img !== undefined && column.img !='')
                                                        img= column.img;

                                                    // RENDER
                                                    if(rows[0][column.field] === undefined)
                                                        return;
                                                    else if(column.render != undefined)
                                                        value = column.render(row[column.field],row,this._handleActions);
                                                    else
                                                        value = row[column.field];//cell

                                                    return(
                                                        <td style={column.style!==undefined?column.style:{}} key={id}>
                                                            {img!='' &&
                                                                <div className="img-video">
                                                                    <img src={img} />
                                                                </div>
                                                            }
                                                            {value}
                                                        </td>
                                                    );
                                                })
                                            }
                                        </tr>
                                    );
                                })
                            }
                            <tr>
                                <td>
                            <div className={"img-loader loader-3 " + (this.state.loader ? "active":'' )}>
                                <img src="../img/loader_3.gif" />
                            </div>  
                            </td>
                            </tr>
                        </Fragment>
                    </tbody>
                </table>

            </Fragment>
        );
    }

}

const TableSearchField = (props) => {
    return(
        <div className={"search-field "+searchClassName}>
            <InputField value={props.value} autocomplete='on'  divClassName="d-inline" className="form-control d-inline-block" name="search_field"
            placeholder={props.placeholder!== undefined? props.placeholder:"Cerca"}
            label={props.label!== undefined? props.label:''}
            handleChange={props.onChange} />
            <div className={"img-loader " + (props.loader ? "active":'' )}>
                <img src="../img/loader.gif" />
            </div>
            {
                <span className="info-search">
                    {props.infoSearch}
                </span>
            }
            <div onClick={props.onClick} className={"btn-clear " + (props.value !='' ? "active":'' )}>
                <i className="fa fa-times" aria-hidden="true"></i>
            </div>
            {props.showList &&
                <div className="search-list text-left">
                    <ul className="list-group">
                        {props.data.map((val,id) => {
                                return(
                                    <li key={id} id={val[patternList.id]}
                                    onClick={props.onClick}
                                    className="list-group-item">
                                        {
                                            Object.keys(props.patternList.fields).map((field,key) => {

                                                if(props.patternList.fields[field].length==0)
                                                    return(
                                                        <Fragment key={key}>
                                                            {val[field]} &nbsp;
                                                        </Fragment>
                                                    )
                                                if(val[field] instanceof Object)
                                                    return(
                                                        props.patternList.fields[field].map((f,k) => {
                                                            return(
                                                                <Fragment key={key+k}>
                                                                    {val[field][f]} &nbsp;
                                                                </Fragment>
                                                            )
                                                        })
                                                    )
                                            })
                                        }
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
