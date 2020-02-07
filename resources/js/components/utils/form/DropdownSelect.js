import React, { Fragment } from "react";

const DropdownSelect = ({name ,label,placeholder,divClassName='',className='', firstValue, required, values, selected,defaultSelected, handleChange}) => (
    <div className={"input-field "+divClassName}>
    { label != null ? <label className="pr-1 mb-1 col-form-label text-md-right" htmlFor={name}>{label}</label>:''}
    <select name ={name} className={'form-control ' + className} defaultValue={defaultSelected} value={selected} required = {required} onChange = {handleChange} >

        {placeholder!==undefined && <option value='default'  disabled={true}>{placeholder}</option>}

        {firstValue!==undefined && <option value ={firstValue}>{firstValue? firstValue:''}</option>}

        {Object.keys(values).map(
            (id) => <option value ={id} key = {id} >{values[id]}</option>
        )}
    </select>
    </div>
);

export default DropdownSelect;
