import React, { Component , Fragment } from 'react';

import AddEditModal from '../utils/AddEditModal';
import SearchField from '../utils/SearchField';
import InputField from '../utils/form/InputField';
import DropDownSelect from '../utils/form/DropdownSelect';
import INFO_ERROR from '../utils/form/InfoError';

const whitespace_reg_ex = /^[^\s].*/;

const FIELDS = [
    'id_video',
    'id_fornitore',
    'quantita',
];

const HIDE_FIELD = [

]

export default class DipendentiModal extends Component {

    constructor(props){
        super(props);

        let data = {};
        let error = {};

        FIELDS.map((fd,id) => {
            data[fd] = error[fd]= '';
        });

        this.state = {
            data: data,
            error: error,
            checked: false,
            loader:false
        };

        this._handleChange = this._handleChange.bind(this);
        this._handleOnSave = this._handleOnSave.bind(this);
    }

    componentWillUnmount () {
        this.state.data= this.state.error = {};
    }

    setRemoteStore() {

        let url = this.props.url+'/magazzino';

        let headers = {headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'
            //'Content-Type': 'multipart/form-data'
            //'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        let data = this.state.data;

        let formData = new FormData();

        Object.keys(data).map((k,id) => {
            if(!HIDE_FIELD.includes(k)){
                formData.append(k,data[k]);
            }
        });

        //console.log(FormData);return;

        formData.append('_token',CSRF_TOKEN);

        this.setState({loader:true});

        return axios.post(url,formData,headers)
        .then(result => {
            //console.log(result);
            if(this.props.callback !== undefined)
                this.props.callback(data);
            this.props.onHide();
            this.state.loader = false;
            return result;
        }).catch((error) => {
          console.error(error.response.data);
          this.setState({errorRemoteStore:error.response.status});
          if(error.response.status==401)
            if(window.confirm('Devi effettuare il Login, Clicca ok per essere reindirizzato.'))
              window.location.href=this.home + '/login';
          throw error;
        });
    }

    _handleOnSave(){
        console.log("save");
        this.setRemoteStore();
    }

    _handleChange(e){
        let value = e.target.value.toLowerCase();
        let field = e.target.name;


        let error = this.state.error;
        let data = this.state.data;

        if(value=='')
            error[field] = INFO_ERROR['vuoto'];
        else
            error[field] = '';

        switch(field){
            case 'quantita':
                if( !/^\d+$/.test(value) )
                    error.quantita = INFO_ERROR['numero'];
                else if(value <= 0)
                    error.quantita = INFO_ERROR['numero_2'];
                break;
        }

        data[field] = value;

        this.setState({data,error},()  => this.checked());
    }

    checked(){
        let data = this.state.data;
        let error = this.state.error;

        let checked = true;
        Object.keys(error).map((k,id) => {
            if(error[k]!='' || data[k]=='')
                checked = false;
        });


        this.setState({checked});
    }

    showError(field){
        let error = this.state.error[field]!== undefined ? this.state.error[field] : '';

        if(error != '')
          return(
            <div className="error-div">{error}</div>
          );
    }

    render(){

        let divClassName = 'mb-3';

        let urlVideo = this.props.url+'/video/search';
        let urlFornitore = this.props.url+'/fornitori/search';

        return(
            <AddEditModal size="md"
                show={this.props.show}
                onHide={this.props.onHide}
                loader={this.state.loader}
                onConfirm={this._handleOnSave}
                disabledConfirmButton={!this.state.checked}
                title="Nuovi Video" type="Scarico"
            >

                <form>

                <div className="form-group">
                        <SearchField
                            label="Film"
                            placeholder='Cerca un Film'
                            searchClassName='w-100'
                            showList={true}
                            url={urlVideo}
                            patternList={{id:'id', fields:{titolo:[],categoria:[],durata:[]} } }//id di ritorno; i fields vengono usati come titolo
                            reloadOnClick={false}
                            onClick={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_video = val.id;
                                    error.id_video = '';
                                    this.setState({data,error},() => this.checked());
                                }
                            }
                            callback={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_video = '';
                                    if(val.length==0){
                                        error.id_video = INFO_ERROR['film'];
                                    }
                                    this.setState({data,error},() => this.checked());
                                }
                            }
                        />
                        {this.showError('id_video')}
                    </div>

                    <div className="form-group">
                        <SearchField
                            label="Fornitore"
                            placeholder='Cerca un Fornitore'
                            searchClassName='w-100'
                            showList={true}
                            url={urlFornitore}
                            patternList={{id:'id', fields:{titolo:[],indirizzo:[],comune:[]} } }//id di ritorno; i fields vengono usati come titolo
                            reloadOnClick={false}
                            onClick={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_fornitore = val.id;
                                    error.id_fornitore = '';
                                    this.setState({data,error},() => this.checked());
                                }
                            }
                            callback={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_fornitore = '';
                                    if(val.length==0){
                                        error.id_fornitore = INFO_ERROR['fornitore'];
                                    }
                                    this.setState({data,error},() => this.checked());
                                }
                            }
                        />
                        {this.showError('id_fornitore')}
                    </div>

                    <div className="form-group">
                        <InputField name="quantita" divClassName={divClassName} className="form-control" label="Quantità" placeholder="Numero maggiore di zero"
                        helperText={this.showError('quantita')} handleChange={this._handleChange} />
                    </div>

                </form>
            </AddEditModal>
        );
    }
}
