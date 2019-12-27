import React, { Component , Fragment } from 'react';

import InputField from './form/InputField';

export default class SearchField extends Component {

    constructor(props){
        super(props);

        this.timeOut = 500;// timeout before remote call

        this.state = {
            data: [],
            loader:false,
        };

        this.getRemoteData = this.getRemoteData.bind(this);
        this._handleChange = this._handleChange.bind(this);
    }


    getRemoteData(val){

        let url = this.props.url + '/' + val;
        let headers = {headers: {
            'Accept': 'application/json',
            //'Content-Type': 'application/json'
            }
        };

        this.setState({loader:true});

        axios.get(url, headers )
			.then(res => {
                let data = res.data;
                this.props.callback(data);

                this.setState({ data:data, loader:false });
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

        clearTimeout(this.timer);

        if(value=='') {this.state.data=[]; return this.props.callback([], true);}

        this.timer = setTimeout( () => {
            this.getRemoteData(value);
        },this.timeOut);
        //setTimeout( ,300);
    }


    render(){
        let data = this.state.data.data!==undefined ? this.state.data.data : this.state.data;
        let patternList = this.props.patternList!== undefined ? this.props.patternList : {id:'',fields:[]};
        //console.log(data)
        //divClassName =this.props.className!== undefined ? this.props.className: '';
        let withList = this.props.withList!== undefined ? this.props.withList : false;
        return(
            <div className="search-field ">
                <InputField  divClassName="d-inline" className="form-control" name="search_field" placeholder="Cerca" handleChange={this._handleChange} />
                <div className={"img-loader " + (this.state.loader ? "active":'' )}>
                    <img src="../img/loader.gif" />
                </div>
                {withList &&
                    <div className="search-list text-left">
                        <ul className="list-group">
                            {data.map((val,id) => {
                                    return(
                                        <li key={id} id={val[patternList.id]}
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
