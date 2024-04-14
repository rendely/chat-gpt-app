import { SSE } from 'sse.js';
import { useEffect, useState, useRef } from 'react';
import './Inputs.css';

function Inputs({configs, updateConfigs, updateLiveReply}){

  
  const inputRef = useRef()

  function updateMessages(role, message){
    updateConfigs({...configs, messages: [...configs.messages, {
      role: role, content: message
    }]});
    setInput('');
    inputRef.current.focus()
  }

  function clearMessages(){
    updateConfigs({...configs, messages: configs.messages.slice(0,1)});
    setInput('');
    inputRef.current.focus()
  }

  const [input, setInput] = useState('')

  useEffect(() => {
    let reply = '';
    if (configs.messages.length < 2) return
    if (configs.messages[configs.messages.length -1].role !== 'user') return

    updateMessages('assistant', '...');

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
            updateLiveReply(reply);
          }
        })

      } else {
        updateMessages('assistant',reply);
        source.close();
      }
    });

    source.addEventListener("readystatechange", (e) => {
      if (e.readyState >= 2) console.log('ready state change')
    });

    source.stream();


  }, [configs.key])

  function handleImage() {
    updateMessages('user', 'Generate image of ' + input);
    // updateMessages('assistant', 'Working on it...');


    fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: configs.key,
      },
      body: JSON.stringify({
        "model": "dall-e-3",
        "prompt": input,
        "n": 1,
        "size": "1024x1024"
      })
    })
      .then(r => r.json())
      .then(d => {
        updateMessages('assistant',d['data'][0]['revised_prompt']);
        // updateMessages('assistant',d['data'][0]['url']);
      });

  }

  return (<div className='Inputs'>
    <textarea 
      ref={inputRef}
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
      <button 
        className='send button'
        onClick={handleImage}
        >Image</button>
      <button 
        className='clear button'
        onClick={clearMessages}
      >Clear</button>
      </>}
    </div>
  </div>)
}

export default Inputs

