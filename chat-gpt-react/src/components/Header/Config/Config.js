import {useState} from 'react';
import Option from './Option/Option'
import './Config.css';

function Config({showConfig, configs, updateConfigs}){

  function handleModelChange(model){
    updateConfigs({model: model});
  }

  function handleKeyChange(key){
    updateConfigs({key: key});
  }


  return (<div className={`Config ${showConfig? null :'close'}`}>
    {showConfig? 
    <>
      <div className='row heading'>Your ChatGPT API key: </div>
      <div className='row'>
        <input 
          className='input' 
          onChange={(e) => handleKeyChange(e.target.value)}
          value={configs.key} />
      </div>
      <div className='row heading'>Model:</div>
      <div className='row'>
        <Option 
          option={{name: 'Chat GPT 3.5', selected: configs.model === '3.5'}} 
          handleClick={() => handleModelChange('3.5')}
        />
        <Option 
          option={{name: 'Chat GPT 4 Vision', selected: configs.model === '4'}} 
          handleClick={() => handleModelChange('4')}
        />
      </div>
    </>
  :null}
  </div>)
}

export default Config

