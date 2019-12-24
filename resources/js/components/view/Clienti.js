import React, { Component , Fragment } from 'react';
import axios from 'axios';

import { makeStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import blue from '@material-ui/core/colors/blue';

import STable from '../utils/STable';
import ETable from '../utils/ETable';
import AddEditModal from '../utils/AddEditModal';


const COLUMNS = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Nome', field: 'nome' },
    { title: 'Cognome', field: 'cognome' },
    { title: 'C.F.', field: 'cf' },
    { title: 'Data di Nascita', field:'data_nascita',
        render: cell  =>  new Date(cell).toLocaleDateString("it-IT")
    },
    { title: 'Recapiti', field: 'recapiti', padding:'none' },
    { title: 'Residenza', field: 'residenza' },
    { title: 'Email', field: 'email', },
    { title: 'Fidelizzazione', field:'fidelizzazione', render: cell => cell.titolo },
    { title: 'Privacy', field: 'privacy', },
  ];


export default class Clienti extends Component {

    constructor(props){
        super(props);

        this.state = {
            data: {
                rows: [],
                columns: COLUMNS,
                page : 1,
                total : 10,
                perPage : 10,
                loading: false,
                selected: []
            },
            show:false,
        };

        this._handleCloseModal = this._handleCloseModal.bind(this);
        this._handleShowModal = this._handleShowModal.bind(this);
    }

    componentDidMount(){
        this.getRemoteData();
    }

    getRemoteData(){

        let url = this.props.url+'/clienti';
        let headers = {headers: {
            'Accept': 'application/json',
            //'Content-Type': 'application/json'
            }
        };

        axios.get(url, headers )
			.then(res => {
                let rows = res.data;
                let data = this.state.data;

                data.rows = rows.data;
                data.page = rows.current_page;
                data.total = rows.total;
                data.perPage = rows.per_page;

                this.setState({data});

			}).catch((error) => {
				console.log(error.response.data);
				if(error.response.status==401)
					if(window.confirm('Devi effettuare il Login, Clicca ok per essere reindirizzato.'))
						window.location.href=this.home + '/login';
			});
    }

    _handleCloseModal () {
        this.setState({show : false});
    }
    _handleShowModal (){
        this.setState({show : true});
    }

    render() {
        return (
            <div className="container-fluid pl-3">
                <div className="row text-right mb-3 px-2">
                    <div className="col-md-12 ">
                    <MuiThemeProvider theme={blueTheme}>
                        <Fab color="primary" aria-label="add" onClick={this._handleShowModal}>
                            <AddIcon />
                        </Fab>
                    </MuiThemeProvider>
                    <AddEditModal body="suca" type="Nuovo" title="Cliente" show={this.state.show} onHide={this._handleCloseModal} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <STable titolo="Clienti" data={this.state.data} />
                    </div>
                </div>
            </div>
        );
    }
}

const color = blue[500];
const blueTheme = createMuiTheme({ palette: { primary: blue } });
