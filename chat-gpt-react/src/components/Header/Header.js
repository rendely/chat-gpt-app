import {useState} from 'react';
import './Header.css';
import Config from './Config/Config'

function Header(){

  const [showConfig, setShowConfig] = useState(false);

  return (
    <div>
      <div className='top' onClick={() => setShowConfig(curr => !curr)}>
        <div className='side'></div>
        <div className='center'>
        {showConfig? <span>Settings </span>: null}
        </div>
        <div className='side'>⚙️</div>
      </div>
      
      <Config showConfig={showConfig}/>
    </div>
  )
}

export default Header