import React, { Fragment } from "react";

const InputField = ({name ,divClassName='', className='', placeholder, label, required, value, _handleFocus, _handleChange,helperText}) => (
    <div className={"input-field "+divClassName}>
        { label != null ? <label
        //className="pr-1 col-form-label text-md-right"
        className="" 
        htmlFor={name}>{label}</label>:''}
        <input
            type="text"
            id = {name}
            name={name}
            //className={'form-control validate' + className}
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

export default InputField;