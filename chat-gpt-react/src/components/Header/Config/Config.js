import React from 'react';
import './Config.css';

function Config({showConfig}){

  const envAuthToken = process.env.REACT_APP_SECRET_KEY;

  return (<div className={`Config ${showConfig? null :'close'}`}>
    {showConfig? 
    <>
      <div className='row'>Your ChatGPT API key: </div>
      <div className='row'>
        <input className='input' value={envAuthToken} />
      </div>
      <div className='row'>Model:</div>
      <div className='row'>
        <div><input type='radio' name='model' value='3' /><label>Chat GPT 3.5 Turbo</label></div>
        <div><input type='radio' name='model' value='4' /><label>Chat GPT 4 Turbo</label></div>
      </div>
    </>
  :null}
  </div>)
}

export default Config

