import React from "react";

const TextAreaField = ({name , value, placeholder, required, handleChange, onMouseUp, onKeyUp, label, divClassName='', className='', style, helperText}) => (
    <div className={"input-field "+divClassName}>
    { label != null ? <label
        className=""
        htmlFor={name}>{label}</label>:''}
    <textarea
        type = "text"
        name = {name}
        value = {value!=null ? value : undefined}
        required = {required}
        className={className}
        style = {style!=undefined? style : ({ height : "80px" })}
        autoComplete = "off"
        placeholder = {placeholder}
        onChange = {handleChange}
        onMouseUpCapture={onMouseUp}
        onKeyUp={onKeyUp}
    />
    {helperText}
    </div>
);

export default TextAreaField;