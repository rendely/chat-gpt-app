import { SSE } from 'sse.js';
import { useEffect, useState } from 'react';
import './Inputs.css';

function Inputs({configs, updateConfigs}){

  const [liveReply, setLiveReply] = useState('');

  function updateMessages(role, message){
    updateConfigs({...configs, messages: [...configs.messages, {
      role: role, content: message
    }]});
    setInput('');
  }

  function clearMessages(){
    updateConfigs({...configs, messages: configs.messages.slice(0,1)});
    setInput('');
  }

  const [input, setInput] = useState('')

  useEffect(() => {
    let reply = '';
    if (configs.messages.length < 2) return
    if (configs.messages[configs.messages.length -1].role !== 'user') return

    const url = "https://api.openai.com/v1/chat/completions";
    let data = {
      "model": configs.model,
      "messages": configs.messages,
      "stream": true
    }

    let source = new SSE(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: configs.key,
      },
      method: "POST",
      payload: JSON.stringify(data),
    });

    source.addEventListener("message", (e) => {
      if (e.data !== "[DONE]") {
        const data = `[${e.data.replace('}{', '},{')}]`;
        let payload = JSON.parse(data);
        payload.forEach(p => {
          let text = p.choices[0].delta.content;
          if (text !== undefined && text !== "\n") {
            reply += text;
            setLiveReply({ ...liveReply, content: reply });
          }
        })

      } else {
        console.log(reply);
        updateMessages('assistant',reply);
        setLiveReply({ ...liveReply, content: '' });
        source.close();
      }
    });

    source.addEventListener("readystatechange", (e) => {
      if (e.readyState >= 2) console.log('ready state change')
    });

    source.stream();


  }, [configs.messages])

  return (<div className='Inputs'>
    <textarea 
      autoFocus
      className='inputText' 
      value={input}
      onChange={e => setInput(e.target.value)}>      
    </textarea>
    <div className={`buttons ${input === '' && configs.messages.length === 1 ? 'close' : ''}`}>
      {input === '' && configs.messages.length === 1 ? null : <>
      <button 
        className='send button'
        onClick={() => {
          updateMessages('user', input);          
        }}
      >Send</button>
      <button className='send button'>Image</button>
      <button 
        className='clear button'
        onClick={clearMessages}
      >Clear</button>
      </>}
    </div>
  </div>)
}

export default Inputs

