import {useState} from 'react';
import './Header.css';
import Config from './Config/Config'

function Header(){

  const [showConfig, setShowConfig] = useState(false);

  return (
    <div>
      <div class='top' onClick={() => setShowConfig(curr => !curr)}>
        <div class='side'></div>
        <div class='center'>
        {showConfig? <span>Settings </span>: null}
        </div>
        <div class='side'>⚙️</div>
      </div>
      
      <Config showConfig={showConfig}/>
    </div>
  )
}

export default Header