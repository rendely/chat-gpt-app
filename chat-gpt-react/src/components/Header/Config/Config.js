import { useEffect, useState } from 'react';
import Option from './Option/Option'
import './Config.css';
import { useKeyboardShortcuts } from '../../../useKeyboardShortcuts';

function Config({ showConfig, configs, updateConfigs }) {

  const models = ['gpt-4.1', 'gpt-4.1-mini', 'o1', 'o3','o4-mini'];

  const keyboardShortcut = useKeyboardShortcuts();

  useEffect(() => {
    if (keyboardShortcut === 'model') {

      const currentIndex = models.indexOf(configs.model);
      const nextModel = models[(currentIndex + 1) % models.length];
      handleModelChange(nextModel);

    }
  }, [keyboardShortcut]);

  function handleModelChange(model) {
    updateConfigs({ model: model });
  }

  function handleKeyChange(key) {
    updateConfigs({ key: key });
  }


  return (<div className={`Config ${showConfig ? null : 'close'}`}>
    {showConfig ?
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
          {models.map((model) => (
            <Option
              key={model}
              option={{ name: model, selected: configs.model === model }}
              handleClick={() => handleModelChange(model)}
            />
          ))}
        </div>
      </>
      : null}
  </div>)
}

export default Config