import React, { Component , Fragment } from 'react';
import ReactApexChart from "react-apexcharts";

import DropDownSelect from '../utils/form/DropdownSelect';

const COLUMNS = [
    { title: 'id', field: 'id' , align:'right'},
  ];


export default class Incassi extends Component {

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

        this.url = this.props.url+'/incassi';
    }

    componentDidMount(){
        this.getRemoteData('ptVendita');
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

    calcColor(val){
        let c = "rgb(137, 209, 207,"+val+")";

        return c;
    }

    render() {

        let user = USER_CONFIG;
        let ruolo = user.ruolo;

        let idPtVendita = -1;

        if( this.state.idPtVenditaSelected != -1 )
            idPtVendita = this.state.idPtVenditaSelected;
        else if( user.id_pt_vendita !== undefined )
            idPtVendita = user.id_pt_vendita;

        const dipendenti = this.state.incassi.dipendenti.sort((b,a) => a.incasso_oggi - b.incasso_oggi);
        const ptVendita = this.state.incassi.pt_vendita;
        //console.log(ptVendita)

        let series= [
            {
                name: "Ieri",
                data: dipendenti.map((d,k) => d.incasso_ieri)
            },
            {
                name: "Oggi",
                data: dipendenti.map((d,k) => d.incasso_oggi)
            }
        ];

        let options = {

            stroke: {
                width: 1,
                colors: ["#fff"]
            },
            legend: {
                itemMargin: {
                    vertical: 20
                },
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val + " €";
                },
            },
            colors: ['#ccc','#4ed087'],
            xaxis: {
                //type: 'category',
                categories: dipendenti.map((d,k) => d.nome.toUpperCase()),
            }
        };

        return (
            <div className="container-fluid pl-3 incassi">
                <div className="mx-4 mb-3" style={{color:'#666'}}>I dati sul server vengono aggiornati ogni 5 minuti.</div>
                {ruolo!='Addetto' &&
                <Fragment>

                    {ruolo=='Admin' &&
                        <div className="row mb-3 mx-2 pt-vendita">
                            <div className="col-md-4">
                                <DropDownSelect placeholder="Scegli un Punto Vendita"
                                name="lst_pt_vendita" className="form-control"
                                //label="Punto Vendita"
                                values={this.state.lstPtVendita}
                                selected={idPtVendita}
                                handleChange={(e) =>{
                                    this.state.idPtVenditaSelected = e.target.value;
                                    this.getRemoteData('incassi',e.target.value);
                                    /*this.setState({
                                        idPtVenditaSelected : e.target.value,
                                        //reloadInfiniteTable : ++this.state.reloadInfiniteTable
                                    })*/
                                }
                                }
                                />
                            </div>
                            <img className={"loader-2"+(this.state.loader==true?' d-inline-block':'')} src="../img/loader_2.gif"></img>
                        </div>
                    }

                    {ptVendita.map((pv,k) => {
                        return(
                            <div className="row mb-5 mx-2" key={k}>

                                <div className="col-md-4" >
                                    <div className="card px-3 py-2 mb-3" style={{background:'#89d1cf'}}>
                                        <h4>OGGI</h4>
                                        <div className="row mt-2 " >
                                            <div className="col-md-2 mx-3 pt-2 ">
                                                <i className="fa fa-video-camera" aria-hidden="true"></i>
                                            </div>
                                            <div className="col-md-8 ">
                                                <div className="info"><strong>{pv.n_noleggi_oggi}</strong></div>
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
                                                <div className="info"><strong>{parseFloat(pv.incasso_oggi?pv.incasso_oggi:0).toFixed(2) +' €'}</strong></div>
                                                <div>INCASSO TOTALE</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="card px-3 py-2 mb-3" style={{background:'#d38b87'}}>
                                        <h4>ULTIMI 7 GIORNI</h4>
                                        <div className="row mt-2 " >
                                            <div className="col-md-2 mx-3 pt-2 ">
                                                <i className="fa fa-video-camera" aria-hidden="true"></i>
                                            </div>
                                            <div className="col-md-8 ">
                                                <div className="info"><strong>{pv.n_noleggi_week}</strong></div>
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
                                                <div className="info"><strong>{parseFloat(pv.incasso_week?pv.incasso_week:0).toFixed(2) +' €'}</strong></div>
                                                <div>INCASSO TOTALE</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="card px-3 py-2 mb-3" style={{background:'#bfbfbf'}}>
                                        <h4>ULTIMI 30 GIORNI</h4>
                                        <div className="row mt-2 " >
                                            <div className="col-md-2 mx-3 pt-2 ">
                                                <i className="fa fa-video-camera" aria-hidden="true"></i>
                                            </div>
                                            <div className="col-md-8 ">
                                                <div className="info"><strong>{pv.n_noleggi_month}</strong></div>
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
                                                <div className="info"><strong>{parseFloat(pv.incasso_month?pv.incasso_month:0).toFixed(2) +' €'}</strong></div>
                                                <div>INCASSO TOTALE</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )
                    })
                    }

                    <div className="row mx-2 py-4 px-2" style={{background:'#fff'}}>
                        <div className="col-md-12">
                            <h4 className="mb-4">Incasso giornaliero dei singoli Dipendenti</h4>
                            <ReactApexChart   options={options} series={series} type="bar" height={350} />
                        </div>
                    </div>

                </Fragment>
                }

            </div>
        );
    }
}
