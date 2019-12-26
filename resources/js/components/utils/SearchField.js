import React, { Component , Fragment } from 'react';

import InputField from './form/InputField';

export default class SearchField extends Component {

    constructor(props){
        super(props);

        this.timeOut = 500;// timeout before remote call

        this.state = {
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
                let rows = res.data;
                this.props.callback(rows.data);

                this.setState({loader:false });
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

        if(value=='') return this.props.callback([], true);

        this.timer = setTimeout( () => {
            this.getRemoteData(value);
        },this.timeOut);
        //setTimeout( ,300);
    }


    render(){
        return(
            <div className="search-field">
                <InputField  divClassName="d-inline" name="search_field" label="Cerca" handleChange={this._handleChange} />
                <div className={"img-loader " + (this.state.loader ? "active":'' )}>
                    <img src="../img/loader.gif" />
                </div>
            </div>
        );
    }

}
