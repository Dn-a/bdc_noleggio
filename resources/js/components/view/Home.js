import React, { Component , Fragment } from 'react';
import ReactDOM from 'react-dom';
import InfiniteTable from '../utils/InfiniteTable';

const COLUMNS_VIDEO = [
    { title: 'Titolo', field: 'titolo', img:'',
        render: (cell,row) => {
            return(
                <div style={{display: 'inline-block'}}>
                    <span style={{textTransform:'capitalize',fontWeight:'600'}}>{row['titolo']}</span>
                    <div>
                        <span>{row['durata']}</span> -&nbsp;
                        <span>{row['categoria']}</span> -&nbsp;
                        <span>{row['regista']} </span>
                        <div><strong>data uscita:</strong> {new Date(row['data_uscita']).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"})}</div>
                        <span></span>
                    </div>
                </div>
            );
        }
    },
    { title: 'Prenotazioni', field: 'numero_prenotazioni'},
];

export default class Home extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            loader: false,
            incassi:{
                dipendenti:[],
                pt_vendita:[]
            },
            lstPtVendita:{},
            idPtVenditaSelected:-1,
            reloadInfiniteTable:0
        };
    }

    componentDidMount(){
        this.getRemoteData('incassi');
    }

    getRemoteData(type,id){

        let urlType = {
            ptVendita: 'punti-vendita',
            incassi: 'incassi'+(id!=null?'?id_pt_vendita='+id:'')
        }

        let url = this.props.url+'/'+urlType[type];

        let headers = {headers: {'Accept': 'application/json'}};

        this.setState({loader:true})

        return axios.get(url, headers )
			.then(res => {

                //console.log(res.data);
                if(res.data.length==0) return;

                if(type=='ptVendita'){
                    let lstPtVendita = this.state.lstPtVendita;
                    res.data.map((i,k) => {
                        lstPtVendita[i.id] = i.titolo;
                    });
                    this.setState({lstPtVendita, loader:false});
                }
                else if(type=='incassi'){
                    //console.log(res.data);
                    let incassi = this.state.incassi;
                    incassi = res.data;
                    this.setState({incassi,loader:false});
                }


			}).catch((error) => {
                if(error.response.data!==undefined)
                    console.log(error.response.data);
                else
                    console.log(error.response);
                throw error;
			});
    }

    render() {

        let user = USER_CONFIG;
        let nome = user.nome;
        let ruolo = user.ruolo;

        let urlVideo = this.props.url+'/video';

        var ptVendita = this.state.incassi.pt_vendita[0];
        ptVendita = ptVendita !== undefined ? ptVendita : {n_noleggi_oggi:0,incasso_oggi:0};

        return (

            <div className="container-fluid py-1">

                <div className="row mb-3 mx-4" >
                    <h5>Bentornato {nome.charAt(0).toUpperCase()+nome.slice(1)}!</h5>
                </div>

                <div className="row mb-5 mx-2 " >

                    <div className="col-md-8 table-responsive card p-3">
                        <h5 className="mb-3"><strong>FILM in uscita</strong></h5>
                        <InfiniteTable key="video"
                            id="tb-video"
                            url={urlVideo}
                            query='only=in_uscita'
                            columns={COLUMNS_VIDEO}
                        />
                    </div>

                    {ruolo!='Addetto' &&
                        <div className="col-md-4 incassi" >
                            <div className="card px-3 py-2 mb-3" style={{background:'#89d1cf'}}>
                                <h4>INCASSI DI OGGI</h4>
                                <div className="row mt-2 " >
                                    <div className="col-md-2 mx-3 pt-2 ">
                                        <i className="fa fa-video-camera" aria-hidden="true"></i>
                                    </div>
                                    <div className="col-md-8 ">
                                        <div className="info"><strong>{ptVendita.n_noleggi_oggi}</strong></div>
                                        <div>NUMERO NOLEGGI</div>
                                    </div>
                                </div>
                                <div className="row my-3">
                                    <hr className="col-md-8"/>
                                </div>
                                <div className="row mb-2">
                                <   div className="col-md-2 mx-3 pt-2 ">
                                        <i className="fa fa-bar-chart" aria-hidden="true"></i>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="info"><strong>{parseFloat(ptVendita.incasso_oggi?ptVendita.incasso_oggi:0).toFixed(2) +' €'}</strong></div>
                                        <div>INCASSO TOTALE</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                </div>

            </div>

        );
    }
}
