import React, { Component , Fragment } from 'react';

import InputField from './form/InputField';

export default class SearchField extends Component {

    constructor(props){
        super(props);

        this.timeOut = 500;// timeout before remote call

        this.state = {
            value : '',
            data: [],
            loader:false,
        };

        this.getRemoteData = this.getRemoteData.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleClick = this._handleClick.bind(this);
        this._timeOut = this._timeOut.bind(this);
    }


    getRemoteData(val){

        let url = this.props.url + '/' + val;
        let headers = {headers: {
            'Accept': 'application/json',
            //'Content-Type': 'application/json'
            }
        };

        this.setState({loader:true});

        return axios.get(url, headers )
			.then(res => {
                let data = res.data;

                if(this.props.callback !== undefined)
                    this.props.callback(data);

                return data;
                //this.setState({ data:data, loader:false });
                //console.log(rows);
                //this.setState({data});

			}).catch((error) => {
				console.log(error.response.data);
				if(error.response.status==401)
					if(window.confirm('Devi effettuare il Login, Clicca ok per essere reindirizzato.'))
						window.location.href=this.props.url + '/login';
            });
    }


    _handleChange(e){
        //console.log(e.target.value);
        let value = e.target.value;

        this.setState({value:value});

        this._timeOut(value).then((data) => this.setState({ data: data==null? []: data, loader:false }) );
    }

    _handleClick(val){
        let patternList = this.props.patternList!== undefined ? this.props.patternList : {id:'',fields:[]};
        let txt ='';

        patternList.fields.map((field,key) => {
            txt += val[field];
            txt += patternList.fields.length > (key+1) ? ' ':'';
        })

        //console.log(txt)
        this.setState({value:txt});

        let reload = this.props.reloadOnClick!== undefined ? this.props.reloadOnClick : true;

        if(!reload)
            this.setState({ data:[]});
        else
            this._timeOut(txt,0).then((data) => { if(data!=null) this.setState({ data:[], loader:false })} );

        if(this.props.onClick!== undefined)
            this.props.onClick(val);
    }

    _timeOut(value,time){
        let setTime = time!== undefined ? time : this.timeOut;

        clearTimeout(this.timer);

        return new Promise((resolve, reject) => {

            if(value==''){
                if(this.props.callback!== undefined)
                    this.props.callback([], true);
                return resolve(null);
            }

            this.timer = setTimeout( () => {
                //console.log("tt");
                resolve(this.getRemoteData(value));
            },setTime);
        });
    }

    render(){
        let data = this.state.data.data!==undefined ? this.state.data.data : this.state.data;
        let patternList = this.props.patternList!== undefined ? this.props.patternList : {id:'',fields:[]};
        let showList = this.props.showList!== undefined ? this.props.showList : false;

        return(
            <div className="search-field ">
                <InputField value={this.state.value}  divClassName="d-inline" className="form-control" name="search_field"
                placeholder={this.props.placeholder!== undefined? this.props.placeholder:"Cerca"}
                label={this.props.label!== undefined? this.props.label:''}
                handleChange={this._handleChange} />
                <div className={"img-loader " + (this.state.loader ? "active":'' )}>
                    <img src="../img/loader.gif" />
                </div>
                {showList &&
                    <div className="search-list text-left">
                        <ul className="list-group">
                            {data.map((val,id) => {
                                    return(
                                        <li key={id} id={val[patternList.id]}
                                        onClick={() => this._handleClick(val)}
                                        className="list-group-item">
                                            {patternList.fields.map((field,id) => {
                                                return(
                                                    <Fragment key={id}>
                                                        {val[field]} &nbsp;
                                                    </Fragment>
                                                )
                                            })}
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
