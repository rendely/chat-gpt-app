import './App.css';
import {SSE} from 'sse.js';
import {useEffect, useState} from 'react';

function App() {

  const [message, setMessage] = useState('init');
  const [messages, setMessages] = useState([
    {"role": "system", "content": "You are a helpful, concise assistant."}, 
    {"role": "user", "content": message}
    ])

  useEffect(() => {
    let reply = '';
    if (message === 'init') return 
    let url = "https://api.openai.com/v1/chat/completions";
   

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
          console.log("Text: " + text);
          console.log(reply)
        }
      } else {
        source.close();
      }
    });

    source.addEventListener("readystatechange", (e) => {
      if (e.readyState >= 2) {
        console.log('ready state change')
        console.log(reply);
        setMessages(currMessages => [...currMessages,
          {"role": "assistant", "content": reply}]
        );
      }
    });

    source.stream();

  },[message]);

  function handleSubmit(e){
    e.preventDefault();    
    setMessages(currMessages => [...currMessages,
      {"role": "user", "content": e.target['message'].value}]
    )
    setMessage(e.target['message'].value);
    e.target['message'].value = '';
  }

  console.log(messages);

  return (
    <div className="App">
      <header className="App-header">
        Chat GPT
      </header>
      <div className='container'>
        <form onSubmit={handleSubmit}>
        <input name='message' type='text'></input>
        <button type='submit'>Send</button>
        </form>
        <div className='chats'>
        {messages.map((m, idx) => (
          <div key={idx}>{m.role}: {m.content}</div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default App;
