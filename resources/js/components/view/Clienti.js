import React, { Component , Fragment } from 'react';
import ReactDOM from 'react-dom';
import Table from '../utils/SortedTable';


export default class Video extends Component {
    render() {
        return (
            <div className="container-fluid pl-3">
                <div className="col-md-12">
                    <Table />
                </div>
            </div>
        );
    }
}
