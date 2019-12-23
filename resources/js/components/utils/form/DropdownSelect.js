import React, { Fragment } from "react";

const DropdownSelect = ({name , label,placeholder,className='', firstValue, required, values,selected, _handleChange}) => (
    <Fragment>
    { label != null ? <label className="pr-1 mb-1 col-form-label text-md-right" htmlFor={name}>{label}</label>:''}
    <select name ={name} className={'form-control ' + className} defaultValue={selected}  required = {required} onChange = { _handleChange} >
        <option value ={firstValue}>{firstValue? firstValue:placeholder}</option>
        {values.map(
            value => <option value = {value} key = {value}>{value}</option>
        )}
    </select>
    </Fragment>
);

export default DropdownSelect;