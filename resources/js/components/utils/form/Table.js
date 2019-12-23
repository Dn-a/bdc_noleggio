import React, { Component } from 'react';
import Moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';

import paginationFactory from 'react-bootstrap-table2-paginator';
import overlayFactory from 'react-bootstrap-table2-overlay';

import axios from 'axios';

export default class Table extends Component 
{
	
	constructor(props)
	{
		super(props);

		this.props.columns.push({
                dataField: 'contacted',
                isDummyField: true,
                text: 'Contattato',
                sort:true,
                events: {
                    onClick: (e) => e.stopPropagation()
                },
                formatter: (cellContent, row,key) => {
                    //console.log(row);
                    let stClass1 ='btn px-2 py-1 m-2';
                    let stClass2 ='btn px-3 py-1 m-2';
                    
                    if(row.contacted==1){
                        return (
                        <div className="btn-group">

                            <button  onClick= {
                                (e) => this.handleUpdate(key,row.id,0)
                            }  className={'btn btn-danger '+stClass1} >
                                no
                            </button>

                            <button  disabled className={'btn btn-success dont-sel '+stClass2} >si</button>
                        </div>
                        );
                    }

                    return (
                        <div className="btn-group">
                            <button disabled className={'btn btn-danger dont-sel '+ stClass1} >no</button>
                           
                            <button  onClick= {
                                (e) => this.handleUpdate(key,row.id,1)
                            }  className={'btn btn-success '+stClass2} >
                                si
                            </button>
                        </div>
                    );
                }
            });

		this.state = 
        {
            rows: [],
            columns: this.props.columns,
            page : 1,
        	total : 10,
        	perPage : 10,
            loading: false,
            selected: []
            
        };

        const host = window.location.hostname;
        this.home = host=='www.g-soluzioniassicurative.it'? '/plus':''; 
        this.url = this.home + this.props.dir;

        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);     
            
	}


	componentDidMount() 
    {
    	let url = this.url;
    	
		axios.get(url)
			.then(res => {
				let rows = res.data;
				this.setState({ 
					rows : rows.data,
					page : rows.current_page,
	            	total : rows.total,
	            	perPage : rows.per_page,
	            	boh:''
				});
			}).catch((error) => {				
				console.log(error.response.data);
				if(error.response.status==401)
					if(window.confirm('Devi effettuare il Login, Clicca ok per essere reindirizzato.'))
						window.location.href=this.home + '/login';				
			});
    }
	

	handleTableChange(type,{ page, sizePerPage,sortField, sortOrder,data })
	{
		let q_page = '?page='+page;
		let q_perPage = '?per-page='+sizePerPage;
		let url = this.url+'?page='+page+'&per-page='+sizePerPage;

		// PAGINATION
		if(type=='pagination'){
			//setTimeout(() => {			
	        axios.get(url)
			.then(res => {
				const rows = res.data;
				this.setState({ 
					rows : rows.data,
					page : rows.current_page,
	            	total : rows.total,
	            	perPage : rows.per_page,
	            	loading: false
				});
			}).catch((error) => {
				console.log(error.response.data);
				if(error.response.status==401)
					if(window.confirm('Devi effettuare il Login, Clicca ok per essere reindirizzato.'))
						window.location.href=this.home + '/login';
			});
	        //}, 3000);
	        this.setState(() => ({ loading: true }));
	    }
	    // SORTING
		else if(type=='sort'){		
			let result;
			if (sortOrder === 'asc') {
				result = data.sort((a, b) => {
				  if (a[sortField] > b[sortField]) {
				    return 1;
				  } else if (b[sortField] > a[sortField]) {
				    return -1;
				  }
				  return 0;
				});
			} else {
				result = data.sort((a, b) => {
				  if (a[sortField] > b[sortField]) {
				    return -1;
				  } else if (b[sortField] > a[sortField]) {
				    return 1;
				  }
				  return 0;
				});
			}
			this.setState(() => ({
				rows: result
			}));
		}
		
		//console.log(type);
	}


	handleOnSelect(row, isSelect,rowIndex,e) 
	{
		let target = e.target;
		let cell = target.cellIndex;

		if(cell==0) return false;
		if (isSelect) {
			this.setState(() => ({
			selected: [...this.state.selected, row.id]
			}));
		} else {
			this.setState(() => ({
			selected: this.state.selected.filter(x => x !== row.id)
			}));
		}
	}


	handleUpdate(key,id,content)
	{
		let url = this.url+'/'+id;		
		
		let formData = {
			_token: CSRF_TOKEN,
        	contacted: content            	
    	}     

		const headers = {headers: {'Accept': 'application/json','Content-Type': 'application/json'},};    	
		axios.put(url,formData,headers)
		.then(res => {
			//console.log(res);
			if(res.status==201){
				let state = Object.assign({}, this.state.rows); 
	    		state[key].contacted = content;
				this.setState({ boh:'boh' });
			}
		}).catch((error) => {				
			console.log(error.response.data);
			if(error.response.status==401)
				if(window.confirm('Devi effettuare il Login, Clicca ok per essere reindirizzato.'))
					window.location.href=this.home + '/login';				
		});
	}


    render() 
    {
    	Moment.locale('it');
		let showExpand = this.props.showExpandColumn!=undefined ? this.props.showExpandColumn: true;
    	const expandRow = {
			renderer: row => (
			<div >
			{showExpand==true &&
			  <p>
			  	{row.veicle_type && (<span><strong>Veicolo:</strong> {row.veicle_type}</span>)}
			  	{row.birthday && (<span><strong>Data di nascita:</strong> {Moment(row.birthday).format('DD/MM/Y')}</span>)}
			  	{row.sex!=null && (<span><strong>Sesso:</strong> { row.sex==0? 'M': 'F' }</span>)}

			  	{row.type && (<span><strong>Tipo:</strong> {row.type}</span>)}
			  	{row.house && (<span><strong>Abitazione:</strong> {row.house}</span>)}
			  	{row.floor && (<span><strong>Piano:</strong> {row.floor}</span>)}
			  	{row.seniority && (<span><strong>Anzianità:</strong> {row.seniority}</span>)}

			  	{row.name && (<span><strong>Nome:</strong> {row.name}</span>)}
			  	{row.surname && (<span><strong>Cognome:</strong> {row.surname}</span>)}
			  	{row.year_build && (<span><strong>Anno Costruzione:</strong> {Moment(row.year_build).format('DD/MM/Y')}</span>)}
			  	
			  	{row.warranty && (<span><strong>Garanzie:</strong> { row.warranty }</span>)}			  	
			  	{row.maximal && (<span><strong>Massimale Furto:</strong> {row.maximal}</span>)}			  	
			  	{row.note && (<span><strong>Note:</strong> { row.note }</span>)}
			  </p>
			}
			  
			</div>
			),
			showExpandColumn: showExpand

		};

		const selectRow = {
			mode: 'checkbox',			
			bgColor: '#7c93aa',
			selected: this.state.selected,
			clickToSelect: false,			
      		onSelect: this.handleOnSelect
			
		};

        return (

			<div className="row">
				<div className="table-auth col-md-12">
					<div className="table-head">
						<h3  className="mb-5">{this.props.title}</h3>
						{this.props.subtitle}
					</div>
					<RemotePagination
						data={ this.state.rows }
						columns = {this.state.columns}
						expandRow = { expandRow }
						striped = {this.props.striped}
						selectRow={ selectRow }
						page={ this.state.page }
						sizePerPage={ this.state.perPage }
						totalSize={ this.state.total }
						onTableChange={ this.handleTableChange }						        
						loading={ this.state.loading }
					/>
				</div>
            </div>
        );
    }
}

const RemotePagination = ({ data,columns, expandRow , loading, page, sizePerPage, 
							onTableChange, totalSize, selectRow,striped }) => (
    <BootstrapTable
      headerClasses= 'thead-dark'
      striped = {striped}
      condensed
      remote
      bootstrap4
      keyField="id"
      data={ data }
      columns={ columns }
      expandRow={ expandRow }
      selectRow={  selectRow }
      pagination={ paginationFactory({ page, sizePerPage, totalSize }) }
      onTableChange={ onTableChange }
      loading={ loading }
      overlay={ overlayFactory({ spinner: true, background: 'rgba(192,192,192,0.3)' }) }
    />  
);


function dataFormatter(cell, row, rowIndex)
{
	let yesterday = Moment().add(-1, 'days').format('DD/MM/Y');
	let today = Moment().format('DD/MM/Y');

	let date = Moment(cell).format('DD/MM/Y');
	let hour = Moment(cell).format('HH:mm');

	let final = date;	

	let style = {
		color:'rgb(0, 123, 255)',
		fontWeight:'600'
	}

	if(date == yesterday)
		final='ieri';	
	else if(date == today)
		final = 'oggi';
	else
		style = {};

	final += ' - '+hour;

	return(
		<span style={style} > { final } </span>
	);
}

function dataFormatter2(cell, row, rowIndex)
{
	let yesterday = Moment().add(-1, 'days').format('DD/MM/Y');
	let today = Moment().format('DD/MM/Y');

	let date = Moment(cell).format('DD/MM/Y');
	let hour = Moment(cell).format('HH:mm');

	let final = date;	

	let style = {
		color:'rgb(0, 123, 255)',
		fontWeight:'600'
	}

	if(date == yesterday)
		final='ieri';	
	else if(date == today)
		final = 'oggi';
	else
		style = {};

	return(
		<span style={style} > { final } </span>
	);
}

export {dataFormatter,dataFormatter2};