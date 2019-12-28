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
                selected: []
            },
            selectedList:[],
            moreData:true,
            loader:false,
        };

        this.timeOut = 500;// timeout before remote call

        this._handleScroll = this._handleScroll.bind(this);
        this._moreData = this._moreData.bind(this);
        this._handleMultiSelection = this._handleMultiSelection.bind(this);
    }

    componentDidMount () {
        let content = document.getElementById('content');
        content.addEventListener('scroll', this._handleScroll);
        this.getRemoteData().then((a) => this._moreData());
    }

    componentWillUnmount () {
        document.getElementById('content').removeEventListener('scroll', this._handleScroll);
    }

    getRemoteData(page){

        let qString = page!=null ? '?page='+page : '';

        let url = this.props.url+qString;
        let headers = {headers: {
            'Accept': 'application/json',
            //'Content-Type': 'application/json'
            }
        };

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
    _handleMultiSelection(id){
        let selectedList = this.state.selectedList;

        if(this.props.multiSelect===undefined || !this.props.multiSelect) return;

        let index = selectedList.indexOf(id);
        if(index>=0)
            selectedList.splice(index,1);
        else
            selectedList.push(id);

        this.setState({selectedList});

        //console.log(id)
    }

    // quando la barra di scorrimento verticale supera una certa percentuale,
    // vengono recuperati i dati dal server remoto, incrementando la pagina di uno step.
    _handleScroll (e) {
        let sh = e.srcElement.scrollHeight;
        let oh = e.srcElement.offsetHeight;
        let scroll = e.srcElement.scrollTop;
        let percent = scroll/(sh-oh);

        //console.log(percent)

        if(percent > 0.65 && this.state.moreData){
            let page = this.state.data.page;
            this.state.moreData = false;
            console.log("Scroll loading");
            this.getRemoteData(++page);
        }
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

    render(){

        let data = this.state.data;
        let columns = data.columns!= null ?  data.columns : [];
        let rows = this.props.externalRows!=null &&  this.props.externalRows instanceof Array ? this.props.externalRows : data.rows;

        return(

            <table className="table">
                <thead>
                    <tr>
                        {

                        columns.map((column,id) => {
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
                                <tr className={sl.indexOf(idField)>-1 ? 'active':''} key={id} onClick={() => this._handleMultiSelection(idField)}>
                                    {
                                        columns.map((column,id) => {
                                            //console.log(row[column.field]);
                                            let cell = row[column.field];
                                            if(column.render != undefined)
                                                return(<td key={id}>{column.render(cell)}</td>);
                                            return(
                                                <td key={id}>{cell}</td>
                                            );
                                        })
                                    }
                                </tr>
                            );
                        })
                    }

                </tbody>
            </table>
        );
    }

}
