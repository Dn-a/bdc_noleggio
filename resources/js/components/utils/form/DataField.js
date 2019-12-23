import React, { Fragment } from "react";

const DataField = ({name , placeholder,className='', label, required, value, _handleFocus, _handleChange, helperText}) => (
    <div className="input-field">
        { label != null ? <label 
        //className="pr-1 col-form-label text-md-right"
        className="active " 
        >{label}</label>:''}
        <input
            type="date"
            name={name}
            //className={'form-control ' + className}
            className={'validate ' + className}
            required = {required}
            autoComplete = {placeholder}
            placeholder = {placeholder}
            onFocus = {_handleFocus}
            onChange = {_handleChange}
            value = {value}
        />
        <span className="error-div">{helperText}</span>
    </div>
);

export default DataField;