import React, { Component , Fragment } from 'react';
import ReactDOM from 'react-dom';


export default class Home extends Component {

    constructor(props){
        super(props);

        this.state = {
            data: [
                {
                    id:'',
                    titolo:'',
                    parametri:''
                }
            ],
            loader: false
        };
    }

    componentDidMount(){
        this.getRemoteData('incassi');
    }

    getRemoteData(){

        let url = this.props.url+'/settings';

        let headers = {headers: {'Accept': 'application/json'}};

        this.setState({loader:true})

        return axios.get(url, headers )
			.then(res => {
                //console.log(res.data[0]);
                
                let data = this.state.data;                
                data = res.data;
                
                this.setState({data:data});

                return res;
			}).catch((error) => {
                if(error.response===undefined) return;
                if(error.response.data!==undefined)
                    console.log(error.response.data);
                else
                    console.log(error.response);
                throw error;
			});
    }

    render() {

        let user = USER_CONFIG;
        let data = this.state.data;
        
        return (

            <div className="container-fluid py-1 ml-4">

                <div className="row" >
                    <div className="col-md-6 p-4 bg-white">
                        {data.map((d,k) => {
                            let parametri = d.parametri!=''?JSON.parse(d.parametri):[];
                            //parametri = JSON.parse(d.parametri);
                            //console.log(parametri)
                            return (
                                <Fragment key={k}>
                                <h4>{d.titolo}:</h4>
                                <ul > 
                                    {
                                        Object.keys(parametri).map((id,k) => {
                                            return(
                                                <li key={k}><strong>{id} giorni:</strong> {(parametri[id]*100)} %</li>
                                            )
                                        })
                                    }
                                </ul>
                                </Fragment>
                            )
                        }) 
                        }
                    </div>                    
                </div>

                
            </div>

        );
    }
}
