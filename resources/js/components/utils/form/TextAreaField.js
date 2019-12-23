import React from "react";

const TextAreaField = ({name , placeholder, required, _handleChange}) => (
    <textarea
        type = "text"
        name = {name}
        required = {required}
        style = {{ height : "80px" }}
        autoComplete = "off"
        placeholder = {placeholder}
        onChange = {_handleChange}
    />
);

export default TextAreaField;