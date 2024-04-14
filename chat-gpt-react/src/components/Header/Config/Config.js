import {useState} from 'react';
import Option from './Option/Option'
import './Config.css';

function Config({showConfig}){

  const envAuthToken = process.env.REACT_APP_SECRET_KEY;
  const localModel = localStorage.getItem('localModel');
  const [model, setModel] = useState(localModel ? localModel : '3.5');

  return (<div className={`Config ${showConfig? null :'close'}`}>
    {showConfig? 
    <>
      <div className='row'>Your ChatGPT API key: </div>
      <div className='row'>
        <input className='input' value={envAuthToken} />
      </div>
      <div className='row'>Model:</div>
      <div className='row'>
        <Option option={{name: 'Chat GPT 3.5', selected: false}} />
        <Option option={{name: 'Chat GPT 4 Vision', selected: true}} />
        <Option option={{name: 'Anthropic', selected: false}} />
      </div>
    </>
  :null}
  </div>)
}

export default Config

