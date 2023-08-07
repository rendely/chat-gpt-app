import './App.css';
import { SSE } from 'sse.js';
import { useEffect, useState, useRef } from 'react';

function App() {
  const [authToken, setAuthToken] = useState('');
  const [showAuth, setShowAuth] = useState(true);
  const [message, setMessage] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');

  const [messages, setMessages] = useState([
    { "role": "system", "content": "You are a helpful, concise assistant." }
  ]);
  const [liveReply, setLiveReply] = useState({ "role": "assistant", "content": "" });
  const scrollRef = useRef();
  const formRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
    }

  }, [liveReply, messages])

  useEffect(() => {
    let localStorageAuthToken = localStorage.getItem('authToken');
    let envAuthToken = process.env.REACT_APP_SECRET_KEY;
    if (envAuthToken || localStorageAuthToken) {
      setAuthToken(envAuthToken || localStorageAuthToken);
      setShowAuth(false);
      localStorage.setItem('authToken', envAuthToken || localStorageAuthToken);
    }
  }, [])

  useEffect(() => {
    let reply = '';
    if (messages[messages.length - 1].role !== 'user') return
    const url = "https://api.openai.com/v1/chat/completions";
    let data = {
      "model": model,
      "messages": messages,
      "stream": true
    }

    let source = new SSE(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      method: "POST",
      payload: JSON.stringify(data),
    });

    source.addEventListener("message", (e) => {
      if (e.data !== "[DONE]") {
        let payload = JSON.parse(e.data);
        let text = payload.choices[0].delta.content;
        if (text !== undefined && text !== "\n") {
          reply += text;
          setLiveReply({ ...liveReply, content: reply });
        }
      } else {
        setMessages(currMessages => [...currMessages,
        { "role": "assistant", "content": reply }]);
        setLiveReply({ ...liveReply, content: '' });
        source.close();
      }
    });

    source.addEventListener("readystatechange", (e) => {
      if (e.readyState >= 2) console.log('ready state change')
    });

    source.stream();


  }, [messages])

  function handleSubmit(e) {
    e.preventDefault();
    setMessages(currMessages => [...currMessages,
    { "role": "user", "content": message }])
    setMessage('');
  }

  function handleChange(e) {
    setMessage(e.target.form['message'].value)
  }

  function handleAuthSubmit(e) {
    e.preventDefault();
    let newAuthToken = e.target['auth'].value;
    localStorage.setItem('authToken', newAuthToken);
    setAuthToken(newAuthToken);
    setShowAuth(false);
    console.log("Updated auth token");
  }

  function handleModelChange(e){
    setModel(e.target.value)
  }

  function handleKeyboardShortcuts(e){
    if (e.code === 'Enter' && e.ctrlKey){
      handleSubmit(e);
    }
  }
  return (
    <div className="App" >
      <header className="App-header">
        <h1>ChatGPT via API</h1>
        {!showAuth ? <button onClick={() => setShowAuth(true)}>Edit auth</button> : 
        <form name='auth' onSubmit={handleAuthSubmit} style={{ width: '400px' }}>
          <input type='text' autoComplete="off" name='auth'></input>
          <div><button type='submit' style={{ width: '100px' }}>Update auth</button></div>
        </form>
        }
        <form name='model' onChange={handleModelChange}>
        <input type="radio" name="model" value="gpt-3.5-turbo" id="model-3"
        checked={model === 'gpt-3.5-turbo'}
        onChange={handleModelChange}
        ></input>
        <label>gpt-3.5-turbo</label>
        <input type="radio" name="model" value="gpt-3.5-turbo-16k" id="model-3"
        checked={model === 'gpt-3.5-turbo-16k'}
        onChange={handleModelChange}
        ></input>
        <label>gpt-3.5-turbo-16k</label>

        <input type="radio" name="model" value="gpt-4" id="model-4"
        checked={model === 'gpt-4'}
        onChange={handleModelChange}
        ></input>
        <label>gpt-4</label>
        </form>
        
      </header>
      <div style={{maxWidth: '800px', margin: 'auto'}}>
      <div style={{ marginBottom: '150px' }} >
        {[...messages, liveReply].slice(1).map((m, idx) => m.content !== '' ? (
          <div className={`message ${m.role === 'user' && 'user'}`} key={idx}
            style={{ display: 'flex', paddingBottom: '20px', paddingTop: '20px' }}>
            <div style={{ width: '100px', textAlign: 'right', paddingRight: '30px' }}> {m.role}</div>
            <div style={{ flexGrow: 1, maxWidth: '66%', textAlign: 'left' }}>
              {m.content.split('\n').map((line, index) => (<div key={index}>{line}</div>))}
            </div>
          </div>
        ) : null)}
      </div>
      <form name='chat' onSubmit={handleSubmit} ref={formRef}>
        <div style={{ height: '100px', width: '100%', maxWidth: '800px', position: 'fixed', padding: '10px', bottom: '0px', display: 'flex', backgroundColor: 'white', zIndex: 3, boxSizing: 'border-box'}}>
          <textarea onKeyDown={handleKeyboardShortcuts} style={{ flexGrow: 1, marginRight: '10px', borderRadius: '10px', resize: 'none', padding: '10px', outline: 'none', borderColor: 'darkgray'}} autoComplete="off" onChange={handleChange} name='message' type='text' value={message}></textarea>
          <button style={{ flexGrow: 1, maxWidth: '100px', borderRadius: '10px', outline: 'none', borderColor: 'transparent',  }} type='submit'>Send <br></br><span style={{fontSize: '0.5rem'}}>(Control + Enter)</span></button>
        </div>
      </form>
      <div ref={scrollRef}></div>
      </div>
    </div>
  );
}

export default App;
