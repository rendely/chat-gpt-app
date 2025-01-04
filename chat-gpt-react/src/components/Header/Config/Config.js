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
        handleModelChange('gpt-4o-mini')
      else if (configs.model === 'gpt-4o-mini')
        handleModelChange('gpt-4o')
      else
        handleModelChange('gpt-4o-mini')
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
          option={{name: 'Chat 4o mini', selected: configs.model === 'gpt-4o-mini'}} 
          handleClick={() => handleModelChange('gpt-4o-mini')}
        />
        <Option 
          option={{name: 'Chat GPT 4o', selected: configs.model === 'gpt-4o'}} 
          handleClick={() => handleModelChange('gpt-4o')}
        />
        <Option 
          option={{name: 'o1', selected: configs.model === 'o1'}} 
          handleClick={() => handleModelChange('o1')}
        />
        <Option 
          option={{name: 'o1 mini', selected: configs.model === 'o1-mini'}} 
          handleClick={() => handleModelChange('o1-mini')}
        />
      </div>
    </>
  :null}
  </div>)
}

export default Config