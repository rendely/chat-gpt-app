import {useState} from 'react';
import './Inputs.css';

function Inputs(){

  const [input, setInput] = useState('')

  return (<div className='Inputs'>
    <textarea 
      autoFocus
      className='inputText' 
      onChange={e => setInput(e.target.value)}>      
    </textarea>
    <div className={`buttons ${input === '' ? 'close' : ''}`}>
      {input === '' ? null : <>
      <button className='send button'>Send</button>
      <button className='send button'>Image</button>
      <button className='clear button'>Clear</button>
      </>}
    </div>
  </div>)
}

export default Inputs

