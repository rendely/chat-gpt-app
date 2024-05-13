import {useState} from 'react';
import './Header.css';
import Config from './Config/Config'

function Header({configs, updateConfigs}){

  const [showConfig, setShowConfig] = useState(false);

  return (
    <div>
      <div className='top' onClick={() => setShowConfig(curr => !curr)}>
        <div className='side'></div>
        <div className='center'>
          {configs.model}
        {/* {showConfig? <span>Settings </span>: null} */}
        </div>
        <div className='side'>Settings</div>
      </div>
      
      <Config showConfig={showConfig} configs={configs} updateConfigs={updateConfigs}/>
    </div>
  )
}

export default Header