import React from "react";

const Button = ({ className='',title='', onClick, children, disabled=false}) => (
  <a title={title} className={"btn waves-effect waves-light "+className+" grey lighten-5" +(disabled?' disabled':'')} onClick={(e) => onClick(e)}>
    {children}
  </a>
);

const ConfirmButton = ({ className='',style, onClick, children, disabled=false}) => (
  <a style={style} className={"btn confirm btn-success waves-effect waves-light light-green darken-2 "+className +(disabled?' disabled':'')}
    onClick={() => onClick()}>
    {children}
  </a>
);

const EditButton = ({ className='', onClick, children, disabled=false}) => (
  <a className={"btn edit btn-secondary waves-effect waves-light light-green darken-2 "+className +(disabled?' disabled':'')}
    onClick={() => onClick()}>
    {children}
  </a>
);

const AddButton = ({ className='', onClick, children, disabled=false}) => (
  <a className={"btn add btn-info waves-effect waves-light light-green darken-2 "+className +(disabled?' disabled':'')}
    onClick={() => onClick()}>
    {children}
  </a>
);

const BackButton = ({ className='', onClick, children, disabled=false}) => (
  <a className={"btn back waves-effect waves-light blue-grey lighten-4  "+className +(disabled?' disabled':'')} onClick={() => onClick()}>
    {children}
  </a>
);

const CloseButton = ({ className='', onClick, children, disabled=false}) => (
  <a className={"btn close btn-danger waves-effect waves-light red darken-1 "+className +(disabled?' disabled':'')} onClick={() => onClick()}>
    {children}
  </a>
);

const NextButton = ({ className='', onClick, children, disabled=false}) => (
  <a className={"btn next waves-effect waves-light light-blue darken-3 "+className +(disabled?' disabled':'')} onClick={() => onClick()}>
    {children}
  </a>
);

export {Button, ConfirmButton, BackButton, NextButton, CloseButton, AddButton, EditButton};
