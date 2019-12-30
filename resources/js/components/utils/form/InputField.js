import React, { Fragment } from "react";

const InputField = ({name ,type='', divClassName='', className='', placeholder,autocomplete='off', label, required, value, handleFocus, handleChange, helperText, dataList}) => (
    <div className={"input-field "+divClassName}>
        { label != null ? <label
        //className="pr-1 col-form-label text-md-right"
        className=""
        htmlFor={name}>{label}</label>:''}
        <input
            type={type!=''? type : "text"}
            id = {name}
            name={name}
            //className={'form-control validate' + className}
            className={'validate ' + className}
            required = {required}
            autoComplete = {autocomplete}
            placeholder = {placeholder}
            onFocus = {handleFocus}
            onChange = {handleChange}
            value = {value}

        />
        {helperText}
        { dataList != null &&
          <datalist id={name}>
            {
                dataList.map((value,id) => {
                    console.log(value);
                    return(
                        <option key={id} value={value} >AA</option>
                    );
                })
            }
          </datalist>
        }
    </div>
);

export default InputField;
