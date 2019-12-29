import React, { Fragment } from "react";

const DataField = ({name , placeholder,divClassName='',className='', label, required, value, handleFocus, handleChange, helperText}) => (
    <div className={"input-field "+divClassName}>
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
            onFocus = {handleFocus}
            onChange = {handleChange}
            value = {value}
        />
        {helperText}
    </div>
);

export default DataField;
