import React, { Fragment } from "react";

/*const Back = ({name , placeholder, className='', label, required, checked, value, _handleChange}) => (
    <div className={"custom-control custom-checkbox "+ className}>
        <input
            type="radio"
            id = {name+value}
            name={name}
            className={'custom-control-input ' }
            required = {required}
            autoComplete = {placeholder}
            placeholder = {placeholder}
            onChange = {_handleChange}
            checked = {checked}
            value = {value}
        />
        { label != null ? <label className="custom-control-label" htmlFor={name+value}>{label}</label>:''}
    </div>
);*/

const RadioField = ({name , placeholder, className=null, label, required, checked, value, handleChange}) => (
    <div className={className}>
    <label htmlFor={name+value}>
        <input
            type="radio"
            id = {name+value}
            name={name}
            //className={'with-gap'}
            className={'darken-3'}
            required = {required}
            autoComplete = {placeholder}
            placeholder = {placeholder}
            onChange = {handleChange}
            checked = {checked}
            value = {value}
        />
        <span> {label}</span>
    </label>
    </div>
);

export default RadioField;
