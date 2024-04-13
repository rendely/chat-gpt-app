import {useState} from 'react';
import './Header.css';
import Config from '../Config/Config'

function Header(){

  const [showConfig, setShowConfig] = useState(false);

  return (
    <div class='Header' onClick={() => setShowConfig(curr => !curr)}>
      ⚙️
      {showConfig? <Config /> : null}
    </div>
  )
}

export default Header