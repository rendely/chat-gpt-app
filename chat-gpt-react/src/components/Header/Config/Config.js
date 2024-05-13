import {useEffect, useState} from 'react';
import Option from './Option/Option'
import './Config.css';
import { useKeyboardShortcuts } from '../../../useKeyboardShortcuts';

function Config({showConfig, configs, updateConfigs}){

  //keyboard shortcuts
  const keyboardShortcut = useKeyboardShortcuts();
  
  useEffect(() => {
    if (keyboardShortcut === 'model') {
      
      if (configs.model === 'gpt-4o')
        handleModelChange('gpt-3.5-turbo')
      else
        handleModelChange('gpt-4o')
    }
  }, [keyboardShortcut]);

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
          option={{name: 'Chat GPT 3.5', selected: configs.model === 'gpt-3.5-turbo'}} 
          handleClick={() => handleModelChange('gpt-3.5-turbo')}
        />
        <Option 
          option={{name: 'Chat GPT 4 Vision', selected: configs.model === 'gpt-4o'}} 
          handleClick={() => handleModelChange('gpt-4o')}
        />
      </div>
    </>
  :null}
  </div>)
}

export default Config

