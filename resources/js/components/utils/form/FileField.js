import React, { Fragment } from "react";

const FileField = ({name ,type='', divClassName='', className='', placeholder, label, required, value, handleFocus, handleChange, helperText, dataList}) => (
    <div className={"input-field "+divClassName}>
        { label != null ? <label
        //className="pr-1 col-form-label text-md-right"
        className=""
        htmlFor={name}>{label}</label>:''}
        <input
            type={type!=''? type : "file"}
            id = {name}
            name={name}
            //className={'form-control validate' + className}
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

export default FileField;
