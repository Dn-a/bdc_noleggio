import React, { Component , Fragment } from 'react';

import SearchField from '../utils/SearchField';
import { Button } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import ScaricoVideoModal from '../modals/ScaricoVideoModal';


const COLUMNS = [
    { title: 'id', field: 'id' , align:'right'},
  ];


export default class Incassi extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            show:false,
            reloadInfiniteTable:0
        };

        this.url = this.props.url+'/incassi';
        this._handleCloseModal = this._handleCloseModal.bind(this);
        this._handleShowModal = this._handleShowModal.bind(this);
        this._handleSearchFieldCallback = this._handleSearchFieldCallback.bind(this);
        this._handleCheckDataModal = this._handleCheckDataModal.bind(this);
        this._handleSearchFieldClick = this._handleSearchFieldClick.bind(this);
        this._handleCaricoVideo = this._handleCaricoVideo.bind(this);
    }


    _handleCloseModal () {
        this.setState({show : false});
    }
    _handleShowModal (){
        this.setState({show : true});
    }

    _handleCaricoVideo(e){
        console.log(e)
    }

    _handleCheckDataModal(e){
        console.log(e.target.value);
    }

    _handleSearchFieldCallback(data,reset){

        //console.log(rows);

        let rows = this.state.rows;

        rows = data.data;
        this.setState({rows});

        if(reset){
            rows = '';
            this.setState({rows});
        }

    }

    _handleSearchFieldClick(data){
        console.log(data)
    }


    render() {

        return (
            <div className="container-fluid pl-3">

            </div>
        );
    }
}
