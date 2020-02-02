import React, { Fragment } from "react";

const CheckField = ({name , placeholder, className=null, label, required, checked, defaultChecked, value, handleChange}) => (
    <div className={className}>
    <label htmlFor={name+value}>
        <input
            type="checkbox"
            id = {name+value}
            name={name}
            //className={'with-gap'}
            className={'darken-3'}
            required = {required}
            placeholder = {placeholder}
            onChange = {handleChange}
            checked = {checked}
            defaultChecked = {defaultChecked}
            value = {value}
        />
        <span> {label}</span>
    </label>
    </div>
);

export default CheckField;
