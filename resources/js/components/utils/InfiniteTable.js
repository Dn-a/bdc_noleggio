import React, { Component , Fragment } from 'react';

export default class InfiniteTable extends Component {

    constructor(props){
        super(props);

        this.state = {
            loader:false,
        };

        this.timeOut = 500;// timeout before remote call
    }


    render(){
        let data = this.props.data!=null ? this.props.data : {};
        let columns = data.columns!= null ?  data.columns : [];
        let rows =data.rows!= null ?  data.rows : [];

        return(

            <table className="table">
                <thead>
                    <tr>
                        {

                        columns.map((column,id) => {
                            return(
                                <th key={id} className="text-center" >{column.title}</th>
                            );
                        })

                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        rows.map((row,id) => {
                            return(
                                <tr key={id}>
                                    {
                                        columns.map((column,id) => {
                                            //console.log(row[column.field]);
                                            let cell = row[column.field];
                                            if(column.render != undefined)
                                                return(<td key={id}>{column.render(cell)}</td>);
                                            return(
                                                <td key={id}>{cell}</td>
                                            );
                                        })
                                    }
                                </tr>
                            );
                        })
                    }

                </tbody>
            </table>
        );
    }

}
