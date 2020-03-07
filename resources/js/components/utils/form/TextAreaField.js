import React from "react";

const TextAreaField = ({name , value, placeholder, required, handleChange, label, divClassName='', className='', style, helperText}) => (
    <div className={"input-field "+divClassName}>
    { label != null ? <label
        className=""
        htmlFor={name}>{label}</label>:''}
    <textarea
        type = "text"
        name = {name}
        value = {value}
        required = {required}
        className={className}
        style = {style!=undefined? style : ({ height : "80px" })}
        autoComplete = "off"
        placeholder = {placeholder}
        onChange = {handleChange}
    />
    {helperText}
    </div>
);

export default TextAreaField;