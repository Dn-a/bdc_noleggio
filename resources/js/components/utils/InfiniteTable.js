import React, { Component , Fragment } from 'react';

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
            reload:0
        };

        this.timeOut = 500;// timeout before remote call

        this._handleScroll = this._handleScroll.bind(this);
        this._moreData = this._moreData.bind(this);
        this._handleMultiSelection = this._handleMultiSelection.bind(this);
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
        if(this.props.selectedList !== undefined && this.props.selectedList instanceof Array){
            this.state.selectedList = this.props.selectedList;
        }
        if(this.props.reload!==undefined && this.props.reload > this.state.reload){
            this.state.reload = this.props.reload;
            this.state.data.rows = [];
            console.log("reload");
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

                this.setState({data,moreData});

			}).catch((error) => {
				console.log(error.response.data);
				if(error.response.status==401)
					if(window.confirm('Devi effettuare il Login, Clicca ok per essere reindirizzato.'))
						window.location.href=this.props.url + '/login';
			});
    }

    // Multiselezione righe
    _handleMultiSelection(id,row){
        let selectedList = this.state.selectedList;

        if(this.props.multiSelect===undefined || !this.props.multiSelect) return;

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

        this.setState({selectedList},() => {
            if(this.props.multiSelectCallback !==undefined)
                this.props.multiSelectCallback(selectedList,selectedListRows);
        });

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
        if(this.props.id === undefined)
            return false;

        let node = document.getElementById(this.props.id).parentNode;
        let parent = document.getElementsByClassName('show active')[0];

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

    moreInfoTable(){
        let multiSelect = this.props.multiSelect!==undefined ? this.props.multiSelect : false;
        let elSize = this.state.selectedList.length;

        if(multiSelect)
            return(
                <div className="more-info-table text-left py-2">
                    { elSize > -1 &&
                            <Fragment>
                                <div title="seleziona tutto" className="d-inline-block mr-3"
                                onClick={() =>
                                    {
                                        let rows = this.props.externalRows!=null &&  this.props.externalRows instanceof Array ? this.props.externalRows : this.state.data.rows;
                                        let selectedList = [];

                                        rows.map((row,key) => {
                                            selectedList.push(row.id);
                                        });

                                        this.setState({selectedList});

                                        if(this.props.multiSelectCallback !==undefined)
                                            this.props.multiSelectCallback(selectedList,rows);
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


    render(){

        let data = this.state.data;
        let columns = data.columns!= null ?  data.columns : [];
        let rows = this.props.externalRows!=null &&  this.props.externalRows instanceof Array ? this.props.externalRows : data.rows;
        let idTable = this.props.id !== undefined? this.props.id:'';

        return(
            <Fragment>

                { this.moreInfoTable() }

                <table className="table" id={idTable}>
                    <thead>
                        <tr>
                            {

                            columns.map((column,id) => {
                                if(rows[0]!== undefined && rows[0][column.field]=== undefined)
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
                        {
                            rows.map((row,id) => {
                                let idField = row.id;
                                let sl = this.state.selectedList;
                                return(
                                    <tr className={sl.indexOf(idField)>-1 ? 'active':''} key={id} onClick={() => this._handleMultiSelection(idField,row)}>
                                        {
                                            columns.map((column,id) => {
                                                //console.log(row['img']);
                                                let cell = row[column.field];

                                                let img = column.img !== undefined
                                                &&  row['img']!== undefined ? row['img']:'';

                                                let value = '';
                                                if(rows[0][column.field]=== undefined)
                                                    return;
                                                else if(column.render != undefined)
                                                    value = column.render(cell,row);
                                                else
                                                    value = cell;



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

                    </tbody>
                </table>

            </Fragment>
        );
    }

}
