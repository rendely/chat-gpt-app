import React from 'react';
import './Config.css';

function Config({showConfig}){
  return (<div class={`Config ${showConfig? null :'close'}`}>
    {showConfig?
    <span>Hi</span>
  :null}
  </div>)
}

export default Config

