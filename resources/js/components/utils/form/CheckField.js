import React, { Fragment } from "react";

const CheckField = ({name , placeholder, style={}, divClassName=null,className='', label, required, checked, defaultChecked, value, handleChange, onChange}) => (
    <div style={style} className={divClassName}>
    <label htmlFor={name+value}>
        <input
            type="checkbox"
            id = {name+value}
            name={name}
            //className={'with-gap'}
            className={'darken-3 '+className}
            required = {required}
            placeholder = {placeholder}
            onChange = {handleChange?handleChange:(onChange?onChange:null)}
            checked = {checked}
            defaultChecked = {defaultChecked}
            value = {value}
        />
        <span> {label}</span>
    </label>
    </div>
);

export default CheckField;
