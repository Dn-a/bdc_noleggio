import React, { Fragment } from "react";

const RangeField = ({name ,label, divClassName='',helperText, className='',id='', min, max, value, handleChange}) => (
    <div className={"input-field "+divClassName}>
    { label != null ? <label className="pr-1 mb-1 col-form-label text-md-right" htmlFor={name}>{label}</label>:''}
        <input type="range" name={name} min={min} max={max} value={value} className={className} id={id} onChange={handleChange} />
        {helperText}
    </div>
);

export default RangeField;
