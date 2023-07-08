import './App.css';
import {SSE} from 'sse.js';
import {useEffect, useState} from 'react';

function App() {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {"role": "system", "content": "You are a helpful, concise assistant."}
    ]);
  const [liveReply, setLiveReply] = useState({"role": "assistant", "content": ""});

  useEffect(() => {
    let reply = '';
    if (messages[messages.length -1].role !== 'user') return 
    const url = "https://api.openai.com/v1/chat/completions";
    let data = {
      "model": "gpt-3.5-turbo",
      "messages": messages,
      "stream": true
    }

    let source = new SSE(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.REACT_APP_SECRET_KEY}`,
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
          setLiveReply({...liveReply, content: reply});
        }
      } else {
        setMessages(currMessages => [...currMessages,
          {"role": "assistant", "content": reply}]);
          setLiveReply({...liveReply, content: ''});
        source.close();
      }
    });

    source.addEventListener("readystatechange", (e) => {
      if (e.readyState >= 2) console.log('ready state change')
    });

    source.stream();

  },[messages])

  function handleSubmit(e){
    e.preventDefault();
    setMessages(currMessages => [...currMessages,
      {"role": "user", "content": message}])
    setMessage('');
  }

  function handleChange(e){
    setMessage(e.target.form['message'].value)
  }

  return (
    <div className="App">
      <header className="App-header">
        Chat GPT
      </header>
      <div className='container'>
        
        <div className='chats'>
        {[...messages, liveReply].slice(1).map((m, idx) => m.content !== '' ? (
          <div className={`message ${m.role=='user' && 'user'}`} key={idx}>
            <div className='role'>{m.role}:</div>
            <div className='content'>{m.content}</div>
          </div>
        ): null)}
        {/* {liveReply.length > 0 ? `assistant: ${liveReply}` : null} */}
        </div>
        <form onSubmit={handleSubmit}>
        <input onChange={handleChange} name='message' type='text' value={message}></input>
        <button type='submit'>Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
