import React from "react";

const Button = ({ className=null, onClick, children }) => (
  <a className={"btn waves-effect waves-light "+className+" grey lighten-5"} onClick={() => onClick()}>
    {children}
  </a>
);

const ConfirmButton = ({ className=null, onClick, children }) => (
  <a className={"btn waves-effect waves-light light-green darken-2 "+className} onClick={() => onClick()}>
    {children}
  </a>
);

const BackButton = ({ className=null, onClick, children }) => (
  <a className={"btn waves-effect waves-light blue-grey lighten-4  "+className} onClick={() => onClick()}>
    {children}
  </a>
);

const CloseButton = ({ className=null, onClick, children }) => (
  <a className={"btn waves-effect waves-light red darken-1 "+className} onClick={() => onClick()}>
    {children}
  </a>
);

const NextButton = ({ className=null, onClick, children }) => (
  <a className={"btn waves-effect waves-light light-blue darken-3 "+className} onClick={() => onClick()}>
    {children}
  </a>
);

export {Button, ConfirmButton, BackButton, NextButton, CloseButton};
