import './App.css';
import { SSE } from 'sse.js';
import { useEffect, useState, useRef } from 'react';

function App() {
  const [authToken, setAuthToken] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { "role": "system", "content": "You are a helpful, concise assistant." }
  ]);
  const [liveReply, setLiveReply] = useState({ "role": "assistant", "content": "" });
  const scrollRef = useRef();

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
      localStorage.setItem('authToken', envAuthToken || localStorageAuthToken);
    }
  }, [])

  useEffect(() => {
    let reply = '';
    if (messages[messages.length - 1].role !== 'user') return
    const url = "https://api.openai.com/v1/chat/completions";
    let data = {
      "model": "gpt-3.5-turbo",
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
    console.log("Updated auth token");
  }

  return (
    <div className="App">
      <header className="App-header">
        Chat GPT
        <form name='auth' onSubmit={handleAuthSubmit} style={{ width: '400px' }}>
          <input type='text' autoComplete="off" name='auth'></input>
          <div><button type='submit' style={{ width: '100px' }}>Update auth</button></div>
        </form>
      </header>
      <div style={{ marginBottom: '100px' }} >
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
      <form name='chat' onSubmit={handleSubmit}>
        <div style={{ height: '100px', width: '100%', position: 'fixed', bottom: '0px', display: 'flex' }}>
          <textarea style={{ flexGrow: 1 }} autoComplete="off" onChange={handleChange} name='message' type='text' value={message}></textarea>
          <button style={{ width: '100px' }} type='submit'>Send</button>
        </div>
      </form>
      <div ref={scrollRef}></div>
    </div>
  );
}

export default App;
